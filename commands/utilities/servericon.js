const {
    MessageEmbed
} = require('discord.js');
module.exports = {
    name: 'servericon',
    aliases: ["serveravatar", "serveravi", "serverav", "serverpfp"],
    description: `Sends the server's icon.`,
    async execute(message) {
        if (message.guild.iconURL() === null) return message.reply("This server does not have an icon.");
        const embedAvatar = new MessageEmbed()
            .setColor("${process.env.colour}")
            .setTitle(`Here's the server's profile picture.`)
            .setDescription(`Download | [png](${message.guild.iconURL({dynamic:false, format:'png', size: 2048})}) | [gif](${message.guild.iconURL({dynamic:true, format:'gif', size:2048})}) | [webp](${message.guild.iconURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${message.guild.iconURL({dynamic:false, format:'jpeg', size: 2048})})`)
            .setFooter({
                text: `${message.author.tag}`
            })
            .setImage(`${message.guild.iconURL({dynamic:true, size:2048})}`);
        return message.channel.send({
            embeds: [embedAvatar]
        });
    }
}