const {MessageEmbed} = require('discord.js');

module.exports = {
    name: `renameemote`,
    description: `Renames the emote specified.`,
    aliases: [`renemote`, `rename`],
    usage: `;renameemote <Emote provided> <New emote name>`,
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.`)
        } else if (!bot.permissions.has("MANAGE_EMOTES_AND_STICKERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_EMOTES_AND_STICKERS\``)
        }
        if (!args[0]) {
            return message.channel.send(`Please specify an emote.\nSyntax: \`;renameemote <Emote provided> <New emote name>\``)
        } else if (!args[1]) {
            return message.channel.send(`Please specify a new name for the emote.\nSyntax: \`;renameemote <Emote provided> <New emote name>\``)
        }
        const hasEmoteRegex = /<a:.+?:\d+>|<:.+?:\d+>/g
        const emoteRegex = /<:.+?:(\d+)>/
        const animatedEmoteRegex = /<a:.+?:(\d+)>/
        const emoteMatch = message.content.match(hasEmoteRegex)
        let emoteName = null
        if (!emoteMatch) {
            return message.channel.send(`No emote was provided.\nSyntax: \`;renameemote <Emote provided> <New emote name>\``)
        } else if (emoteMatch.length > 0) {
            for (let i = 0; i < 1; i++) {
                let emoteMatchLoop = emoteMatch[i]
                if (emojiLoop = emoteRegex.exec(emoteMatchLoop)) {
                    emoteName = emojiLoop[1]
                } else if (emoji = animatedEmoteRegex.exec(emoteMatchLoop)) {
                    emoteName = emojiLoop[1]
                }
                try {
                    let emoji = await message.guild.emojis.cache.find((emote) => emote.id === `${emoteName}`)
                    if (!emoji) {
                        return message.channel.send(`Error renaming this emote.\nThis emote could not be found in this server.\nSyntax: \`;renameemote <Emote provided> <New emote name>\``)
                    }
                    emoji.edit({name: `${args[1]}`}).then((em) => {
                        const embed = new MessageEmbed()
                            .setColor(`${process.env.colour}`)
                            .setDescription(`An emote with the name \`${emoji.name}\` has been renamed to \`${em.name}\``)
                        return message.channel.send({
                            embeds: [embed]
                        })
                    }).catch((e) => {
                        if (e.code === 50035) {
                            return message.channel.send(`Please specify an emote name which meets Discord's naming system for emotes.\nSyntax: \`;renameemote <Emote provided> <New emote name>\``)
                        }
                    })
                } catch (err) {
                    return message.channel.send(`Error renaming this emote.\nSyntax: \`;renameemote <Emote provided> <New emote name>\``)
                }
            }
        }
    }
}