const {
    MessageEmbed,
    MessageAttachment
} = require("discord.js");
module.exports = {
    name: 'newchp',
    description: 'New chapter embed in specified channel',
    async execute(message, args, client) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        try {
            const redURL = args[1];
            const chpNumber = args[0];
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
        } catch (err) {
            console.log(err)
        }
        
    }

}