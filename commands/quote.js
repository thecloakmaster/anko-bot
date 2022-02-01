const {
    MessageEmbed,
    Guild,
    Message
} = require("discord.js");
module.exports = {
    name: 'quote',
    description: 'Embeds the mentioned message.',
    async execute(message, args) {

        const channelID = message.mentions.channels.first();
        
        if (!channelID) return message.channel.send("Please specify a valid channel.");

        const messageID = args.slice(1).join(" ");

        const messageW = await channelID.messages.fetch(`${messageID}`);

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