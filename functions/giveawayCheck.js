const giveawayInfo = require(`../database/GiveawayInfo`)
const {
    MessageEmbed
} = require(`discord.js`)

module.exports = {
    async execute(client) {
        setInterval(async function () {
            let giveaways = await giveawayInfo.find({
                ClientID: client.user.id,
                Ended: false
            })
            for (let giveaway of giveaways) {
                let guildID = giveaway.GuildID;
                let guild = await client.guilds.fetch(`${guildID}`).catch(() => {});
                let guildGiveaways = await giveawayInfo.find({
                    GuildID: `${guildID}`,
                    ClientID: `${client.user.id}`
                })
                if (!guild) {
                    await giveawayInfo.deleteMany({
                        GuildID: `${guildID}`,
                        ClientID: `${client.user.id}`
                    })
                } else if (guild) {
                    let channel = await guild.channels.fetch(`${giveaway.ChannelID}`).catch(() => {});
                    if (!channel) {
                        await giveawayInfo.deleteMany({
                            ChannelID: `${giveaway.ChannelID}`,
                            GuildID: `${guildID}`,
                            ClientID: `${client.user.id}`
                        })
                    } else if (channel) {
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
                                let giveawayReactions = null
                                message = await channel.messages.fetch(`${giveaway.EmbedID}`).then(async (msg) => {
                                    giveawayReactions = await msg.reactions.resolve(`🎉`).users.fetch().then(userList => {
                                        return userList.map((user) => user.id)
                                    }).catch(() => {});
                                    let winnerList = []

                                    function getRandomInt(min, max) {
                                        min = Math.ceil(min);
                                        max = Math.floor(max);
                                        return Math.floor(Math.random() * (max - min) + min)
                                    }
                                    if (giveawayReactions.length - 1 < giveaway.Winners) {
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
                                    } else if (giveawayReactions.length - 1 >= giveaway.Winners) {
                                        let congratsMessage = `The giveaway for **${giveaway.Prize}** has ended.\nCongrats to the winner(s):`
                                        for (let winnerCounter = 0; winnerCounter < giveaway.Winners; winnerCounter++) {
                                            let randInt = getRandomInt(0, giveawayReactions.length)
                                            if (winnerList.indexOf(`${giveawayReactions[randInt]}`) != -1 || giveawayReactions[randInt] === client.user.id) {
                                                winnerCounter -= 1
                                                continue
                                            } else {
                                                congratsMessage = `${congratsMessage}\n**${winnerCounter + 1}.** <@!${giveawayReactions[randInt]}>`
                                                winnerList.push(`${giveawayReactions[randInt]}`)
                                            }
                                        }
                                        await giveawayInfo.findOneAndUpdate({
                                            ChannelID: `${giveaway.ChannelID}`,
                                            EmbedID: `${giveaway.EmbedID}`,
                                            GuildID: `${guildID}`,
                                            ClientID: `${client.user.id}`
                                        }, {
                                            WinnersList: winnerList,
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
                                                text: `Giveaway ID: ${giveaway.GiveawayID}`
                                            })
                                        msg.edit({
                                            content: `🎉 **THIS GIVEAWAY HAS ENDED** 🎉`,
                                            embeds: [giveawayEmbed]
                                        }).catch(() => {})
                                        channel.send(`${congratsMessage}\nhttps://discord.com/channels/${guild.id}/${channel.id}/${giveaway.EmbedID}`)
                                    }
                                }).catch(() => {});
                            }
                        }
                    }
                }
            }
        }, 300000)
    }
}