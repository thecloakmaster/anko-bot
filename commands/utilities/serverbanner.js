const {
    MessageEmbed
} = require('discord.js');
module.exports = {
    name: 'serverbanner',
    aliases: ["serverb"],
    description: 'Sends the server banner.',
    usage: ";serverbanner",
    async execute(message) {
        if (message.guild.bannerURL() === null) return message.reply("This server does not have a banner.");
        const embedAvatar = new MessageEmbed()
            .setColor("#e4a353")
            .setTitle(`Here's the server's banner.`)
            .setDescription(`Download | [png](${message.guild.bannerURL({dynamic:false, format:'png', size: 2048})}) | [gif](${message.guild.bannerURL({dynamic:true, format:'gif', size:2048})}) | [webp](${message.guild.bannerURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${message.guild.bannerURL({dynamic:false, format:'jpeg', size: 2048})})`)
            .setFooter({
                text: `${message.author.tag}`
            })
            .setImage(`${message.guild.bannerURL({dynamic:true, size:2048})}`);
        return message.channel.send({
            embeds: [embedAvatar]
        });
    }
}