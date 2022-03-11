const {
    MessageEmbed,
    Guild,
    Message
} = require('discord.js');

module.exports = {
    name: 'steal',
    description: 'Steals all the emotes from a single message and sends them to you via DMs. The command is to be executed in the exact same channel from which you want to steal messages.',
    usage: ';steal <message ID>',
    async execute(message, args) {
        const hasEmoteRegex = /<a:.+?:\d+>|<:.+?:\d+>/g
        const emoteRegex = /<:.+:(\d+)>/
        const animatedEmoteRegex = /<a:.+:(\d+)>/
        const messageID = args[0]
        let messageW = null
        message.delete()
        try {
            messageW = await message.channel.messages.fetch(`${messageID}`)
            const messageInput = messageW.content.match(hasEmoteRegex)
            if (!messageInput) return;
            let messageToAuthor = (`Here are the emote(s) stolen from the message you had mentioned.`)
            for (let i = 0; i < messageInput.length; i++) {
                let messageInp = messageInput[i]
                let emoji = null
                if (emoji = emoteRegex.exec(messageInp)) {
                    const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".png?v=1"
                    messageToAuthor = messageToAuthor + "\n" + `${i+1}. ${url}` 
                } else if (emoji = animatedEmoteRegex.exec(messageInp)) {
                    const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif?v=1"
                    messageToAuthor = messageToAuthor + "\n" + `${i+1}. ${url}`
                } else {
                    messageToAuthor = messageToAuthor + "\n" + `${i+1}. There was an error retrieving this emote.`
                };
            }
            return message.author.send(messageToAuthor);
        } catch (err) {
            return message.author.send(`Please enter a valid message ID of a message in the channel from which you want to steal the emotes and execute the command in the same channel.`)
        }

        
        
    }
}