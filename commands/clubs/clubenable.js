const {
    MessageEmbed
} = require('discord.js');
const ClubList = require(`../../database/ClubLists.js`)

module.exports ={
    name: `clubenable`,
    description: `Enables the club system in the server.`,
    usage: `;clubenable`,
    aliases: [`cenable`],
    async execute(message, args, client) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`ADMINISTRATOR\`.`)
        }
        let guildClubList = await ClubList.findOne({
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        let clubCategoryID = null,
            clubOwnerRoleID = null
        if (!guildClubList) {
            message.channel.send('Would you like to add a channel category for club channels? Enter the category channel\'s ID if yes.')
            let filter = m => m.author.id === message.author.id
            let collector = message.channel.createMessageCollector({
                filter,
                max: 2,
                time: 60000
            });
            let counter = 0
            collector.on('collect', async (m) => {
                if (counter == 0) {
                    let categoryChannel = await message.guild.channels.fetch(`${m.content}`).catch(() => {});
                    if (categoryChannel){
                        if (categoryChannel.type == 'GUILD_CATEGORY'){
                            clubCategoryID = categoryChannel.id
                            message.channel.send(`The club category has been set as <#${clubCategoryID}>.`)
                        } else if (categoryChannel.type != 'GUILD_CATEGORY'){
                            message.channel.send(`The ID you entered was not for a category channel. The field will be left blank.`)
                        }
                    } else if (!categoryChannel) {
                        message.channel.send(`No club category channel has been set.`)
                    }
                    message.channel.send(`Would you like to add a role for the club owners? Mention the role if yes.`)
                } else if (counter == 1) {
                    let clubOwnerRole = await m.mentions.roles.first()
                    if (clubOwnerRole) {                        
                        clubOwnerRoleID = clubOwnerRole.id
                        message.channel.send(`The club owner role has been set to <@&${clubOwnerRoleID}>.`)
                    } else if (!clubOwnerRole) {
                        message.channel.send(`No club owner role has been set.`)
                    }
                }
                counter++
            })
            collector.on(`end`, async () => {
                let newData = new ClubList({
                    ClubList: [],
                    ClubOwnerRole: `${clubOwnerRoleID}`,
                    ClubCategoryID: `${clubCategoryID}`,
                    ClubEnabled: true,
                    GuildID: `${message.guild.id}`,
                    ClientID: `${client.user.id}`
                })
                await newData.save()
                message.channel.send(`The clubs have been enabled!`)
            })
        } else if (guildClubList) {
            if (!guildClubList.ClubEnabled) {
                let clubArr = guildClubList.ClubList
                await ClubList.findOneAndDelete({
                    GuildID: `${message.guild.id}`,
                    ClientID: `${client.user.id}`
                })
                message.channel.send('Would you like to add a channel category for club channels? Enter the category channel\'s ID if yes.')
                let filter = m => m.author.id === message.author.id
                let collector = message.channel.createMessageCollector({
                    filter,
                    max: 3,
                    time: 60000
                });
                let counter = 0;                
                collector.on('collect', async (m) => {
                    if (counter == 0) {
                        let categoryChannel = await message.guild.channels.fetch(`${m.content}`).catch(() => {});
                        if (categoryChannel) {
                            if (categoryChannel.type == 'GUILD_CATEGORY') {
                                clubCategoryID = categoryChannel.id
                                message.channel.send(`The club category has been set as <#${clubCategoryID}>.`)
                            } else if (categoryChannel.type != 'GUILD_CATEGORY') {
                                message.channel.send(`The ID you entered was not for a category channel. The field will be left blank.`)
                            }
                        } else if (!categoryChannel) {
                            message.channel.send(`No club category channel has been set.`)
                        }
                        message.channel.send(`Would you like to add a role for the club owners? Mention the role if yes.`)
                    } else if (counter == 1) {
                        let clubOwnerRole = await m.mentions.roles.first()
                        if (clubOwnerRole) {
                            clubOwnerRoleID = clubOwnerRole.id
                            message.channel.send(`The club owner role has been set to <@&${clubOwnerRoleID}>.`)
                            collector.stop();
                        } else if (!clubOwnerRole) {
                            message.channel.send(`No club owner role has been set. This field will be left blank.`)
                            collector.stop();
                        }
                    }
                    counter ++
                    collector.resetTimer();
                })
                collector.on(`end`, async () => {
                    let newData = new ClubList({
                        ClubList: clubArr,
                        ClubOwnerRole: `${clubOwnerRoleID}`,
                        ClubCategoryID: `${clubCategoryID}`,
                        ClubEnabled: true,
                        GuildID: `${message.guild.id}`,
                        ClientID: `${client.user.id}`
                    })
                    await newData.save()
                    message.channel.send(`The clubs have been enabled!`)
                })
            } else if (guildClubList.ClubEnabled) {
                return message.channel.send(`This server already has clubs enabled. To edit the settings, please disable and enable clubs again.`)
            }
        }
    }
}