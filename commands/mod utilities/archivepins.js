const {MessageEmbed} = require('discord.js');
module.exports = {
    name: 'archivepins',
    description: "Takes pins from a channel and archives them into embeds.",
    usage: ";archivepins",
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has(`MANAGE_MESSAGES`)) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_MESSAGES\`.`)
        } else if (!bot.permissions.has(`MANAGE_MESSAGES`)) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_MESSAGES\`.`)
        }

        message.channel.send("Archiving pins....");
        
        const pinFetch = await message.channel.messages.fetchPinned();

        const pinnedMessages = Array.from(pinFetch.values());
        try {
            for (let i = 0; i < pinnedMessages.length; i++) {
                let pin = pinnedMessages[i];
                let color = "#000000"
                const inServer = await message.guild.members.fetch(pin.author.id).catch(() => {});
                if (!inServer) {
                    color = "#000000"
                } else {
                    color = pin.member.displayHexColor;
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
            .setColor("${process.env.colour}")
            .setDescription(`**The pin archiving has been completed successfully.** \n\n [Go to the first archived message.](${message.url})`)
            .setTimestamp();
            message.channel.send({embeds: [afterArchive]}).then((message) => message.pin());

        } catch(err) {
            console.log(err)
        }
        
    }
}