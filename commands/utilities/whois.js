const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: 'whois',
    description: `Gives information about the member specified or yourself.`,
    usage:';whois <mention a user or a user ID>',
    cooldown: 10000,
    async execute (message, args) {

        let memberImp = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});
        if (!args[0]) {
            memberImp = await message.guild.members.fetch(message.author.id)
        }
        if (!memberImp) {
            return message.channel.send(`Please enter a valid member or member ID. \nUse \`;help\` for more information and usage.`)
        };
        
        let memberRoles = memberImp.roles.cache
            .filter((roles) => roles.id !== message.guild.id)
            .map((role) => role.toString());

        let joinPos = null

        let arr2 = (await message.guild.members.fetch()).sort((a, b) => a.joinedAt - b.joinedAt)
        let arr = Array.from(arr2.values())
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].user.id === memberImp.user.id) {
                joinPos = i + 1
                
            };
        }

        let status = Math.round(memberImp.premiumSinceTimestamp/1000);

        if (status === 0) {
            status = "Not currently boosting the server"
        }

        let booStatus = `<t:${status}>\n<t:${status}:R>` 

        if (status === "Not currently boosting the server") {
            booStatus = status
        }

        let nick = memberImp.displayName;
        if (nick === memberImp.user.username) {
            nick = "None"
        }

        if (memberRoles.length === 0) {
            memberRoles = "No roles for this user."
        }
        const col = memberImp.displayHexColor || "#000000"
        const jTs = Math.round(memberImp.joinedTimestamp/1000)
        const cTs = Math.round(memberImp.user.createdTimestamp/1000)
        const whoEmbed = new MessageEmbed()
        .setAuthor({name: `${memberImp.user.tag}`, iconURL: `${memberImp.user.displayAvatarURL({dynamic:true})}`})
        .setThumbnail(`${memberImp.user.displayAvatarURL({dynamic:true})}`)
        .setDescription(`**User ID: ${memberImp.user.id}**`)
        .setColor(`${col}`)
        .addField(`Server Nickname`, `<@${memberImp.user.id}>`)
        .addField(`Created at`, `<t:${cTs}> <t:${cTs}:R>`)
        .addField(`Joined at`, `<t:${jTs}> <t:${jTs}:R>`, true)
        .addField(`Join position`, `${joinPos}`, true)
        .addField(`Roles`, `${memberRoles}`)
        .addField(`Server Boost Status`, `${booStatus}`)
        .setTimestamp();

        return message.channel.send({embeds:[whoEmbed]})

    }
}