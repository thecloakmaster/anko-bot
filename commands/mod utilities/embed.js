const fetch = require(`node-fetch`)

module.exports = {
    name: `embed`,
    description: `Sends an embed with the arguments specified or with the .txt or .json file(s) in the message.`,
    usage: `;embed <Channel mention> <Embed data in a JSON format (a file can be sent instead - .txt or .json)>`,
    async execute(message, args) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return
        }
        if (!args) {
            return message.channel.send(`Please specify the necessary arguments. \nSyntax: \`;embed <Channel mention> <Embed data in a JSON format (a file can be sent instead - .txt or .json)>\``)
        }
        const targetChannel = message.mentions.channels.first()
        if (!targetChannel) {
            message.channel.send('Please specify a channel to send the embed in.\nSyntax: \`;embed <Channel mention> <Embed data in a JSON format (a file can be sent instead - .txt or .json)>\`')
            return
        }
        if (message.attachments.size > 0) {
            message.attachments.forEach(attachment => {
                let url = `${attachment.url}`;
                let storedText = null
                fetch(url)
                    .then(function (response) {
                        response.text().then(async function (text) {                            
                            try {
                                storedText = await JSON.parse(text);
                                await targetChannel.send(storedText).then(async (m) => {
                                    await message.channel.send(`The URL to the message: ${m.url}`)
                                }).catch(() => {
                                    return message.channel.send(`There was an error sending this message.`)
                                })
                            } catch (error) {
                                return message.channel.send(`Invalid JSON: ${error.message}\nSyntax: \`;embed <Channel mention> <Embed data in a JSON format (a file can be sent instead - .txt or .json)>\`\nFor designing your embed, you can use the website <https://discohook.org/> and copy the JSON data from their JSON data editor.`)
                            }
                        });
                    });
            })
        }

        if (args[1]) {
            args.shift()
            const json = JSON.parse(args.join(' '))
            try {
                return await targetChannel.send(json).then(async (m) => {
                    await message.channel.send(`The URL to the message: ${m.url}`)
                }).catch(() => {
                    return message.channel.send(`There was an error sending this message.`)
                })
            } catch (error) {
                return message.channel.send(`Invalid JSON ${error.message}\nSyntax: \`;embed <Channel mention> <Embed data in a JSON format (a file can be sent instead - .txt or .json)>\`\nFor designing your embed, you can use the website <https://discohook.org/> and copy the JSON data from their JSON data editor.`)
            }
        }
    }
}