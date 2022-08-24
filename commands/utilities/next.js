const { MessageEmbed } = require("discord.js")
const animeAniListQuery = require (`../../functions/animeAniListQuery`)

module.exports = {
    name:'nextep',
    description: `Tells you the status and airing time of the next episode of the specified anime.`,
    usage: `;nextep <Anime title>`,
    aliases: [`next`],
    async execute (message, args) {
        if (!args.slice(0).join(" ")) {
            return message.channel.send(`Please enter a title for the command.\nSyntax: \`;nextep <Anime title>\``)
        }
        let anilistID = args.slice(0).join(" ")
        let list = await animeAniListQuery.execute(anilistID)
        if (!list) {
            return message.channel.send(`No anime with the specified name was to be found. Please check if you have entered the title correctly.\nSyntax: \`;nextep <Anime title>\``)
        }
        let embed = new MessageEmbed()
            .setTitle(`${list.title.romaji || list.title.english || list.title.native || list.title.userPreferred}`)
            .setURL(`${list.siteUrl}`)
            .setFooter({text: `Status: ${list.status.charAt(0) + list.status.slice(1).toLowerCase().replace(/_/g, " ")}`})
            .setThumbnail(`${list.coverImage.extraLarge}`)
            .setColor(`${list.coverImage.color || process.env.colour}`)
        if (list.nextAiringEpisode) {
            if (list.nextAiringEpisode.timeUntilAiring && list.nextAiringEpisode.episode) {
                embed.addField(`Episode ${list.nextAiringEpisode.episode} airs:`,`<t:${Math.round(Date.now()/1000 + list.nextAiringEpisode.timeUntilAiring)}:R>`)
            }else if (list.nextAiringEpisode.timeUntilAiring && !list.nextAiringEpisode.episode) {
                embed.addField(`The next episode airs in:`, `<t:${Math.round(Date.now()/1000 + list.nextAiringEpisode.timeUntilAiring)}:R>`)
            }
            if (list.nextAiringEpisode.airingAt) {
                embed.addField(`Next episode airs at`, `<t:${list.nextAiringEpisode.airingAt}:F>`, true)
            }
        }
        if ((list.status === `FINISHED` || list.status === `CANCELLED`) && list.episodes) {
            embed.addField(`Total episodes`, `${list.episodes}`, true)
        }
        if (list.season && list.seasonYear) {
            embed.addField(`Season`, `${list.season.charAt(0) + list.season.slice(1).toLowerCase()} ${list.seasonYear}`, true)
        }
        return message.channel.send({embeds: [embed]})
    }
}