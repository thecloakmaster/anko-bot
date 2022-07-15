const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'when',
    description: 'The answer to next chapter when?',
    usage: ';when',
    async execute(message, args, client) {
        let embed = new MessageEmbed()
            .setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({dynamic: true, size: 1024})}`})
            .setColor(`${process.env.colour}`)            

        if (!args || args[0] === 'eng') {
            embed.setDescription('The next chapter will be released when the TL team is done with it. There is no specific schedule which is followed for the release of translated English chapters. The TL team appreciates your patience.')            
        } else if (args[0] === 'jp') {
            embed.setDescription('The Japanese raws release every Wednesday at 00:00 JST.')
        } else if (args[0] === 'a' || args[0] === 'anime') {
            embed.setDescription('The Japanese raws (episode without subtitles) release every Friday at 01:05 JST. The English subtitles usually release an hour later.')
        }
        return message.channel.send({embeds: [embed]})
    }
}