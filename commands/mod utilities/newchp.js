const {
    MessageEmbed,
    MessageAttachment
} = require("discord.js");
module.exports = {
    name: 'newchp',
    description: 'Sends an embed to the new chapter channel.',
    usage: ';newchp <chapter number> <Reddit URL for the new chapter>',
    async execute(message, args, client) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        try {
            const redURL = args[1];
            const chpNumber = args[0];
            const num = parseInt(chpNumber);
            if (!redURL || !chpNumber) {
                return message.channel.send(`Please enter a valid number for the chapter number and a valid Reddit URL.\nSyntax: \`;newchp <Chapter Number> <Reddit link>\`.`)
            }
            redURL = redURL.replace(/\s/g, '')
            try {
                let urlcheck = new URL(redURL)
                num1 = redURL.indexOf(`https://www.reddit.com/r/`)
                num2 = redURL.indexOf(`https://old.reddit.com/r/`)

                if (num1 === -1 && num2 === -1) {
                    return message.channel.send(`Please enter a valid Reddit URL after the chapter number. \nSyntax: \`;newchp <Chapter Number> <Reddit link>\`.`)
                }
            } catch (err) {
                console.log(err)
                return message.channel.send(`Please enter a valid Reddit URL after the chapter number.\nSyntax: \`;newchp <Chapter Number> <Reddit link>\`.`)
            }
            if (isNaN(num)) {
                return message.channel.send(`Please enter a valid number after the command.\nSyntax: \`;newchp <Chapter Number> <Reddit link>\`.`)

            } else if (!isNaN(num)) {
                const channelID = message.guild.channels.cache.find(chn => chn.id === '908021114138132510');
                let pingRole = message.guild.roles.cache.find(role => role.name === 'Manga Release');
                const file = new MessageAttachment('./assets/vol.jpg');
                let mangaID = message.guild.channels.cache.find(chn => chn.name === 'ynu-manga')

                const chpEmbed = new MessageEmbed()
                    .setThumbnail('attachment://vol.jpg')
                    .setAuthor({
                        name: `Yofukashi no Uta - Chapter ${chpNumber}`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setDescription(`A new manga chapter has just been released. The chapter is available on MangaDex and the link can be found on the reddit post. Use <#${mangaID.id}> to discuss the chapter. 
        \n*Make sure to use spoilers to talk about the latest chapter to not spoil it for someone else. Enjoy the chapter!*`)
                    .addField('Reddit Link', `[Click here!](${redURL})`)
                    .setColor("#e4a353")
                channelID.setName(`ch-${chpNumber}-info`)

                return channelID.send({
                    content: `<@&${pingRole.id}>`,
                    embeds: [chpEmbed],
                    files: [file]
                })
            }
        } catch (err) {
            console.log(err)
        }
        
    }

}