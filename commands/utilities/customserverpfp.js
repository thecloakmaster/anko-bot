const {
    MessageEmbed, MessageAttachment
} = require("discord.js");

module.exports = {
    name: 'customserverpfp',
    description: 'Sends the server specific profile picture of the member.',
    usage: ";customserverpfp <e (e for eternal, when you don't want the image to die when the user changes their avatar, optional)> <Mention or User ID (leave blank to get your own avatar)>",
    async execute(message, args) {
        let memberMention = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});

        if (args[0] === 'e') {
            memberMention = message.mentions.members.first() || await message.guild.members.fetch(args[1]).catch(() => {});
            if (!args[1] || !memberMention) {
                let col = message.member.displayHexColor || "#000000"
                let fileNameArr = message.member.displayAvatarURL({
                    dynamic: true,
                    size: 2048
                }).split(/\//g)
                let fileName = fileNameArr[fileNameArr.length - 1].split(/\?/g)
                fileName = fileName[0]
                let file = new MessageAttachment(`${message.member.displayAvatarURL({dynamic:true, size:2048})}`).setName(`${fileName}`)
                const nomentionEmbed = new MessageEmbed()
                    .setTitle(`Here's your server avatar ${message.author.username}`)
                    .setDescription(`[Download](${file.url}) | [png](${message.member.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${message.member.displayAvatarURL({dynamic:true, format:'gif', size:2048})}) | [webp](${message.member.displayAvatarURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${message.member.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
                    .setColor(`${col}`)
                    .setImage(`attachment://${fileName}`)
                    .setFooter({
                        text: `${message.author.tag}`
                    })
                    .setTimestamp();

                return message.channel.send({
                    files: [file],
                    embeds: [nomentionEmbed]
                });
            } else {                
                let col = memberMention.displayHexColor || "#000000"
                let fileNameArr = memberMention.displayAvatarURL({
                    dynamic: true,
                    size: 2048
                }).split(/\//g)
                let fileName = fileNameArr[fileNameArr.length - 1].split(/\?/g)
                fileName = fileName[0]
                let file = new MessageAttachment(`${memberMention.displayAvatarURL({dynamic:true, size:2048})}`).setName(`${fileName}`)
                const mentionedEmbed = new MessageEmbed()
                    .setTitle(`Here's the server specific avatar for ${memberMention.user.tag}`)
                    .setDescription(`[Download](${file.url}) | [png](${memberMention.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${memberMention.displayAvatarURL({dynamic:true, format:'gif', size: 2048})}) | [webp](${memberMention.displayAvatarURL({dynamic:false, format:'webp', size: 2048})}) | [jpeg](${memberMention.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
                    .setColor(`${col}`)
                    .setImage(`attachment://${fileName}`)
                    .setFooter({
                        text: `${message.author.tag}`
                    })
                    .setTimestamp();

                return message.channel.send({
                    files: [file],
                    embeds: [mentionedEmbed]
                });
            }
        }

        if (!args[0] || !memberMention) {
            try {
                const col = message.member.displayHexColor || "#000000"
                const embed = new MessageEmbed()
                    .setTitle(`Here's your server avatar.`)
                    .setDescription(`Download | [png](${message.member.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${message.member.displayAvatarURL({dynamic:true, format:'gif', size:2048})}) | [webp](${message.member.displayAvatarURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${message.member.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
                    .setColor(`${col}`)
                    .setImage(`${message.member.displayAvatarURL({dynamic:true, size:2048})}`);
                return message.channel.send({
                    embeds: [embed]
                })
            } catch (err) {}
        } else if (message.guild.members.cache.get(memberMention.id)) {
            try {
                const col = memberMention.displayHexColor || "#000000"
                const embed = new MessageEmbed()
                    .setTitle(`Here's the server specific avatar for ${memberMention.user.tag}`)
                    .setDescription(`Download | [png](${memberMention.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${memberMention.displayAvatarURL({dynamic:true, format:'gif', size:2048})}) | [webp](${memberMention.displayAvatarURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${memberMention.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
                    .setColor(`${col}`)
                    .setImage(`${memberMention.displayAvatarURL({dynamic:true, size:2048})}`);
                return message.channel.send({
                    embeds: [embed]
                })
            } catch (err) {}
        }
    }
}