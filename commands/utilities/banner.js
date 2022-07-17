const {
    MessageEmbed, MessageAttachment
} = require('discord.js');
module.exports = {
    name: 'banner',
    description: 'Get the image URL of the tagged user\'s banner, or the image URL of your own banner.',
    usage: ";banner @mention or ;banner <user ID> or ;banner for your own banner",
    cooldown: 10000,
    async execute(message, args, client) {

        let userMention = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => {});

        if (args[0] === 'e') {
            userMention = message.mentions.users.first() || await message.client.users.fetch(args[1]).catch(() => {});
            if (!args[1] || !userMention) {
                userMention = await client.users.fetch(message.author.id, {
                    force: true
                }).catch(() => {})
                if (!userMention.bannerURL()) {
                    return message.channel.send(`You do not have a banner image.`)
                }
                let col = message.member.displayHexColor || "#000000";
                let fileNameArr = userMention.bannerURL({dynamic: true, size: 4096}).split(/\//g);
                let fileName = fileNameArr[fileNameArr.length - 1].split(/\?/g);
                fileName = fileName[0]
                let file = new MessageAttachment(`${userMention.bannerURL({dynamic: true, size: 4096})}`).setName(`${fileName}`)
                let embed = new MessageEmbed()
                    .setTitle(`Here's your banner ${message.author.username}`)
                    .setDescription(`[Download](${file.url}) | [png](${userMention.bannerURL({dynamic:false, format:'png', size: 2048})}) | [gif](${userMention.bannerURL({dynamic:true, format:'gif', size:2048})}) | [webp](${userMention.bannerURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${userMention.bannerURL({dynamic:false, format:'jpeg', size: 2048})})`)
                    .setColor(`${col}`)
                    .setImage(`attachment://${fileName}`)
                    .setFooter({
                        text: `${message.author.tag}`
                    })
                    .setTimestamp();
                return message.channel.send({
                    files: [file],
                    embeds: [embed]
                });
            } else if (userMention) {
                userMention = await client.users.fetch(userMention.id, {
                    force: true
                }).catch(() => {})
                if (!userMention.bannerURL()) {
                    return message.channel.send(`This user does not have a banner image.`)
                }
                const member = await message.guild.members.fetch(`${userMention.id}`).catch(() => {})
                let col = member.displayHexColor || "#000000"
                let fileNameArr = userMention.bannerURL({dynamic: true, size: 4096}).split(/\//g);
                let fileName = fileNameArr[fileNameArr.length - 1].split(/\?/g);
                fileName = fileName[0]
                let file = new MessageAttachment(`${userMention.bannerURL({dynamic: true, size: 4096})}`).setName(`${fileName}`)
                let embed = new MessageEmbed()
                    .setTitle(`Here's the banner for ${userMention.tag}`)
                    .setDescription(`[Download](${file.url}) | [png](${userMention.bannerURL({dynamic:false, format:'png', size: 2048})}) | [gif](${userMention.bannerURL({dynamic:true, format:'gif', size: 2048})}) | [webp](${userMention.bannerURL({dynamic:false, format:'webp', size: 2048})}) | [jpeg](${userMention.bannerURL({dynamic:false, format:'jpeg', size: 2048})})`)
                    .setColor(`${col}`)
                    .setImage(`attachment://${fileName}`)
                    .setFooter({
                        text: `${message.author.tag}`
                    })
                    .setTimestamp();

                return message.channel.send({
                    files: [file],
                    embeds: [embed]
                });
            }
        }

        if (!args[0] || !userMention) {
            userMention = await client.users.fetch(message.author.id, {
                force: true
            }).catch(() => {})
            if (!userMention.bannerURL()) {
                return message.channel.send(`You do not have a banner image.`)
            }
            let col = message.member.displayHexColor || "#000000"
            const nomentionEmbed = new MessageEmbed()
                .setTitle(`Here's your banner ${message.author.username}`)
                .setDescription(`Download | [png](${userMention.bannerURL({dynamic:false, format:'png', size: 2048})}) | [gif](${userMention.bannerURL({dynamic:true, format:'gif', size:2048})}) | [webp](${userMention.bannerURL({dynamic:false, format:'webp', size:2048})}) | [jpeg](${userMention.bannerURL({dynamic:false, format:'jpeg', size: 2048})})`)
                .setColor(`${col}`)
                .setImage(`${userMention.bannerURL({dynamic:true, size:2048})}`)
                .setFooter({
                    text: `${message.author.tag}`
                })
                .setTimestamp();

            return message.channel.send({
                embeds: [nomentionEmbed]
            });
        } else {
            userMention = await client.users.fetch(userMention.id, {
                force: true
            }).catch(() => {})
            if (!userMention.bannerURL()) {
                return message.channel.send(`This user does not have a banner image.`)
            }
            const member = await message.guild.members.fetch(`${userMention.id}`).catch(() => {})
            let col = member.displayHexColor || "#000000"
            const mentionedEmbed = new MessageEmbed()
                .setTitle(`Here's the banner for ${userMention.tag}`)
                .setDescription(`Download | [png](${userMention.bannerURL({dynamic:false, format:'png', size: 2048})}) | [gif](${userMention.bannerURL({dynamic:true, format:'gif', size: 2048})}) | [webp](${userMention.bannerURL({dynamic:false, format:'webp', size: 2048})}) | [jpeg](${userMention.bannerURL({dynamic:false, format:'jpeg', size: 2048})})`)
                .setColor(`${col}`)
                .setImage(`${userMention.bannerURL({dynamic:true, size:2048})}`)
                .setFooter({
                    text: `${message.author.tag}`
                })
                .setTimestamp();

            return message.channel.send({
                embeds: [mentionedEmbed]
            });
        }
    }
}