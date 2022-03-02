const {
    MessageEmbed,
    Guild,
    Message
} = require('discord.js');

module.exports = {
    name: `modreply`,
    aliases: [`modmail`, `replymodmail`, 'replymod', 'reply'],
    description: `Replies to the users who have DM'd the bot for modmail.`,
    usage: `;modreply <Mention the user or enter their user ID>`,
    async execute(message, args) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        const userID = message.mentions.members.first || await message.guild.members.fetch(args[0]).catch(() => {});
        let textMessage = args.slice(1).join(" ");

        if (!textMessage) return message.channel.send("Please specify the text to be sent");
        return userID.send(textMessage)
    }
}