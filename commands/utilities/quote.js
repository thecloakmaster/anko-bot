const {
    MessageEmbed
} = require("discord.js");
module.exports = {
    name: 'quote',
    aliases: ["q"],
    description: 'Fetches previously sent message and sends it in an embed.',
    usage: ";quote <Message URL> or ;quote <#Channel> <Message ID> or ;quote <Message ID> if message exists in the same channel",
    async execute(message, args) {

        let potentialID = args[0]

        let messageW = null

        if (!args) {
            return message.channel.send(`Please enter a valid message ID and mention a channel if the message is not in the same channel.\nSyntax: \`;quote <Message URL>\` or \`;quote <Channel> <Message ID>\` or \`;quote <Message ID>\` if the message is in the same channel.`)
        }

        if (args[0].includes('discord.com/channels/')) {
            try {
                let url = new URL(args[0])
                let urlArr = args[0].split(/\//g);                
                if (urlArr.length > 4) {
                    if (isNaN(urlArr[urlArr.length - 3]) || isNaN(urlArr[urlArr.length - 2]) || isNaN(urlArr[urlArr.length - 1])) {
                        return message.channel.send('The URL specified is not of a message ID.\nSyntax: \`;quote <Message URL>\` or \`;quote <Channel> <Message ID>\` or \`;quote <Message ID>\` if the message is in the same channel.')
                    }
                    if (!isNaN(urlArr[urlArr.length - 3]) && urlArr[urlArr.length - 3] === message.guild.id) {
                        let channel = await message.guild.channels.fetch(urlArr[urlArr.length - 2]).catch(() => {})
                        if (!channel) {
                            return message.channel.send('Could not fetch the channel for the URL specified.\nSyntax: \`;quote <Message URL>\` or \`;quote <Channel> <Message ID>\` or \`;quote <Message ID>\` if the message is in the same channel.');
                        }
                        messageW = await channel.messages.fetch(urlArr[urlArr.length - 1]).catch(() => {})
                        if (!messageW) {
                            return message.channel.send('Could not fetch the message for the URL specified.\nSyntax: \`;quote <Message URL>\` or \`;quote <Channel> <Message ID>\` or \`;quote <Message ID>\` if the message is in the same channel.');
                        } else if (messageW) {
                            const inServer = await message.guild.members.fetch(messageW.author.id).catch(() => {});
                            let color = "#000000"
                            if (!inServer) {
                                color = "#000000"
                            } else {
                                color = messageW.member.displayHexColor;
                            };

                            if (messageW.attachments.size > 0) {
                                messageW.attachments.forEach(attachment => {
                                    let imageURL = attachment.proxyURL;
                                    const embed = new MessageEmbed()
                                        .setColor(color)
                                        .setDescription(`${messageW.content} \n\n[Jump to message](${messageW.url})`)
                                        .setImage(imageURL)
                                        .setTimestamp(messageW.createdTimestamp)
                                        .setAuthor({name: messageW.author.username, iconURL: messageW.author.displayAvatarURL()});
                                    return message.channel.send({embeds: [embed]})
                                })
                                return;
                            } else {
                                const embed = new MessageEmbed()
                                    .setColor(color)
                                    .setDescription(`${messageW.content} \n\n[Jump to message](${messageW.url})`)
                                    .setAuthor({name: messageW.author.username, iconURL: messageW.author.displayAvatarURL()})
                                    .setTimestamp(messageW.createdTimestamp);
                                return message.channel.send({embeds: [embed]})
                            }
                        }
                    } else if (isNaN(urlArr[urlArr.length - 3]) || urlArr[urlArr.length - 3] !== message.guild.id) {
                        return message.channel.send('The URL specified is not of a message from this server.\nSyntax: \`;quote <Message URL>\` or \`;quote <Channel> <Message ID>\` or \`;quote <Message ID>\` if the message is in the same channel.')
                    }
                }
            } catch (err){                
                return message.channel.send('Please specify a valid URL for the message.\nSyntax: \`;quote <Message URL>\` or \`;quote <Channel> <Message ID>\` or \`;quote <Message ID>\` if the message is in the same channel.')
            }
        }

        try {
            messageW = await message.channel.messages.fetch(`${potentialID}`)
            try {
                const inServer = await message.guild.members.fetch(messageW.author.id).catch(() => {});
                let color = "#000000"
                if (!inServer) {
                    color = "#000000"
                } else {
                    color = messageW.member.displayHexColor;
                };

                if (messageW.attachments.size > 0) {
                    messageW.attachments.forEach(attachment => {
                        let imageURL = attachment.proxyURL;
                        const embed = new MessageEmbed()
                            .setColor(color)
                            .setDescription(`${messageW.content} \n\n[Jump to message](${messageW.url})`)
                            .setImage(imageURL)
                            .setTimestamp(messageW.createdTimestamp)
                            .setAuthor({
                                name: messageW.author.username,
                                iconURL: messageW.author.displayAvatarURL()
                            });
                        return message.channel.send({
                            embeds: [embed]
                        })
                    })
                    return;
                } else {
                    const embed = new MessageEmbed()
                        .setColor(color)
                        .setDescription(`${messageW.content} \n\n[Jump to message](${messageW.url})`)
                        .setAuthor({
                            name: messageW.author.username,
                            iconURL: messageW.author.displayAvatarURL()
                        })
                        .setTimestamp(messageW.createdTimestamp);
                    return message.channel.send({
                        embeds: [embed]
                    })
                }

            } catch (err) {
                console.log(err)
            }
        } catch (err) {}

        const channelID = message.mentions.channels.first();
        
        if (!channelID) return message.channel.send("Please specify a valid channel or ID.\nSyntax: \`;quote <Message URL>\` or \`;quote <Channel> <Message ID>\` or \`;quote <Message ID>\` if the message is in the same channel.");

        const messageID = args[1];

        try {messageW = await channelID.messages.fetch(`${messageID}`);} catch(err) {return message.channel.send("Please enter a valid message ID. \nSyntax: \`;quote <Message URL>\` or \`;quote <Channel> <Message ID>\` or \`;quote <Message ID>\` if the message is in the same channel.")}

        if (!messageW) return message.channel.send("Please specify a valid message ID. \nSyntax: \`;quote <Message URL>\` or \`;quote <Channel> <Message ID>\` or \`;quote <Message ID>\` if the message is in the same channel.");

        try {
            const inServer = await message.guild.members.fetch(messageW.author.id).catch(() => {});
            let color = "#000000"
            if (!inServer) {
                color = "#000000"
            } else {
                color = messageW.member.displayHexColor;
            };
            
            if(messageW.attachments.size > 0) {
                messageW.attachments.forEach(attachment => {
                    let imageURL = attachment.proxyURL;
                    const embed = new MessageEmbed()
                        .setColor(color)
                        .setDescription(`${messageW.content} \n\n[Jump to message](${messageW.url})`)
                        .setImage(imageURL)
                        .setTimestamp(messageW.createdTimestamp)
                        .setAuthor({
                            name: messageW.author.username,
                            iconURL: messageW.author.displayAvatarURL()
                        });
                    message.channel.send({
                        embeds: [embed]
                    })
                })
            } else {
                const embed = new MessageEmbed()
                    .setColor(color)
                    .setDescription(`${messageW.content} \n\n[Jump to message](${messageW.url})`)
                    .setAuthor({
                        name: messageW.author.username,
                        iconURL: messageW.author.displayAvatarURL()
                    })
                    .setTimestamp(messageW.createdTimestamp);
                message.channel.send({
                    embeds: [embed]
                })
            }

        } catch (err) {
            console.log(err)
        }
    }
}