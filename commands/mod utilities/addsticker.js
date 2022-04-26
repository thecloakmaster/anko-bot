const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'addsticker',
    description:`Adds a sticker in the guild with the image and name provided.`,
    usage: `;addsticker <Image URL> <Sticker name>\` or \`;addsticker <Sticker name> if u attach an image with the message`,
    aliases: ['addst', 'stickeradd', 'addsticker'],
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_EMOJIS_AND_STICKERS\``)
        } else if (!bot.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_EMOJIS_AND_STICKERS\``)
        }
        if (message.guild.premiumTier === `NONE`) {return message.channel.send(`This server has no boosts and hence no stickers can be added.`)}
        if (!args[0]) return message.reply(`Please enter a valid input. \nSyntax: \`;addsticker <Image URL> <Sticker name>\` or \`;addsticker <Sticker name> if u attach an image or gif with the message\``)
        let url = args[0]
        let stickerName = args.slice(1).join(" ")
        try {
            if (message.attachments.size > 1) {
                return message.reply(`Please enter only one image at a time.`)
            }
            if (message.attachments.size > 0) {
                message.attachments.forEach(sticker => {
                    url = sticker.proxyURL;
                });
                stickerName = args.slice(0).join(" ")
            }
        } catch (err) {
            console.log(err)
            return message.reply(`There was an error trying to add that sticker. \nMake sure the image is under 512 KB. \nSyntax: \`;addsticker <Image URL> <Sticker name>\` or \`;addsticker <Sticker name> if u attach an image with the message\``)
        }
        if (stickerName.length > 30) {
            return message.channel.send(`The sticker name is longer than 30 characters. Please try to shorten the sticker name to less than 30 characters`)
        } else if (stickerName.length < 2) {
            return message.channel.send(`The sticker name must be at least 2 characters long.`)
        }
        url = url.replace(/\s/g, '')
        try {
            let urlcheck = new URL(url)
            let imgMatch = url.split(/[#?]/)[0].split('.').pop().trim();
            if (imgMatch != 'png') {
                return message.channel.send(`Please enter a valid image URL to a .png file.`)
            }
        } catch (err) {
            return message.channel.send(`Please enter a valid URL.\nSyntax: \`;addsticker <Image URL> <Sticker name>\` or \`;addsticker <Sticker name> if u attach an image with the message\``)
        }
        try {
            await message.guild.stickers.create(`${url}`, `${stickerName}`,`smile`).then((sticker) => {
                if (!sticker) {
                    return message.channel.send(`There was an error trying to add that sticker. \nMake sure the image is under 512 KB. \nSyntax: \`;addsticker <Image URL> <Sticker name>\` or \`;addsticker <Sticker name> if u attach an image with the message\``)
                } else {
                    const embed = new MessageEmbed()
                        .setColor(`#e4a353`)
                        .setDescription(`A sticker with the name \`${stickerName}\` has been added to the server.`)
                    return message.channel.send({
                        embeds: [embed]
                    })
                }
            }).catch(err => {
                console.log(err.code)
                console.log(err)
                if (err.code === 30008) {
                    return message.channel.send('An error occurred while adding the sticker. \nThe server has capped out on its sticker limit.')
                } else if (err.code === 50045) {
                    return message.channel.send(`An error occurred while adding the sticker. \nMake sure the file is under 512 KB and the sticker name is under 30 characters.`)
                } else {
                    return message.channel.send(`An error occurred while adding the sticker. Make sure the file is a PNG, is under 512 KB and the sticker name is under 30 characters.\nAnd also check if the server sticker cap has been reached. \nSyntax: \`;addsticker <Image URL> <Sticker name>\` or \`;addsticker <Sticker name> if u attach an image with the message\``)
                }
            })

        } catch (err) {
            console.log(err)
            return message.reply(`There was an error trying to add that sticker. \nMake sure the image is a PNG file and is under 512 KB. \nSyntax: \`;addsticker <Image URL> <Sticker name>\` or \`;addsticker <Sticker name> if u attach an image with the message\``)
        }


    }
}