const {
    MessageEmbed
} = require('discord.js');
module.exports = {
    name: 'avatar',
    aliases: ["pfp", "icon", "av", "ava"],
    description: 'Get the image URL of the tagged user\'s avatar, or the image URL of your own avatar.',
    usage: ";avatar <e (E for eternal, when you don't want the image to die when the user changes their avatar, optional)> <Mention> or ;avatar <User ID> or ;avatar for your own avatar",
    async execute(message, args) {

        let userMention = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => {});
        
        if (args[0] === 'e') {
            userMention = message.mentions.users.first() || await message.client.users.fetch(args[1]).catch(() => {});
            if (!args[1] || !userMention) {
                let col = message.member.displayHexColor || "#000000"
                let fileNameArr = message.author.displayAvatarURL({
                    dynamic: true,
                    size: 2048
                }).split(/\//g)
                let fileName = fileNameArr[fileNameArr.length - 1].split(/\?/g)
                fileName = fileName[0]
                let file = new MessageAttachment(`${message.author.displayAvatarURL({dynamic:true, size:2048})}`).setName(`${fileName}`)
                const nomentionEmbed = new MessageEmbed()
                    .setTitle(`Here's your avatar ${message.author.username}`)
                    .setDescription(`Download | [png](${message.author.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${message.author.displayAvatarURL({dynamic:true, format:'gif', size:2048})}) | [webp](${message.author.displayAvatarURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${message.author.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
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
                const member = await message.guild.members.fetch(`${userMention.id}`).catch(() => {})
                let col = null
                if (!member) {
                    col = "#000000"
                } else if (member) {
                    col = member.displayHexColor || "#000000"
                }
                let fileNameArr = userMention.displayAvatarURL({
                    dynamic: true,
                    size: 2048
                }).split(/\//g)
                let fileName = fileNameArr[fileNameArr.length - 1].split(/\?/g)
                fileName = fileName[0]
                let file = new MessageAttachment(`${userMention.displayAvatarURL({dynamic:true, size:2048})}`).setName(`${fileName}`)
                const mentionedEmbed = new MessageEmbed()
                    .setTitle(`Here's the avatar for ${userMention.tag}`)
                    .setDescription(`Download | [png](${userMention.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${userMention.displayAvatarURL({dynamic:true, format:'gif', size: 2048})}) | [webp](${userMention.displayAvatarURL({dynamic:false, format:'webp', size: 2048})}) | [jpeg](${userMention.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
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

        if (!args[0]) {
            let col = message.member.displayHexColor || "#000000"
            const nomentionEmbed = new MessageEmbed()
                .setTitle(`Here's your avatar ${message.author.username}`)
                .setDescription(`Download | [png](${message.author.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${message.author.displayAvatarURL({dynamic:true, format:'gif', size:2048})}) | [webp](${message.author.displayAvatarURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${message.author.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
                .setColor(`${col}`)
                .setImage(`${message.author.displayAvatarURL({dynamic:true, size:2048})}`)
                .setFooter({
                    text: `${message.author.tag}`
                })
                .setTimestamp();

            return message.channel.send({
                embeds: [nomentionEmbed]
            });
        } else if (!userMention)  {
            return message.channel.send("Please send a valid user-ID or user")
        }else {
            const member = await message.guild.members.fetch(`${userMention.id}`).catch(() => {})
            let col = null
            if (!member){
                col = "#000000"
            } else if (member) {
                col = member.displayHexColor || "#000000"
            }
            const mentionedEmbed = new MessageEmbed()
                .setTitle(`Here's the avatar for ${userMention.tag}`)
                .setDescription(`Download | [png](${userMention.displayAvatarURL({dynamic:false, format:'png', size: 2048})}) | [gif](${userMention.displayAvatarURL({dynamic:true, format:'gif', size: 2048})}) | [webp](${userMention.displayAvatarURL({dynamic:false, format:'webp', size: 2048})}) | [jpeg](${userMention.displayAvatarURL({dynamic:false, format:'jpeg', size: 2048})})`)
                .setColor(`${col}`)
                .setImage(`${userMention.displayAvatarURL({dynamic:true, size:2048})}`)
                .setFooter({text: `${message.author.tag}`})
                .setTimestamp();

            return message.channel.send({
                embeds: [mentionedEmbed]
            });
        }
    }
}