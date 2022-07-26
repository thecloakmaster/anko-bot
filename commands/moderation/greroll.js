const { MessageEmbed } = require(`discord.js`)
const giveawayInfo = require(`../../database/GiveawayInfo`)

module.exports = {
    name: `greroll`,
    description: `Reroll a giveaway winner.`,
    usage: `;greroll <Giveaway ID (for example, GW908023949722538044)>`,
    async execute(message, args, client) {
        if (!message.member.permissions.has(`MANAGE_ROLES`)) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_ROLES\`.`)
        }
        if (!args[0]) {
            return message.channel.send(`Please specify a valid giveaway ID.\nSyntax: \`;greroll <Giveaway ID (for example, GW908023949722538044)>\``)
        }
        let giveaway = await giveawayInfo.findOne({
            ClientID: client.user.id, GiveawayID:`${args[0]}`, Ended: true
        })
        if (!giveaway) {
            return message.channel.send(`No giveaway with that specific ID was found. Make sure the giveaway ID specified is of an ended giveaway and is of the correct format.\nSyntax: \`;greroll <Giveaway ID (for example, GW908023949722538044)>\``)
        } else if (giveaway) {
            let guildID = giveaway.GuildID;
            let guild = await client.guilds.fetch(`${guildID}`).catch(() => {});
            let giveawayReactions = null
            let channel = await guild.channels.fetch(`${giveaway.ChannelID}`).catch(() => {});
            if (!channel || !guild) {
                await giveawayInfo.findOneAndDelete({
                    ClientID: client.user.id,
                    GiveawayID: `${args[0]}`,
                    Ended: true
                })
                return message.channel.send(`This giveaway's message, channel or guild were deleted and hence cannot be rerolled. Make sure the giveaway ID specified is of an ended giveaway and is of the correct format.\nSyntax: \`;greroll <Giveaway ID (for example, GW908023949722538044)>\``)
            }
            let message = await channel.messages.fetch(`${giveaway.EmbedID}`).catch(() => {});
            if (!message) {
                await giveawayInfo.deleteMany({
                    ChannelID: `${giveaway.ChannelID}`,
                    EmbedID: `${giveaway.EmbedID}`,
                    GuildID: `${guildID}`,
                    ClientID: `${client.user.id}`
                })
            } else if (message) {
                if (Date.now() >= giveaway.LastsTill) {
                    messageEmbed = await channel.messages.fetch(`${giveaway.EmbedID}`).then(async (msg) => {
                        giveawayReactions = await msg.reactions.resolve(`🎉`).users.fetch().then(userList => {
                            return userList.map((user) => user.id)
                        }).catch(() => {});                        
                        let winnersList = giveaway.WinnersList
                        function getRandomInt(min, max) {
                            min = Math.ceil(min);
                            max = Math.floor(max);
                            return Math.floor(Math.random() * (max - min) + min)
                        }                        
                        if (giveawayReactions.length - 1 < 1) {
                            let giveawayEmbed = new MessageEmbed()
                                .setAuthor({
                                    name: client.user.username,
                                    iconURL: client.user.displayAvatarURL()
                                })
                                .setColor(`${process.env.colour}`)
                                .setTitle(`${giveaway.Prize}`)
                                .setDescription(`The giveaway has ended with **${giveawayReactions.length - 1} participants.**\nAmount of winners: ${giveaway.Winners}`)
                                .setFooter({
                                    text: `Giveaway ID: GW${giveaway.GiveawayID}`
                                })
                            msg.edit({
                                content: `🎉 **THIS GIVEAWAY HAS ENDED! There were not enough participants.** 🎉`,
                                embeds: [giveawayEmbed]
                            }).catch(() => {})
                            channel.send(`There were not enough participants in the giveaway with the giveaway ID: ${giveaway.GiveawayID}.`)
                            await giveawayInfo.deleteMany({
                                ChannelID: `${giveaway.ChannelID}`,
                                EmbedID: `${giveaway.EmbedID}`,
                                GuildID: `${guildID}`,
                                ClientID: `${client.user.id}`
                            })
                            return
                        } else if (giveawayReactions.length - 1 >= 1) {                            
                            let congratsMessage = `The giveaway for **${giveaway.Prize}** has been rerolled.\nCongrats to the new winner:`
                            let winnerListLoop = []
                            for (let winnerCounter = 0; winnerCounter < 1; winnerCounter++) {
                                let randInt = getRandomInt(0, giveawayReactions.length)
                                if (winnerListLoop.indexOf(`${giveawayReactions[randInt]}`) != -1 || giveawayReactions[randInt] === client.user.id || winnersList.indexOf(`${giveawayReactions[randInt]}`) != -1) {                                    
                                    winnerCounter-=1
                                    continue
                                } else {                                    
                                    congratsMessage = `${congratsMessage}\n**${winnerCounter + 1}.** <@!${giveawayReactions[randInt]}>`
                                    winnerListLoop.push(`${giveawayReactions[randInt]}`)
                                }
                            }
                            let counter = 0
                            for (let i of winnerListLoop) {
                                if (winnersList.indexOf(i) != -1) {
                                    winnerListLoop.splice(counter, 1)
                                } else {
                                    winnersList.push(i)
                                }
                                counter++
                            }
                            if (winnerListLoop.length === 0) {return message.channel.send(`There are no new winners for this reroll probably due to a lack of participants.`)}
                            await giveawayInfo.findOneAndUpdate({
                                ChannelID: `${giveaway.ChannelID}`,
                                EmbedID: `${giveaway.EmbedID}`,
                                GuildID: `${guildID}`,
                                ClientID: `${client.user.id}`},
                            {                           
                                WinnersList: winnersList,
                                Ended: true
                            })
                            let giveawayEmbed = new MessageEmbed()
                                .setAuthor({
                                    name: client.user.username,
                                    iconURL: client.user.displayAvatarURL()
                                })
                                .setColor(`${process.env.colour}`)
                                .setTitle(`${giveaway.Prize}`)
                                .setDescription(`The giveaway has ended with **${giveawayReactions.length - 1} participants.**\nAmount of winners: ${giveaway.Winners}`)
                                .setFooter({
                                    text: `Giveaway ID: GW${giveaway.GiveawayID}`
                                })
                            msg.edit({
                                content: `🎉 **THIS GIVEAWAY HAS ENDED** 🎉`,
                                embeds: [giveawayEmbed]
                            }).catch(() => {})
                            channel.send(`${congratsMessage}\nhttps://discord.com/channels/${message.guild.id}/${channel.id}/${giveaway.EmbedID}`)
                        }
                    }).catch((err) => {                        
                        return message.channel.send(`There was an error fetching this giveaway's message. `)
                    });
                } else if (Date.now() < giveaway.LastsTill) {
                    return message.channel.send('This giveaway has not ended yet.')
                }
            }
        }
    }
}
