const {
    MessageEmbed,
    Message
} = require("discord.js");
const client_neko = require('nekos.life');
const neko = new client_neko();
module.exports = {
    name: 'slap',
    description: 'Sends a slap gif',
    async execute(message) {
        if (message.mentions.members.size === 0) {
            return message.channel.send("You cannot hug random or empty text.")
        } else if (message.mentions.members.size !== 0) {
            const member = message.mentions.members.first();
            try {
                
                let GIF = await neko.sfw.slap();
                const hug = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`-_-`)
                    .setDescription(`<@${message.author.id}> slapped <@${member.user.id}>`)
                    .setImage(`${GIF.url}`);
                return message.channel.send({
                    embeds: [hug]
                });
            } catch (err) {
                console.log(err);
            }
        }
    }

}