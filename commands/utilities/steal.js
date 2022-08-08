module.exports = {
    name: 'steal',
    description: 'Steals all the emotes/stickers from a single message and sends them to you via DMs. The command is to be executed in the exact same channel from which you want to steal messages.',
    usage: ';steal <message ID>',
    async execute(message, args) {
        message.delete();
        if (!args[0]) {
            return message.author.send('No message ID was specified.\nSyntax: \`;steal <message ID>\`.')
        }
        let endMessage = '';
        let stickerM = await message.channel.messages.fetch(`${args[0]}`).catch(() => {})
        if (!stickerM) {
            return message.author.send(`No message with the specified message ID was found. Make sure you are executing the command in the same channel as the message.`).catch(() => {})
        }            
        if (stickerM.stickers.size >= 1) {
            let stickers = Array.from(await stickerM.stickers.values());
            for (let i = 0; i < stickers.length; i++) {
                let sticker = stickers[i]                    
                if (sticker.format === 'LOTTIE') {
                    endMessage = `Here is the URL for the sticker in the message mentioned: ${sticker.url}\nThis sticker's source is in the form of a Lottie JSON file. To convert it to a .gif file, use this website <https://lottiefiles.com/lottie-to-gif>`
                } else if (sticker.format === 'APNG') {
                    endMessage = `Here is the URL for the image of the sticker in the message mentioned: ${sticker.url}\nThis sticker is in the form of an APNG file. To convert it to a .gif file, use this website <https://ezgif.com/apng-to-gif>`
                } else if (sticker.format === 'PNG') {
                    endMessage = `Here is the URL for the image of the sticker in the message mentioned: ${sticker.url}`
                }
            }
        }
    
        const hasEmoteRegex = /<a:.+?:\d+>|<:.+?:\d+>/g
        const emoteRegex = /<:.+:(\d+)>/
        const animatedEmoteRegex = /<a:.+:(\d+)>/        
        let messageW = null
        let messageToAuthor = ''
        try {
            messageW = await message.channel.messages.fetch(`${args[0]}`)
            const messageInput = messageW.content.match(hasEmoteRegex)
            if (messageInput) {
                for (let i = 0; i < messageInput.length; i++) {
                    let messageInp = messageInput[i]
                    let emoji = null
                    if (emoji = emoteRegex.exec(messageInp)) {
                        const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".png"
                        messageToAuthor = messageToAuthor + "\n" + `${i+1}. ${url}`
                    } else if (emoji = animatedEmoteRegex.exec(messageInp)) {
                        const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif"
                        messageToAuthor = messageToAuthor + "\n" + `${i+1}. ${url}`
                    } else {
                        messageToAuthor = messageToAuthor + "\n" + `${i+1}. There was an error retrieving this emote.`
                    };
                }
                if (messageToAuthor.length > 0) {
                    messageToAuthor = `These are the emotes stolen from the message you had mentioned.\n${messageToAuthor}`
                }
            }
        } catch (err) {
            if (endMessage.length === 0 && messageToAuthor.length === 0) {
                return message.author.send(`Please enter a valid message ID of a message in the channel from which you want to steal the emotes and execute the command in the same channel.`).catch(() => {});
            }
        }
        if (endMessage.length === 0 && messageToAuthor.length === 0) {
            return message.author.send('There were no stickers/emotes in the message mentioned.').catch(() => {})
        }
        return message.author.send(`${endMessage}\n${messageToAuthor}`).catch(() => {});
    }
}