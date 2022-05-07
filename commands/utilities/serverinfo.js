const {MessageEmbed} = require('discord.js')

module.exports = {
    name: `serverinfo`,
    description: `Gives information about the server that the command is executed in.`,
    aliases: [`server`, `serverinf`],
    usage: `;serverinfo`,
    async execute(message) {
        let boostLevel = await message.guild.premiumTier
        if (boostLevel === `NONE`){
            boostLevel = `No boosts`
        } else if (boostLevel === `TIER_1`){
            boostLevel = `Level 1`
        } else if (boostLevel === `TIER_2`) {
            boostLevel = `Level 2`
        } else if (boostLevel === `TIER_3`) {
            boostLevel = `Level 3`
        }
        let cTs = Math.round(await message.guild.createdTimestamp / 1000)
        let channels = await message.guild.channels.fetch()
        const embed = new MessageEmbed()
            .setColor(`${process.env.colour}`)
            .setAuthor({name: `${await message.guild.name}`})
            .setTitle(`${await message.guild.name}`)
            .setDescription(`**Guild ID: ${await message.guild.id}**`)
            .addField(`Member Count`, `${message.guild.memberCount}`)
            .addField('Created At', `<t:${cTs}:F>`, true)
            .addField(`Owner`, `<@!${message.guild.ownerId}>\nID: ${message.guild.ownerId}`, true)
            .addField(`Verification Level`, `${message.guild.verificationLevel}`)
            .addField(`Server's Premium`, `Number of boosts: ${await message.guild.premiumSubscriptionCount}\nBoost Level: ${boostLevel}`,true)
            .addField(`Channels`, `Categories: ${channels.filter((c) => c.type === "GUILD_CATEGORY").size}\nText Channels: ${channels.filter((c) => c.type === "GUILD_TEXT").size}\nVoice Channels: ${channels.filter((c) => c.type === "GUILD_VOICE").size}`, true)
            .addField(`More Information`, `For more information about a server member or yourself, use the \`;whois\` command. The server banner/icon can also be accessed using \`;serverbanner\`/\`;servericon\`.`)
        if (!message.guild.bannerURL() && !message.guild.iconURL()) {
            await message.channel.send({embeds: [embed]})
        } else if (message.guild.bannerURL() && !message.guild.iconURL()) {
            await message.channel.send({embeds: [embed.setImage(`${await message.guild.bannerURL({dynamic: true, size: 1024})}`)]})
        } else if (!message.guild.bannerURL() && message.guild.iconURL()) {
            await message.channel.send({embeds: [embed.setThumbnail(`${await message.guild.iconURL({dynamic: true, size: 2048})}`).setAuthor({name: `${await message.guild.name}`, iconURL:`${await message.guild.iconURL({dynamic: true, size: 2048})}`})]})
        } else if (message.guild.bannerURL() && message.guild.iconURL()) {
            await message.channel.send({embeds: [embed.setThumbnail(`${await message.guild.iconURL({dynamic: true, size: 2048})}`).setImage(`${await message.guild.bannerURL({dynamic: true, size: 2048})}`).setAuthor({name: `${await message.guild.name}`, iconURL:`${await message.guild.iconURL({dynamic: true, size: 1024})}`})]})
        }
        
    }
}