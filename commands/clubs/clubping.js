const ClubList = require(`../../database/ClubLists.js`)
const ClubInfo = require(`../../database/ClubInfo.js`)

module.exports = {
    name: `clubping`,
    description: `Pings the all the members of the specified club.`,
    usage: `clubping <Club Name>`,
    aliases: [`cping`],
    cooldown: 10000,
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
                        let clubMemberArr = clubInformation.MembersList
                        if (clubMemberArr.indexOf(`${message.author.id}`) == -1) {
                            return message.channel.send(`You are not in this club.`)
                        }
                        if (message.author.id !== clubInformation.ClubOwnerID) {
                            if (clubInformation.ClubPingBool == false) {
                                return message.channel.send(`This club does not allow club pings.`)
                            }
                        }
                        let content = `Club Ping [${clubInformation.ClubName}]: `
                        clubMemberArr.forEach(async (user) => {
                            content += `<@!${user}> `
                        })
                        let clubRoleID = clubInformation.ClubRoleID
                        if (clubRoleID && clubRoleID != 'null') {
                            let clubRole = await message.guild.roles.fetch(`${clubRoleID}`)
                            if (clubRole) {
                                return message.channel.send(`Club Ping [${clubInformation.ClubName}]: <@&${clubRole.id}>`)
                            } else if (!clubRole) {
                                return message.channel.send({content: content})
                            }
                        } else {
                            return message.channel.send({
                                content: content
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