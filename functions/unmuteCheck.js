const MuteRole = require(`../database/MuteRole.js`)
const MutedMember = require('../database/MutedMember.js');
module.exports = {
    async execute(client) {
        setInterval(async function () {
            try {
                console.log(`Starting unmute checking...`)
                let muteRole = await MuteRole.find({
                    ClientID: `${client.user.id}`
                })
                for (const muteRoleLoop of muteRole) {
                    let guildID = muteRoleLoop.GuildID;
                    let guild = await client.guilds.fetch(`${guildID}`).catch(() => {});
                    let muteDeletes = await MutedMember.find({
                        GuildID: guildID
                    })
                    if (!guild) {
                        await MuteRole.findOneAndRemove({
                            GuildID: guildID
                        })
                        for (memberMuteDelete in muteDeletes) {
                            await MutedMember.findOneAndRemove({
                                GuildID: guildID
                            })
                        }
                    }
                    let mutedRole = muteRoleLoop.MuteRoleID;
                    let guildMuteRole = await guild.roles.fetch(`${mutedRole}`).catch(() => {});
                    if (!guildMuteRole) {
                        await MuteRole.findOneAndRemove({
                            GuildID: guildID,
                            MuteRoleID: mutedRole
                        })
                        for (memberMuteDelete in muteDeletes) {
                            await MutedMember.findOneAndRemove({
                                UserID: memberMuteDelete.UserID,
                                GuildID: guildID
                            })
                        }
                    }
                    let mutedMember = await MutedMember.find({
                        GuildID: guildID
                    })
                    for (const mutedMemberLoop of mutedMember) {
                        let member = await guild.members.fetch(mutedMemberLoop.UserID).catch(() => {});
                        if (!member) {
                            if (Date.now() >= mutedMemberLoop.LastsTill) {
                                await MutedMember.findOneAndRemove({
                                    UserID: mutedMemberLoop.UserID,
                                    GuildID: mutedMemberLoop.GuildID,
                                    LastsTill: mutedMemberLoop.LastsTill
                                })
                            }
                            continue;
                        } else if (member) {
                            if (Date.now() >= mutedMemberLoop.LastsTill) {
                                await MutedMember.findOneAndRemove({
                                    UserID: mutedMemberLoop.UserID,
                                    GuildID: mutedMemberLoop.GuildID,
                                    LastsTill: mutedMemberLoop.LastsTill
                                })
                            }
                            await member.roles.remove(mutedRole).catch((err) => console.log(err))
                        }
                    }
                }
            } catch (err) {
                console.log(err)
            }
        },30*60*1000)
    }
}