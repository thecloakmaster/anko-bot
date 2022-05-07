const Discord = require ('discord.js')
module.exports = {
    name: `guildMemberAdd`,
    async execute(member, client) {
        if (member.user.bot === true) return;
        const welcomeEmbed = new Discord.MessageEmbed()
            .setColor("${process.env.colour}")
            .setTitle(`Welcome to Yofukashi no Uta!`)
            .setDescription(`Be sure to check out <#908021113504825358> and <#908021113504825361> before you start chatting. Enjoy your stay here!`)
            .setImage(`https://images-ext-1.discordapp.net/external/c5ZtuDzOH1WQlK-1YTGBEvxffw2PhCuWKb77dYjIcYY/https/media.discordapp.net/attachments/912098426924183602/920996161878392882/N47QgJE.gif`)
            .setFooter({
                text: `There are currently ${member.guild.memberCount} vampires here.`
            })

        const channel = await member.guild.channels.fetch('908021113886482434')
        channel.send({
            content: `Welcome to the server <@${member.user.id}>!`,
            embeds: [welcomeEmbed]
        }).catch(() => {})
    }
}