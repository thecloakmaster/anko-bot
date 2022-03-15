const {MessageEmbed} = require('discord.js');

module.exports = {
    name: `removesticker`,
    description: `Removes a sticker from the guild with the sticker provided.`,
    usage: `'removesticker <Sticker>`,
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
        console.log(message)
    }
}