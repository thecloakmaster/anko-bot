const {
    MessageEmbed,
    Guild,
    Message
} = require('discord.js');
module.exports = {
    name: 'archivepins',
    description: "Takes pins from a channel and archives them.",
    async execute(message) {

        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            const permerror = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Error executing that command`)
                .setDescription(`You do not have the necessary permissions to execute this command`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        };

        message.channel.send("Archiving pins....");
        
        const pinFetch = await message.channel.messages.fetchPinned();

        const pinnedMessages = Array.from(pinFetch.values());
        try {
            for (var i = 0; i < pinnedMessages.length; i++) {
                let pin = pinnedMessages[i];
                var color = "#FFFFFF"
                const inServer = await message.guild.members.fetch(pin.author.id).catch(() => {});
                if (!inServer) {
                    var color = "#FFFFFF"
                } else {
                    var color = pin.member.displayHexColor;
                };

                if (pin.attachments.size > 0) {
                    pin.attachments.forEach(attachment => {
                        let imageURL = attachment.proxyURL;
                        let embed = new MessageEmbed()
                            .setColor(color)
                            .setDescription(`${pin.content} \n\n[Jump to message](${pin.url})`)
                            .setImage(imageURL)
                            .setTimestamp(pin.createdTimestamp)
                            .setAuthor({name:pin.author.username, iconURL: pin.author.displayAvatarURL()});
                        message.channel.send({
                            embeds: [embed]
                        })
                        pin.unpin()
                    })
                } else {
                    let embed = new MessageEmbed()
                        .setColor(color)
                        .setDescription(`${pin.content} \n\n[Jump to message](${pin.url})`)
                        .setAuthor({name: pin.author.username, iconURL: pin.author.displayAvatarURL()})
                        .setTimestamp(pin.createdTimestamp);
                    message.channel.send({
                        embeds: [embed]
                    })
                    pin.unpin()   
                }
            }
            const afterArchive = new MessageEmbed()
            .setColor("#97e0ff")
            .setDescription(`**The pin archiving has been completed successfully.** \n\n [Go to the first archived message.](${message.url})`)
            .setTimestamp();
            message.channel.send({embeds: [afterArchive]});

        } catch(err) {
            console.log(err)
        }
        
    }
}