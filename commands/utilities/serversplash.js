const {
    MessageEmbed
} = require('discord.js');
module.exports = {
    name: 'serversplash',
    description: `Sends the server's splash background image.`,
    usage: ";serversplash",
    async execute(message) {
        if (message.guild.splashURL() === null) return message.reply("This server does not have a splash background image.");
        const embedAvatar = new MessageEmbed()
            .setColor("#e4a353")
            .setTitle(`Here's the server's splash background image.`)
            .setDescription(`Download | [png](${message.guild.splashURL({dynamic:false, format:'png', size: 2048})}) | [webp](${message.guild.splashURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${message.guild.splashURL({dynamic:false, format:'jpeg', size: 2048})})`)
            .setFooter({
                text: `${message.author.tag}`
            })
            .setImage(`${message.guild.splashURL({size:4096})}`);
        return message.channel.send({
            embeds: [embedAvatar]
        });
    }
}