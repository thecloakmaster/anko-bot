const ClubList = require(`../../database/ClubLists.js`)
const ClubInfo = require(`../../database/ClubInfo.js`)
const {
    MessageEmbed
} = require("discord.js")

module.exports = {
    name: `clubdelete`,
    description: `Deletes the specified club from the server.`,
    usage: `;clubdelete <Club Name>`,
    aliases: [`cdelete`, `cdel`],
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_CHANNELS") || !message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_CHANNELS\` & \`MANAGE_ROLES\`.`)
        } else if (!bot.permissions.has("MANAGE_CHANNELS") || !bot.permissions.has("MANAGE_ROLES")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_CHANNELS\` & \`MANAGE_ROLES\`.`)
        }
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
                        if (clubInformation.ClubOwnerID == 'none' && !message.member.permissions.has('ADMINISTRATOR')) {
                            return message.channel.send('You cannot delete a public club.\nPermissions required: \`ADMINISTRATOR\`')
                        }
                        const filter = m => m.author.id === message.author.id
                        const collector = message.channel.createMessageCollector({
                            filter,
                            max: 2,
                            time: 30000
                        });
                        let counter = 0,
                            deleteNum = 0;
                        message.channel.send(`Send \`${clubInformation.ClubName}\` in the chat to confirm deletion.`)
                        collector.on('collect', async (m) => {
                            if (counter === 0) {
                                if (m.content.toLowerCase() === `${clubInformation.ClubName.toLowerCase()}`) {
                                    let clubRole = await message.guild.roles.fetch(`${clubInformation.ClubRoleID}`).catch(() => {})
                                    let clubChannel = await message.guild.channels.fetch(`${clubInformation.ClubChannelID}`).catch(() => {})
                                    if (clubRole) await clubRole.delete().then(deleteNum++)
                                    if (clubChannel) await clubChannel.delete().then(deleteNum++)
                                    let prevOwner = await message.guild.members.fetch(`${clubInformation.ClubOwnerID}`).catch(() => {})
                                    let clubOwnerRole = await message.guild.roles.fetch(`${guildClubList.ClubOwnerRole}`).catch(() => {})
                                    if (prevOwner && clubOwnerRole) {
                                        let clubOwnerArr = await ClubInfo.find({
                                            ClubOwnerID: `${prevOwner.user.id}`,
                                            GuildID: `${message.guild.id}`,
                                            ClientID: `${client.user.id}`
                                        })
                                        if (clubOwnerArr.length === 1) {
                                            await prevOwner.roles.remove(clubOwnerRole.id).then(deleteNum++)
                                        }
                                    }
                                    await ClubInfo.findOneAndDelete({
                                        ClubName: `${args.join(" ").toLowerCase()}`,
                                        GuildID: `${message.guild.id}`,
                                        ClientID: `${client.user.id}`
                                    }).then(deleteNum++)
                                    clubsArr = await clubsArr.filter(function (element) {
                                        return element !== args.join(" ").toLowerCase()
                                    })
                                    await ClubList.findOneAndUpdate({
                                        GuildID: `${message.guild.id}`,
                                        ClientID: `${client.user.id}`
                                    }, {
                                        ClubList: clubsArr
                                    }).then(deleteNum++)
                                    collector.stop()

                                }
                            }
                            counter++
                            collector.resetTimer();
                        })
                        collector.on('end', async () => {
                            if (deleteNum >= 2) {
                                return message.channel.send(`The club has been delete successfully.`)
                            } else if (deleteNum < 2) {
                                return message.channel.send(`There was an error while deleting this club.`)
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