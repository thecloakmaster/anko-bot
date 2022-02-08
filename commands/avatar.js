const {
    MessageEmbed,
    Guild,
    Message
} = require('discord.js');
module.exports = {
    name: 'avatar',
    aliases: ["pfp", "icon", "av", "ava"],
    description: 'Get the avatar URL of the tagged user, or your own avatar.',
    usage: ";avatar @mention or ;avatar <user ID> or ;avatar for your own avatar",
    async execute(message, args) {

        let userMention = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => {});
        
        if (!userMention || args[0] === undefined) {
            const nomentionEmbed = new MessageEmbed()
                .setTitle(`Here's your avatar ${message.author.username}`)
                .setDescription(`Download | [png](${message.author.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${message.author.displayAvatarURL({dynamic:true, format:'gif', size:2048})}) | [webp](${message.author.displayAvatarURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${message.author.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
                .setColor('#FFC0CB')
                .setImage(`${message.author.displayAvatarURL({dynamic:true, size:2048})}`)
                .setFooter({
                    text: `${message.author.tag}`
                })
                .setTimestamp();

            return message.reply({
                embeds: [nomentionEmbed]
            });
        } else {

            const mentionedEmbed = new MessageEmbed()
                .setTitle(`Here's the avatar for ${userMention.tag}`)
                .setDescription(`Download | [png](${userMention.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${userMention.displayAvatarURL({dynamic:true, format:'gif', size: 2048})}) | [webp](${userMention.displayAvatarURL({dynamic:false, format:'webp', size: 2048})}) | [jpeg](${userMention.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
                .setColor('#FFC0CB')
                .setImage(`${userMention.displayAvatarURL({dynamic:true, size:2048})}`)
                .setFooter({text: `${message.author.tag}`})
                .setTimestamp();

            return message.reply({
                embeds: [mentionedEmbed]
            });
        }
    }
}