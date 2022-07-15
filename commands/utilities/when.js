const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'when',
    description: 'The answer to next chapter/episode when?',
    usage: ';when <eng || en (For English chapters) || jp (For Japanese raws published in the magazine) || a || anime || episode || ep (For anime episodes)>',
    async execute(message, args, client) {
        let embed = new MessageEmbed()
            .setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({dynamic: true, size: 1024})}`})
            .setColor(`${process.env.colour}`)            

        if (!args[0]) {
            embed.addField('Chapters Translated To English', 'The next chapter will be released when the TL team is done with it. There is no specific schedule which is followed for the release of translated English chapters. The TL team appreciates your patience.')
            embed.addField('Japanese Raw Chapters', 'The Japanese raws release every Wednesday at 00:00 JST in the Shuukan Shounen Sunday.')
            embed.addField('Anime', 'The Japanese raws (episode without subtitles) release every Friday at 01:05 JST. The English subtitles usually release an hour later.')
        } else if (args[0] === 'eng' || args[0] === 'en') {
            embed.setTitle('No specific schedule is followed.')
            embed.setURL('https://mangadex.org/title/259dfd8a-f06a-4825-8fa6-a2dcd7274230/yofukashi-no-uta')
            embed.setDescription('The next chapter will be released when the TL team is done with it. There is no specific schedule which is followed for the release of translated English chapters. The TL team appreciates your patience.')                        
        } else if (args[0] === 'jp') {
            embed.setTitle('Wednesday at 00:00 JST')
            embed.setDescription('The Japanese raws release every Wednesday at 00:00 JST in the Shuukan Shounen Sunday.')
        } else if (args[0] === 'a' || args[0] === 'anime' || args[0] === 'episode' || args[0] === 'ep') {
            embed.setTitle('Raws release on Friday at 01:05 JST')
            embed.setDescription('The Japanese raws (episode without subtitles) release every Friday at 01:05 JST. The English subtitles usually release an hour later.')
        }
        return message.channel.send({embeds: [embed]})
    }
}