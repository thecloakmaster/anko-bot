const {MessageEmbed, MessageAttachment} = require('discord.js');

module.exports = {
    name: `removesticker`,
    description: `Removes a sticker from the server with the sticker provided.`,
    usage: `;removesticker <Sticker>`,
    aliases: [`deletesticker`, `delst`, `removest`],
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_EMOTES_AND_STICKERS\``)
        } else if (!bot.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_EMOTES_AND_STICKERS\``)
        }
        if (message.guild.premiumTier === `NONE`) {
            return message.channel.send(`This server has no boosts and hence no stickers can be added or removed.`)
        }
        if (message.stickers.size <= 0) {
            return message.channel.send(`Please send the sticker to be deleted along with the command`)
        } else if (message.stickers.size >= 1) {
            let stickers = Array.from(await message.stickers.values());
            for (let i = 0; i < stickers.length; i++) {
                let sticker = stickers[i]
                let stickerID = sticker.id
                sticker = await message.guild.stickers.fetch(`${stickerID}`)
                if (!sticker) {
                    return message.channel.send(`The sticker with the name ${sticker.name} does not belong to this guild and hence cannot be deleted.`)
                } else if (sticker) {
                    try {
                        if (sticker.format === 'APNG' || sticker.format === 'PNG') {
                            let fileURL = sticker.url
                            let file = new MessageAttachment(`${fileURL}`).setName('sticker.png')
                            sticker.delete().then(() => {
                                const embed = new MessageEmbed()
                                    .setColor(`${process.env.colour}`)
                                    .setDescription(`A sticker with the name \`${sticker.name}\` has been deleted from the server.`)
                                return message.channel.send({
                                    embeds: [embed.setImage('attachment://sticker.png')],
                                    files: [file]
                                })
                            }).catch((err) => {
                                console.log(err)
                                return message.channel.send(`Error deleting the sticker with the name ${sticker.name}. Syntax: \`;removesticker <Sticker>\``)
                            })
                        } else {                            
                            sticker.delete().then(() => {
                                const embed = new MessageEmbed()
                                    .setColor(`${process.env.colour}`)
                                    .setDescription(`A sticker with the name \`${sticker.name}\` has been deleted from the server.`)
                                return message.channel.send({
                                    embeds: [embed]
                                })
                            }).catch((err) => {
                                console.log(err)
                                return message.channel.send(`Error deleting the sticker with the name ${sticker.name}. Syntax: \`;removesticker <Sticker>\``)
                            })
                        }                  
                    } catch (err) {
                        console.log(err)
                        return message.channel.send(`Error deleting the sticker with the name ${sticker.name}. Syntax: \`;removesticker <Sticker>\``)
                    }
                }
            }
        }
    }
}