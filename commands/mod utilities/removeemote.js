const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'removeemote',
    description: `Removes the emote from the server with the name or emotes provided.`,
    usage:`;removeemote <Emote name>\` or \`;removeemote <Emotes provided>`,
    aliases: ['delemote', 'deleteemote', 'rememote'],
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.`)
        } else if (!bot.permissions.has("MANAGE_EMOTES_AND_STICKERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_EMOTES_AND_STICKERS\``)
        }
        const hasEmoteRegex = /<a:.+?:\d+>|<:.+?:\d+>/g
        const emoteRegex = /<:.+?:(\d+)>/
        const animatedEmoteRegex = /<a:.+?:(\d+)>/
        const emoteMatch = message.content.match(hasEmoteRegex)
        let emoteName = null
        if (!emoteMatch) {
            emoteName = args[0]
            try {
                let emoji = await message.guild.emojis.cache.find((emote) => emote.name === `${emoteName}`)
                if (!emoji) {
                    return message.channel.send(`Error deleting this emote.\nThis emote could not be found in this server.\nSyntax: \`;removeemote <Emote name>\` or \`;removeemote <Emotes provided>\``)
                }
                emoji.delete().then((em) => {
                    const embed = new MessageEmbed()
                        .setColor(`${process.env.colour}`)
                        .setDescription(`An emote with the name \`${emoteName}\` has been deleted from the server.`)
                    return message.channel.send({
                        embeds: [embed]
                    })
                }).catch((err) => {
                    console.log(err)
                })
            } catch (err) {
                return message.channel.send(`Error deleting this emote.`)
            }
        } else if (emoteMatch.length > 0) {
            for (let i = 0; i < emoteMatch.length; i++) {
                let emoteMatchLoop = emoteMatch[i]
                if (emojiLoop = emoteRegex.exec(emoteMatchLoop)) {
                    emoteName = emojiLoop[1]
                } else if (emoji = animatedEmoteRegex.exec(emoteMatchLoop)) {
                    emoteName = emojiLoop[1]
                }
                try {
                    let emoji = await message.guild.emojis.cache.find((emote) => emote.id === `${emoteName}`)
                    if (!emoji) {
                        return message.channel.send(`Error deleting this emote.\nThis emote could not be found in this server.\nSyntax: \`;removeemote <Emote name>\` or \`;removeemote <Emotes provided>\``)
                    }
                    emoji.delete().then((em) => {
                        const embed = new MessageEmbed()
                            .setColor(`${process.env.colour}`)
                            .setDescription(`An emote with the name \`${emoji.name}\` has been deleted from the server.`)
                        return message.channel.send({
                            embeds: [embed]
                        })
                    }).catch(() => {})
                } catch (err) {
                    return message.channel.send(`Error deleting this emote.\nSyntax: \`;removeemote <Emote name>\` or \`;removeemote <Emotes provided>\``)
                }
            }   
        }
    }
}