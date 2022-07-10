module.exports = {
    name: 'steal',
    description: 'Steals all the emotes from a single message and sends them to you via DMs. The command is to be executed in the exact same channel from which you want to steal messages.',
    usage: ';steal <st (For stickers, optional)> <message ID>',
    async execute(message, args) {
        if (args[0] === 'st') {
            let stickerM = await message.channel.messages.fetch(`${args[1]}`).catch(() => {})
            if (!stickerM) {
                return message.author.send(`No message with the specified message ID was found. Make sure you are executing the command in the same channel as the message.`)
            }
            message.delete()
            if (stickerM.stickers.size <= 0) {
                return message.author.send(`There were no stickers in the message specified.`)
            } else if (stickerM.stickers.size >= 1) {
                let stickers = Array.from(await stickerM.stickers.values());
                for (let i = 0; i < stickers.length; i++) {
                    let sticker = stickers[i]                    
                    if (sticker.format === 'LOTTIE') {
                        return message.author.send(`Here is the URL for the sticker in the message mentioned: ${sticker.url}\nThis sticker's source is in the form of a Lottie JSON file. To convert it to a .gif file, use this website <https://lottiefiles.com/lottie-to-gif>`)
                    } else if (sticker.format === 'APNG') {
                        return message.author.send(`Here is the URL for the image of the sticker in the message mentioned: ${sticker.url}\nThis sticker is in the form of an APNG file. To convert it to a .gif file, use this website <https://ezgif.com/apng-to-gif>`)
                    } else if (sticker.format === 'PNG') {
                        return message.author.send(`Here is the URL for the image of the sticker in the message mentioned: ${sticker.url}`)
                    }
                }
            }
        } else {
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
                let messageToAuthor = (`These are the emotes stolen from the message you had mentioned.`)
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
                return message.author.send(messageToAuthor).catch(() => {});
            } catch (err) {
                return message.author.send(`Please enter a valid message ID of a message in the channel from which you want to steal the emotes and execute the command in the same channel.`)
            }
        }        
    }
}