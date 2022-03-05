const {
    MessageEmbed,
    Guild,
    Message
} = require('discord.js');

module.exports = {
    name: `modreply`,
    aliases: [`modmail`, `replymodmail`, 'replymod', 'reply'],
    description: `Replies to the users who have DM'd the bot for modmail.`,
    usage: `;modreply <Mention the user or enter their user ID> <Message content>`,
    async execute(message, args) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        const userID = await message.guild.members.fetch(args[0]).catch(() => {});
        if (!userID) return message.channel.send(`Please specify a valid user ID to send the reply to.`)
        let textMessage = args.slice(1).join(" ");

        if (!textMessage) return message.channel.send("Please specify the text to be sent");
        try {
            return userID.send(textMessage).catch((err) => {
                console.log(err)
                return message.channel.send(`Error replying to the user specified. This user probably has DMs disabled.`)
            })
        } catch (err) {
            console.log(err)
            return message.channel.send(`Error replying to the user specified. This user probably has DMs disabled.`)
        }
    }
}