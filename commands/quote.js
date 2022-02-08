const {
    MessageEmbed,
    Guild,
    Message
} = require("discord.js");
module.exports = {
    name: 'quote',
    aliases: ["q"],
    description: 'Fetches previously sent message and sends it in an embed.',
    usage: ";quote #channel <message ID> or ;quote <message ID> if message exists in the same channel",
    async execute(message, args) {

        let potentialID = args[0]

        let messageW = null

        try {
            messageW = await message.channel.messages.fetch(`${potentialID}`)
            try {
                const inServer = await message.guild.members.fetch(messageW.author.id).catch(() => {});
                if (!inServer) {
                    var color = "#4752c4"
                } else {
                    var color = messageW.member.displayHexColor;
                    console.log(color)
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
        
        if (!channelID) return message.channel.send("Please specify a valid channel or ID.");

        const messageID = args.slice(1).join(" ");

        try {messageW = await channelID.messages.fetch(`${messageID}`);} catch(err) {return message.channel.send("Please enter a valid message ID")}

        if (!messageW) return message.channel.send("Please specify a valid message ID");

        try {
            const inServer = await message.guild.members.fetch(messageW.author.id).catch(() => {});
            if (!inServer) {
                var color = "#4752c4"
            } else {
                var color = messageW.member.displayHexColor;
                console.log(color)
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