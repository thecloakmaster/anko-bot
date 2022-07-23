const CustomCommands = require('../../database/CustomCommands.js');
const _ = require('lodash');
const { MessageAttachment } = require('discord.js');

module.exports = {
    name: 'customadd',
    aliases: ['customcreate', 'createcustom', 'addcustom'],
    description: `Add a custom command to the server.`,
    usage: `;customadd <Command name> <Channel> <Message ID> <Command description>`,
    async execute(message, args, client) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send('You do not have the permission to execute this command.\nPermissions required: \`ADMINISTRATOR\`');
        }
        if (!args[0] || !args[1] || !args[2]) {
            return message.channel.send('Please provide valid arguments.\nSyntax: \`;customadd <Command name> <Channel> <Message ID> <Command description>\`')
        }
        let commandName = args[0].toLowerCase();
        let commandCheck = await CustomCommands.findOne({
            CustomCommand: commandName,
            ClientID: `${client.user.id}`,
            GuildID: `${message.guild.id}`
        })
        if (commandCheck) {
            return message.channel.send('A custom command of this name already exists. Please specify another command name.\nSyntax: \`;customadd <Command name> <Channel> <Message ID> <Command description>\`')
        }
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (command) {
            return message.channel.send('A command of this name already exists. Please specify another command name.\nSyntax: \`;customadd <Command name> <Channel> <Message ID> <Command description>\`')
        }
        let description = args.slice(3).join(" ")
        if (description.length === 0) {
            description = 'Not defined.'
        }
        let messageID = args[2];
        let channel = message.mentions.channels.first();
        let messageTarget = await channel.messages.fetch(`${messageID}`)
        if (!messageTarget) {
            return message.channel.send('No message was found from the specified arguments.\nSyntax: \`;customadd <Command name> <Channel> <Message ID> <Command description>\`')
        }
        let mContent = messageTarget.content
        let mEmbeds = messageTarget.embeds
        async function fileUpload(messageTarget) {
            return new Promise(async (resolve) => {
                let mFiles = []
                if (messageTarget.attachments.size > 0) {
                    let fileC = 0
                    await message.author.send('These are the images which are going to be used in the custom command. I will be sending them here so that the images do not get deleted.').catch((e) => {
                        return message.channel.send('You need to enable DM\'s from me if you want to use attachments for the custom command.')
                    })
                    messageTarget.attachments.forEach(async (attachment) => {
                        let file = new MessageAttachment(`${attachment.url}`)
                        let m = await message.author.send({
                            files: [file]
                        })
                        let tempArr = Array.from(m.attachments.values())
                        mFiles.push(`${tempArr[0].url}`)
                        fileC++
                        if (fileC === messageTarget.attachments.size) {
                            resolve(mFiles)
                        }
                    })
                }
            })
        }
        if (mContent.length === 0 && mEmbeds.length === 0 && messageTarget.attachments.size === 0) {
            return message.channel.send('Nothing was found in the message fetched from the specified arguments.')
        }
        await fileUpload(messageTarget).then(async (fileList) => {
            if (!fileList) return
            let newData = new CustomCommands({
                CustomCommand: commandName,
                Description: description,
                MessageContent: mContent,
                MessageEmbeds: mEmbeds,
                MessageAttachments: fileList,
                ClientID: `${client.user.id}`,
                GuildID: `${message.guild.id}`
            })
            await newData.save();
            return message.channel.send(`Custom command has been created. Use \`.${commandName}\` to use it.`)
        })
    }
}