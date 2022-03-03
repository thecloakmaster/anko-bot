const {
    MessageEmbed,
    Message
} = require("discord.js");
const client_neko = require('nekos.life');
const neko = new client_neko();
module.exports = {
    name: 'kiss',
    description: 'Kisses the specified user and makes them feel a little bit better.',
    usage: ";kiss @mention",
    async execute(message) {
        if (message.mentions.members.size === 0) {
            return message.channel.send("You cannot kiss random or empty text.")
        } else if (message.mentions.members.size !== 0) {
            const member = message.mentions.members.first();
            try {

                let GIF = await neko.sfw.kiss();
                const kiss = new MessageEmbed()
                    .setColor("#e4a353")
                    .setTitle(`-_-`)
                    .setDescription(`<@${message.author.id}> slapped <@${member.user.id}>`)
                    .setImage(`${GIF.url}`);
                return message.channel.send({
                    embeds: [kiss]
                });
            } catch (err) {
                console.log(err);
            }
        }
    }

}