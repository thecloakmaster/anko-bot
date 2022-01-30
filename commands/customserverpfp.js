const {
    MessageEmbed,
    Guild,
    Message
} = require("discord.js");

module.exports = {
    name: 'customserverpfp',
    description: 'Gets the custom server avatar of the user.',
    async execute(message, args) {
        let memberMention = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});
        if (args[0] == undefined) {
            try {
                const embed = new MessageEmbed()
                    .setTitle(`Here's your server avatar.`)
                    .setDescription(`Download | [png](${message.member.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${message.member.displayAvatarURL({dynamic:true, format:'gif', size:2048})}) | [webp](${message.member.displayAvatarURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${message.member.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
                    .setColor("RANDOM")
                    .setImage(`${message.member.displayAvatarURL({dynamic:true, size:2048})}`);
                return message.channel.send({
                    embeds: [embed]
                })
            } catch (err) {

            }
        }
        if (!memberMention) {
            return message.reply("Please send a valid user-ID or user")
        } else if (message.guild.members.cache.get(memberMention.id)) {
            try {
                const embed = new MessageEmbed()
                    .setTitle(`Here's the server specific avatar for ${memberMention.tag}`)
                    .setDescription(`Download | [png](${memberMention.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${memberMention.displayAvatarURL({dynamic:true, format:'gif', size:2048})}) | [webp](${memberMention.displayAvatarURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${memberMention.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
                    .setColor("RANDOM")
                    .setImage(`${memberMention.displayAvatarURL({dynamic:true, size:2048})}`);
                return message.channel.send({
                    embeds: [embed]
                })
            } catch (err) {

            }
        }
    }
}