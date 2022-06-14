const fetch = require(`node-fetch`)

module.exports = {
    name: `editembed`,
    aliases: [`eembed`, `edit`],
    description: `Edits the contents of a message with the .txt or .json file in the message.`,
    usage: `;editembed <Channel> <Message ID> <A JSON or a .txt file as an attachment>\``,
    async execute(message, args, client) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return
        }
        let targetChannel = message.mentions.channels.first()
        let messageID = args[1]
        if (!targetChannel) {
            return message.channel.send(`Please enter a valid channel.\nSyntax: \`;editembed <Channel> <Message ID> <A JSON or a .txt file as an attachment>\``)
        } else if (!messageID) {
            return message.channel.send(`Please enter a valid message ID.\nSyntax: \`;editembed <Channel> <Message ID> <A JSON or a .txt file as an attachment>\``)
        }
        let targetMessage = await targetChannel.messages.fetch(`${messageID}`).catch((err) => {
            console.log(err)
            return message.channel.send(`Please enter a valid message ID.\nSyntax: \`;editembed <Channel> <Message ID> <A JSON or a .txt file as an attachment>\``)
        })
        if (targetMessage.author.id != client.user.id) {
            return message.channel.send(`I am not the author of this message therefore I cannot edit it.`)
        }
        if (message.attachments.size > 0) {
            message.attachments.forEach(attachment => {
                let url = `${attachment.url}`;
                let storedText = null
                fetch(url)
                    .then(function (response) {
                        response.text().then(async function (text) {
                            storedText = await JSON.parse(text);
                            try {
                                await targetMessage.edit(storedText).then(async (message) => {
                                    await message.channel.send(`The URL to the edited message: [Click here to warp space time and jump to the message!](${message.url})`)
                                }).catch(() => {
                                    return message.channel.send(`There was an error editing this embed.`)
                                })
                            } catch (error) {
                                return message.channel.send(`Invalid JSON: ${error.message}\nSyntax: \`;editembed <Channel mention> <Message ID> <Embed data in a JSON format (a file can be sent instead - .txt or .json)>\`\nFor designing your embed, you can use the website <https://discohook.org/> and copy the JSON data from their JSON data editor.`)
                            }
                        });
                    });
                return;
            })
        } else if (message.attachments.size == 0) {
            return message.channel.send(`Please attach a valid JSON or a .txt file.`)
        }
    }
}