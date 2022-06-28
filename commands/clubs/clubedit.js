const ClubList = require(`../../database/ClubLists.js`)
const ClubInfo = require(`../../database/ClubInfo.js`)
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: `clubedit`,
    description: `Edits a club's information.`,
    usage: `;clubedit <Club Name>`,
    aliases: [`cedit`],
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_CHANNELS") || !message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_CHANNELS\` & \`MANAGE_ROLES\`.`)
        } else if (!bot.permissions.has("MANAGE_CHANNELS") || !bot.permissions.has("MANAGE_ROLES")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_CHANNELS\` & \`MANAGE_ROLES\`.`)
        }
        if (!args) {
            return message.channel.send(`Please specify a valid club name.\nSyntax: \`;clubedit <Club Name>\``)
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
                        if (clubInformation.ClubOwnerID === 'none') {
                            return message.channel.send(`Cannot edit data of a public club.`)
                        }
                        const filter = m => m.author.id === message.author.id
                        const collector = message.channel.createMessageCollector({
                            filter,
                            max: 3,
                            time: 300000
                        });
                        let editedData, counter = 0, option, edit;                
                        message.channel.send(`Choose an option from below to edit.\n1. Club Owner\n2. Allow/Disable Club Pings`)
                        collector.on(`collect`, async (m) => {
                            if (counter == 0) {
                                if (m.content == '1') {
                                    option = 1
                                    message.channel.send(`Mention the new club owner.`)
                                } else if (m.content = '2') {
                                    option = 2
                                    if (clubInformation.ClubPingBool == true) {
                                        message.channel.send(`Disable club pings? (y/n)`)
                                    } else if (clubInformation.ClubPingBool == false) {
                                        message.channel.send(`Enable club pings? (y/n)`)
                                    }
                                } else {
                                    message.channel.send(`Invalid input.`);
                                    collector.stop();
                                }
                            } else if (counter == 1) {
                                if (option == 1) {                                    
                                    editedData = await m.mentions.users.first() || await client.users.fetch(`${m.content}`);
                                    editedData = await message.guild.members.fetch(`${editedData.id}`)
                                    if (!editedData) {                                        
                                        message.channel.send(`Please specify a valid user.`)
                                        collector.stop();
                                    }
                                    let prevOwner = await message.guild.members.fetch(`${clubInformation.ClubOwnerID}`).catch(() => {})
                                    if (editedData.user.id === prevOwner.user.id) {
                                        message.channel.send(`Please specify a new user to become the club owner.`)
                                        collector.stop()
                                    }
                                    let clubOwnerRole = await message.guild.roles.fetch(`${guildClubList.ClubOwnerRole}`).catch(() => {})
                                    if (prevOwner && clubOwnerRole) {
                                        let clubOwnerArr = await ClubInfo.find({
                                            ClubOwnerID: `${prevOwner.user.id}`,
                                            GuildID: `${message.guild.id}`,
                                            ClientID: `${client.user.id}`
                                        })
                                        if (clubOwnerArr.length === 1) {
                                            await prevOwner.roles.remove(clubOwnerRole.id)
                                        }                                        
                                        await editedData.roles.add(clubOwnerRole.id)
                                    }
                                    if (clubInformation.ClubRoleID) {
                                        let clubRole = await message.guild.roles.fetch(`${clubInformation.ClubRoleID}`)
                                        if (clubRole) {
                                            await editedData.roles.add(clubRole)
                                        }
                                    }                                    
                                    let clubArr = clubInformation.MembersList
                                    if (clubArr.indexOf(`${editedData.user.id}`) == -1) {
                                        clubArr.push(`${editedData.user.id}`)                                                                                
                                    }                                    
                                    editedData = editedData.user.id
                                    await ClubInfo.findOneAndUpdate({
                                        ClubName: `${args.join(" ").toLowerCase()}`,
                                        GuildID: `${message.guild.id}`,
                                        ClientID: `${client.user.id}`
                                    }, {
                                        ClubOwnerID: `${editedData}`,
                                        MembersList: clubArr
                                    }).then(() => {
                                        edit = 1
                                        message.channel.send(`The new club owner has been set to <@!${editedData}>.`)
                                        collector.stop()
                                    })
                                } else if (option == 2) {
                                    if (m.content.toLowerCase().startsWith(`y`)) {
                                        let clubPing, messageDesc;
                                        if (clubInformation.ClubPingBool == true) {
                                            clubPing = false
                                            messageDesc = `The club will not allow club pings.`
                                        } else if (clubInformation.ClubPingBool == false) {
                                            clubPing = true
                                            messageDesc = `The club will allow club pings.`
                                        }
                                        await ClubInfo.findOneAndUpdate({
                                            ClubName: `${args.join(" ").toLowerCase()}`,
                                            GuildID: `${message.guild.id}`,
                                            ClientID: `${client.user.id}`
                                        }, {
                                            ClubPingBool: clubPing
                                        }).then(() => {
                                            edit = 1
                                            message.channel.send({content: messageDesc})
                                            collector.stop()
                                        })
                                    } else if (m.content.toLowerCase().startsWith(`n`)) {                                        
                                        message.channel.send(`No data has been changed.`)
                                        collector.stop();
                                    } else if (!m.content.toLowerCase().startsWith(`y`) && !m.content.toLowerCase().startsWith(`n`)) {
                                        message.channel.send(`Input provided was not valid.`)
                                        collector.stop();
                                    }
                                }
                            }
                            counter++
                            collector.resetTimer();
                        })
                        collector.on(`end`, async () => {
                            if (edit == 1) {
                                message.channel.send(`The data has been edited successfully.`)
                            } else {
                                message.channel.send(`No data was edited.`)
                            }
                        })
                    }
                }
            }
        } else if (!guildClubList) {
            return message.channel.send(`This server does not have clubs setup.`)
        }
    }
}