const {MessageEmbed} = require('discord.js');

module.exports = {
    name: `removesticker`,
    description: `Removes a sticker from the guild with the sticker provided.`,
    usage: `;removesticker <Sticker>`,
    aliases: [`deletesticker`, `delst`, `removest`],
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_EMOTES_AND_STICKERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_EMOTES_AND_STICKERS\``)
        } else if (!bot.permissions.has("MANAGE_EMOTES_AND_STICKERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_EMOTES_AND_STICKERS\``)
        }
        if (message.guild.premiumTier === `NONE`) {
            return message.channel.send(`This server has no boosts and hence no stickers can be added or removed.`)
        }
        if (message.stickers.size <= 0) {
            return message.channel.send(`Please send the sticker to be deleted along with the command`)
        } else if (message.stickers.size > 0) {
            let i = 0
            await message.stickers.forEach(sticker => async function () {
                try {
                    let stickerResolvable = await message.guild.stickers.fetch(`${sticker.id}`)
                    stickerResolvable.delete().then(() => {
                        i += 1
                        const embed = new MessageEmbed()
                            .setColor(`#e4a353`)
                            .setDescription(`A sticker with the name \`${sticker.name}\` has been deleted from the server.`)
                        return message.channel.send({
                            embeds: [embed]
                        })
                    }).catch(() => {message.channel.send(`Error deleting the sticker with the name ${sticker.name}. Syntax: \`;removesticker <Sticker>\``)})
                }catch (err) {
                    return message.channel.send(`Error deleting the sticker with the name ${sticker.name}. Syntax: \`;removesticker <Sticker>\``)
                }
            })
        }
        

    }
}