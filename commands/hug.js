const {
    MessageEmbed,
    Message
} = require("discord.js");
const client_neko = require('nekos.life');
const neko = new client_neko();
module.exports = {
    name: 'hug',
    description: 'Hugs the specified user and makes them feel a little better.',
    usage: ";hug @mention",
    async execute(message) {
        if (message.mentions.members.size === 0) {
            return message.channel.send("You cannot hug random or empty text.")
        } else if (message.mentions.members.size !== 0) {
            const member = message.mentions.members.first();
            try {
                
                let GIF = await neko.sfw.hug();
                const hug = new MessageEmbed()
                    .setColor("#e4a353")
                    .setTitle(`⊂((・▽・))⊃`)
                    .setDescription(`<@${message.author.id}> hugged <@${member.user.id}>`)
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