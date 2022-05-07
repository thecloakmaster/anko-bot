const {
    MessageEmbed
} = require("discord.js");
const client_neko = require('nekos.life');
const neko = new client_neko();
module.exports = {
    name: 'pat',
    description: 'Pats the specified user and makes them feel a little bit better.',
    usage: ";pat @mention",
    async execute(message) {
        if (message.mentions.members.size === 0) {
            return message.channel.send("You cannot pat random or empty text.")
        } else if (message.mentions.members.size !== 0) {
            const member = message.mentions.members.first();
            try {
                
                let GIF = await neko.sfw.pat();
                const hug = new MessageEmbed()
                    .setColor("${process.env.colour}")
                    .setTitle(`( ノ ^o^)ノ`)
                    .setDescription(`<@${message.author.id}> patted <@${member.user.id}> on the head`)
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