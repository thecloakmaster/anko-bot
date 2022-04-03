const {MessageEmbed} = require('discord.js')

module.exports = {
    name: `spoiler`,
    description: `Sends the specified image/video with a spoiler tag. (You should probably also learn to use the feature in-built in Discord to spoiler tag files.)`,
    usage: `;spoiler <attach an image/video>`,
    async execute(message) {
        if (message.attachments.size === 0) {
            return message.channel.send(`No attached image provided.`)
        } else if (message.attachments.size === 1) {
            message.attachments.forEach(attachment => {
                const col = message.member.displayHexColor || "#000000"
                let desc = `Spoiler image sent by ${message.author.tag}`
                message.delete()
                if (!attachment.contentType.startsWith(`image`) && !attachment.contentType.startsWith(`video`)) {
                    return message.channel.send('Please send an image or video to be spoilered.')
                } else if (attachment.contentType.startsWith(`video`)) {
                    desc = `Spoiler video sent by ${message.author.tag}`
                }
                const file = attachment
                    .setSpoiler(true)
                const embed = new MessageEmbed()
                    .setAuthor({
                        name: `${message.author.tag}`,
                        iconURL: `${message.author.displayAvatarURL({dynamic:true, size:256})}`
                    })
                    .setTitle(`${desc}`)
                    .setColor(`${col}`)
                message.channel.sendTyping();
                return message.channel.send({
                    embeds: [embed],
                    files: [file]
                })
            })
        } else if (message.attachments.size > 1) {
            await message.delete()
            let i = 1
            message.attachments.forEach(attachment => {
                const col = message.member.displayHexColor || "#000000"
                if (!attachment.contentType.startsWith(`image`) && !attachment.contentType.startsWith(`video`)) {
                    return message.channel.send('Please send an image or video to be spoilered.')
                }
                const file = attachment
                    .setSpoiler(true)
                if (i === message.attachments.size) {
                    const embed = new MessageEmbed()
                        .setAuthor({
                            name: `${message.author.tag}`,
                            iconURL: `${message.author.displayAvatarURL({dynamic:true, size:256})}`
                        })
                        .setTitle(`Spoiler images/videos sent by ${message.author.tag}`)
                        .setColor(`${col}`)
                    return message.channel.send({embeds: [embed], files: [file]})
                } else {
                    message.channel.send({files: [file]})
                }
                i += 1
            })
        }

    }
}