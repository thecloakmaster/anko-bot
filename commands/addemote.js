const {
    MessageEmbed,
    Guild,
    Message
} = require('discord.js');

module.exports = {
    name: 'addemote',
    description: `Adds emote to the server with the name and image provided.`,
    aliases: ['addem', 'emoteadd'],
    usage: `;addemoji <Emote name> <image URL>\` or \`;addemoji <Emote name> and attach an image`,
    async execute(message, args) {
        if (!message.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            const permerror = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Error executing that command.`)
                .setDescription(`You do not have the necessary permissions to execute this command.`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        }

        if (args[0].length < 2) return message.channel.send(`The emote name must be at least 2 characters long.`)
        
        let url = args[1]
        const emoteName = args[0]
        if (!args[0]) return message.reply(`Please enter a valid input. \nSyntax: \`;addemoji <Emote name> <image URL>\` or \`;addemoji <Emote name> and attach an image\``)
        try {
            if (message.attachments.size > 1) {
                return message.reply(`Please enter only one image at a time.`)
            }
            if (message.attachments.size > 0) {
                message.attachments.forEach(emoji => {
                    url = emoji.proxyURL;
                });
            }
        } catch (err) {
            console.log(err)
            return message.reply(`There was an error trying to add that emote.\nSyntax: \`;addemoji <Emote name> <image URL>\` or \`;addemoji <Emote name> and attach an image\``)
        }
        try {
            let urlcheck = new URL(url)
        } catch (err) {
            return message.channel.send(`Please enter a valid URL for the image.\nSyntax: \`;addemoji <Emote name> <image URL>\` or \`;addemoji <Emote name> and attach an image\``)
        }
        try {
            await message.guild.emojis.create(`${url}`, `${emoteName}`).then((emoji) => {
                if (!emoji) {
                    return message.channel.send(`There was an error trying to add that emote. \nMake sure the image is under 256 KB. \nSyntax: \`;addemoji <Emote name> <image URL>\` or \`;addemoji <Emote name> and attach an image\``)
                } else {
                    const embed = new MessageEmbed()
                        .setColor(`AQUA`)
                        .setDescription(`An emote with the name \`${emoteName}\` has been added to the server.`)
                    return message.channel.send({
                        embeds: [embed]
                    })
                }
            }).catch(err => {
                console.log(err.code)
                if (err.code === 30008) {
                    return message.channel.send('An error occurred while adding the emote. \nThe server has capped out on its emote limit.')
                } else if (err.code === 50035) {
                    return message.channel.send(`An error occurred while adding the emote. \nMake sure the file is under 256 KB and the emote name isn't very long.`)
                } else {
                    return message.channel.send(`An error occurred while adding the emote. Make sure the file is under 256 KB and the emote name isn't very long. \nSyntax: \`;addemoji <emotename> <image URL>\``)
                }
            })   
        } catch (err) {
            console.log(err)
            return message.reply(`There was an error trying to add that emote. \nMake sure the image is under 256 KB. \nSyntax: \`;addemoji <emotename> <image URL>\``)
        }
    }
}