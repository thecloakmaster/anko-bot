const {
    MessageEmbed,
    Guild,
    Message
} = require('discord.js');

module.exports = {
    name: 'addsticker',
    aliases: ['addst', 'stickeradd', 'addsticker'],
    async execute(message, args) {
        if (!message.member.permissions.has("MANAGE_EMOTES_AND_STICKERS")) {
            const permerror = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Error executing that command.`)
                .setDescription(`You do not have the necessary permissions to execute this command.`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        }
        if (message.guild.premiumTier === `NONE`) {return message.channel.send(`This server has no boosts and hence no stickers can be added.`)}
        let url = args[0]
        let stickerName = args.slice(1).join(" ")
        if (!args[0]) return message.reply(`Please enter a valid input. \nSyntax: \`;addsticker <stickername> <image URL>\``)
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
            return message.reply(`There was an error trying to add that sticker. \nMake sure the image is under 512 KB. \nSyntax: \`;addsticker <stickername> <image URL>\``)
        }
        if (stickerName.length < 2) return message.channel.send(`The sticker name must be at least 2 characters long.`)
        try {
            await message.guild.stickers.create(`${url}`, `${stickerName}`,`smile`).then((sticker) => {
                if (!sticker) {
                    return message.channel.send(`There was an error trying to add that sticker. \nMake sure the image is under 512 KB. \nSyntax: \`;addsticker <stickername> <image URL>\``)
                } else {
                    const embed = new MessageEmbed()
                        .setColor(`AQUA`)
                        .setDescription(`An sticker with the name \`${stickerName}\` has been added to the server.`)
                    return message.channel.send({
                        embeds: [embed]
                    })
                }
            }).catch(err => {
                console.log(err.code)
                console.log(err)
                if (err.code === 30008) {
                    return message.channel.send('An error occurred while adding the sticker. \nThe server has capped out on its sticker limit.')
                } else if (err.code === 50035) {
                    return message.channel.send(`An error occurred while adding the sticker. \nMake sure the file is under 512 KB and the sticker name isn't very long.`)
                } else {
                    return message.channel.send(`An error occurred while adding the sticker. Make sure the file is a PNG, is under 512 KB and the sticker name isn't very long. \nSyntax: \`;addsticker <stickername> <image URL>\``)
                }
            })

        } catch (err) {
            console.log(err)
            return message.reply(`There was an error trying to add that sticker. \nMake sure the image is a PNG file and is under 512 KB. \nSyntax: \`;addsticker <stickername> <image URL>\``)
        }


    }
}