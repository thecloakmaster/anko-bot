const ClubList = require(`../../database/ClubLists.js`)
const ClubInfo = require(`../../database/ClubInfo.js`)
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: `clubinfo`,
    description: `Gives the information about a club in the server.`,
    usage: `;clubinfo <Club Name>`,
    aliases: [`cinfo`],
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
                   return message.channel.send(`No club with the name \`${args.join(" ").toLowerCase()}\` was found in this server.`)
                } else if (clubsArr.indexOf(`${args.join(" ").toLowerCase()}`) != -1) {
                    let clubInformation = await ClubInfo.findOne({
                        ClubName: `${args.join(" ").toLowerCase()}`,
                        GuildID: `${message.guild.id}`,
                        ClientID: `${client.user.id}`
                    })
                    if (!clubInformation) {
                        return message.channel.send(`No club with the name \`${args.join(" ").toLowerCase()}\` was found in this server.`)
                    } else if (clubInformation) {
                        let clubOwner;
                        if (clubInformation.ClubOwnerID !== 'none') {clubOwner = await client.users.fetch(`${clubInformation.ClubOwnerID}`).catch(() => {})}
                        let infoEmbed = new MessageEmbed()
                        .setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTitle(`${clubInformation.ClubName.toLowerCase()}`)
                        .setDescription(`${clubInformation.ClubDescription}`)
                        if (clubInformation.ClubOwnerID === 'none') {
                            infoEmbed.addField(`Club Owner`, `No one owns this club`)
                            infoEmbed.addField(`Allows pings?`, `${clubInformation.ClubPingBool.toString().charAt(0).toUpperCase() + clubInformation.ClubPingBool.toString().slice(1)}`, true)
                            infoEmbed.setColor(`${process.env.colour || `e4a353`}`)
                        } else {
                            infoEmbed.addField(`Club Owner`, `<@!${clubOwner.id}>`)
                            infoEmbed.addField(`Allows pings?`, `${clubInformation.ClubPingBool.toString().charAt(0).toUpperCase() + clubInformation.ClubPingBool.toString().slice(1)}`, true)
                            infoEmbed.setColor(`${process.env.colour || `e4a353`}`)
                        }                                    
                        if (clubInformation.ClubRoleID != 'null' && clubInformation.ClubRoleID) infoEmbed.addField(`Club role`, `<@&${clubInformation.ClubRoleID}>`)
                        let memberDesc = ''
                        if(clubInformation.MembersList.length == 0) {
                            memberDesc = `No members`
                        } else {
                            clubInformation.MembersList.forEach(member => {
                                memberDesc += `<@!${member}>, `
                            });
                            memberDesc = memberDesc.slice(0, memberDesc.length - 2);
                        }                                                             
                        let memberEmbed = new MessageEmbed()
                        .setColor(`${process.env.colour || `e4a353`}`)
                        .setTitle(`Members`)
                        .setDescription(`${memberDesc}`)
                        return message.channel.send({embeds: [infoEmbed, memberEmbed]})
                    }
                }
            }
        } else if (!guildClubList) {
            return message.channel.send(`This server does not have clubs setup.`)
        } 
    }
}