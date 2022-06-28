const ClubList = require(`../../database/ClubLists.js`)
const ClubInfo = require(`../../database/ClubInfo.js`)
const {
    MessageEmbed
} = require("discord.js")

module.exports = {
    name: `clubleave`,
    description: `Removes you from the specified club.`,
    usage: `;clubleave <Club Name>`,
    aliases: [`cleave`],
    async execute(message, args, client) {
        if (!args) {
            return message.channel.send(`Please specify a valid club name.\nSyntax: \`;clubdelete <Club Name>\``)
        }
        let guildClubList = await ClubList.findOne({
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        if (guildClubList) {
            if (guildClubList.ClubEnabled == false) {
                return message.channel.send(`This server does not have clubs enabled.`)
            } else if (guildClubList.ClubEnabled == true) {
                let clubsArr = guildClubList.ClubList
                if (clubsArr.indexOf(`${args.join(" ").toLowerCase()}`) == -1) {
                    return message.channel.send(`No club with the name \`${args.join(" ")}\` was found in this server.`)
                } else if (clubsArr.indexOf(`${args.join(" ").toLowerCase()}`) != -1) {
                    let clubInformation = await ClubInfo.findOne({
                        ClubName: `${args.join(" ").toLowerCase()}`,
                        GuildID: `${message.guild.id}`,
                        ClientID: `${client.user.id}`
                    })
                    if (!clubInformation) {
                        return message.channel.send(`No club with the name \`${args.join(" ")}\` was found in this server.`)
                    } else if (clubInformation) {
                        if (clubInformation.ClubOwnerID === `${message.author.id}`) {
                            return message.channel.send(`You are this club's owner hence you cannot leave this club.`)
                        }
                        let clubMemberArr = clubInformation.MembersList
                        if (clubMemberArr.indexOf(`${message.author.id}`) == -1) {
                            return message.channel.send(`You are not in this club.`)
                        }
                        clubMemberArr = await clubMemberArr.filter(function(element) {return element !== message.author.id})
                        await ClubInfo.findOneAndUpdate({
                            ClubName: `${args.join(" ").toLowerCase()}`,
                            GuildID: `${message.guild.id}`,
                            ClientID: `${client.user.id}`
                        }, {
                            MembersList: clubMemberArr
                        }).then(async () => {
                            if (clubInformation.ClubRoleID) {
                                let role = await message.guild.roles.fetch(`${clubInformation.ClubRoleID}`).catch(() => {})
                                if (role) {
                                    await message.member.roles.remove(role)
                                }
                            }
                            return message.channel.send(`You have left the club \`${args.join(" ")}\``)
                        })
                        let clubRoleID = clubInformation.ClubRoleID
                        if (clubMemberArr.length < 10 && (clubRoleID != `null` || !clubRoleID) && (!clubInformation.ClubChannelID || clubInformation.ClubChannelID === 'null')) {
                            let clubRole = await message.guild.roles.fetch(`${clubRoleID}`)
                            clubMemberArr.forEach(async (user) => {
                                await message.guild.members.fetch(user).then(async (member) => {
                                    await member.roles.remove(clubRole)
                                }).catch(() => {})
                            })
                            await clubRole.delete().catch(() => {})
                        }
                    }
                }
            }
        } else if (!guildClubList) {
            return message.channel.send(`This server does not have clubs setup.`)
        }
    }
}