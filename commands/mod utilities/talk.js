module.exports = {
    name: 'talk',
    description: 'Sends a message to a channel via the bot. Not to be overused as it might be against Discord TOS.',
    usage:`;talk <#channel mention> <message>`,
    async execute(message, args) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;

        const channelID = message.mentions.channels.first();
        if (!channelID) return message.channel.send("Please specify a valid channel.");

        let textMessage = args.slice(1).join(" ");

        let messageFiles = []
        if (message.attachments.size > 0) {
            message.attachments.forEach (async (fileBuffer) => {
                messageFiles.push(fileBuffer.url);
            });
        };

        if (!textMessage && messageFiles == []) return message.channel.send({content: "Please specify the text to be sent"})

        if (textMessage != '') {return channelID.send({content: textMessage, files: messageFiles});
                               } else {
            return channelID.send({files: messageFiles});
        }
    }
}