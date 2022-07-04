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
                    if (!guild) {
                        await MuteRole.deleteMany({
                            GuildID: guildID
                        })
                        await MutedMember.deleteMany({
                            GuildID: guildID
                        })
                        console.log(`Deleted mutes for a non-existent guild.`)
                    }
                    let mutedRole = muteRoleLoop.MuteRoleID;
                    let guildMuteRole = await guild.roles.fetch(`${mutedRole}`).catch(() => {});
                    if (!guildMuteRole) {
                        await MuteRole.deleteMany({
                            GuildID: guildID,
                            MuteRoleID: mutedRole
                        })
                        await MutedMember.deleteMany({
                            GuildID: guildID
                        })
                        console.log(`Deleted mutes of a non-existent role.`)
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
                                console.log(`Removed a mute in the DB.`)
                            }                            
                            continue;
                        } else if (member) {
                            if (Date.now() >= mutedMemberLoop.LastsTill) {
                                await MutedMember.findOneAndRemove({
                                    UserID: mutedMemberLoop.UserID,
                                    GuildID: mutedMemberLoop.GuildID,
                                    LastsTill: mutedMemberLoop.LastsTill
                                })
                                await member.roles.remove(mutedRole).catch((err) => console.log(err))
                                console.log(`Removed a mute in the DB for ${member.user.id}.`)
                            }
                        }
                    }
                    console.log(`Finished checking for unmutes.`)
                }
            } catch (err) {
                console.log(err)
            }
        }, 30*60*1000)
    }
}