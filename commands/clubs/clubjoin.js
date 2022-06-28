const ClubList = require(`../../database/ClubLists.js`)
const ClubInfo = require(`../../database/ClubInfo.js`)
const {
    MessageEmbed
} = require("discord.js")

module.exports = {
    name: `clubjoin`,
    description: `Adds you as a club member in the specified club.`,
    usage: `;clubjoin <Club Name>`,
    async execute(message, args, client) {
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
                        let clubMemberArr = clubInformation.MembersList
                        if (clubMemberArr.indexOf(`${message.author.id}`) != -1) {
                            return message.channel.send(`You are already in this club.`)
                        }
                        clubMemberArr.push(`${message.author.id}`)                        
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
                                    await message.member.roles.add(role)
                                }
                            }
                            return message.channel.send(`You have joined the club \`${args.join(" ")}\``)
                        })
                        let clubRoleID = clubInformation.ClubRoleID
                        if (clubMemberArr.length > 25 && clubRoleID == `null`) {
                            let clubRole = await message.guild.roles.create({
                                    name: `${clubInformation.ClubName.toLowerCase()}`
                                })
                            clubMemberArr.forEach(async (user) => {
                                await message.guild.members.fetch(user).then(async (member) => {
                                    await member.roles.add(clubRole)
                                }).catch((e) => {console.log(e)})
                            })
                        }
                    }
                }
            }
        } else if (!guildClubList) {
            return message.channel.send(`This server does not have clubs setup.`)
        }
    }
}