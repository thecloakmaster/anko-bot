const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'addemote',
    description: `Adds emote to the server with the name and image provided.`,
    aliases: ['addem', 'emoteadd'],
    usage: `;addemote <image URL> <Emote name>\` or \`;addemote <Emote name> and attach an image or gif`,
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_EMOJIS_AND_STICKERS\`.`)
        } else if (!bot.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_EMOTES_AND_STICKERS\``)
        }
        if (!args[0] || !args[1]) {
            return message.reply(`Please enter a valid input. \nSyntax: \`;addemote <image URL> <Emote name>\` or \`;addemote <Emote name> and attach an image or gif\``)
        } else if (args[0].length < 2) {
            return message.channel.send(`The emote name must be at least 2 characters long.`)
        }
        
        let url = args[0]
        const emoteName = args[1]
        url = url.replace(/\s/g, '')
        try {
            if (message.attachments.size > 1) {
                return message.reply(`Please enter only one image at a time.`)
            }
            if (message.attachments.size > 0) {
                message.attachments.forEach(emoji => {
                    url = emoji.proxyURL;
                });
                emoteName = args[0]
            }
        } catch (err) {
            console.log(err)
            return message.reply(`There was an error trying to add that emote.\nSyntax: \`;addemote <image URL> <Emote name>\` or \`;addemote <Emote name> and attach an image or gif\``)
        }
        try {
            let urlcheck = new URL(url)
            let imgRegMatch = url.match(/\.(jpeg|jpg|png|webp|gif)$/)
            if (!imgRegMatch) {
                return message.channel.send(`Please enter a valid image URL to a .jpg/.png/.webp/.gif file.`)
            }
        } catch (err) {
            return message.channel.send(`Please enter a valid URL for the image.\nSyntax: \`;addemote <image URL> <Emote name>\` or \`;addemote <Emote name> and attach an image or gif\``)
        }
        try {
            await message.guild.emojis.create(`${url}`, `${emoteName}`).then((emoji) => {
                if (!emoji) {
                    return message.channel.send(`There was an error trying to add that emote. \nMake sure the image is under 256 KB. \nSyntax: \`;addemote <image URL> <Emote name>\` or \`;addemote <Emote name> and attach an image or gif\``)
                } else {
                    const embed = new MessageEmbed()
                        .setColor(`#e4a353`)
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
                    return message.channel.send(`An error occurred while adding the emote. Make sure the file is under 256 KB and the emote name isn't very long. \nSyntax: \`;addemote <image URL> <Emote name>\` or \`;addemote <Emote name> and attach an image or gif\``)
                }
            })   
        } catch (err) {
            console.log(err)
            return message.reply(`There was an error trying to add that emote. \nMake sure the image is under 256 KB. \nSyntax: \`;addemote <image URL> <Emote name>\` or \`;addemote <Emote name> and attach an image or gif\``)
        }
    }
}