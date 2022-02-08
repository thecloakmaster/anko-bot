const {
    MessageEmbed,
    Guild,
    Message
} = require('discord.js');

module.exports = {
    name: 'talk',
    description: ':)',
    async execute(message, args) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;

        const channelID = message.mentions.channels.first();
        if (!channelID) return message.channel.send("Please specify a valid channel or ID.");

        let textMessage = args.slice(1).join(" ");

        if (!textMessage) return message.channel.send("Please specify the text to be sent")

        return channelID.send(textMessage);

    }
}