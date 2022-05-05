const MFA = require(`mangadex-full-api`)
const {MessageEmbed} = require(`discord.js`)
const mangaQuery = require (`../functions/mangaAniListQuery`)

module.exports = {
    async execute(mangaTitle, interaction, message) {
        MFA.login(`thecloakmaster`, `${process.env.MDpass}`).then(async () => {
            let manga = await MFA.Manga.get(`${mangaTitle}`)
            let mangaTitleOut = manga.localizedTitle[manga.localizedTitle.availableLocales[0]]
            let thumbnail = await MFA.Cover.get(manga.mainCover.id)
            let latestChp = await manga.getFeed({
                translatedLanguage: ['en'],
                order: {
                    chapter: 'desc'
                },
                limit: 1
            })
            let mangaEmbed = new MessageEmbed()
                .setColor("#33FFBD")
                .setThumbnail(`${thumbnail.image512}`)
                .setTitle(`${mangaTitleOut}`)
                .setDescription(`${manga.localizedDescription.en}\n\n**Status:** ${manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}`)
                .setURL(`https://mangadex.org/title/${manga.id}`)


            if (manga.publicationDemographic) {
                mangaEmbed.addField(`Demographic`, `${manga.publicationDemographic.charAt(0).toUpperCase() + manga.publicationDemographic.slice(1)}`, true)
            }
            if (manga.contentRating) {
                mangaEmbed.addField(`Content Rating`, `${manga.contentRating.charAt(0).toUpperCase() + manga.contentRating.slice(1)}`, true)
            }
            if (latestChp[0]) {
                if (!latestChp[0].chapter) {
                    mangaEmbed.addField(`Oneshot`, `Pain or no pain?`)
                } else if (latestChp[0].chapter) {
                    mangaEmbed.addField(`Latest chapter on MangaDex (in English)`, `${latestChp[0].chapter}`)
                }
            } else if (!latestChp[0]) {
                mangaEmbed.setFooter({
                    text: `There are no chapters for this manga on MangaDex.`
                })
            }
            if (manga.links.al) {
                let AniListID = parseInt(manga.links.al.replace("https://anilist.co/manga/", ""))
                if (typeof(AniListID) === "number") {
                    let queryReturned = await mangaQuery.execute(AniListID)
                    if (queryReturned) {
                        if (queryReturned.averageScore && queryReturned.meanScore) {
                            mangaEmbed.addField(`AniList Page`, `[Click here!](${manga.links.al})`, true)
                            mangaEmbed.addField(`AniList Average Score`, `${queryReturned.averageScore}`, true)
                        } else if (!queryReturned.averageScore && queryReturned.meanScore) {
                            mangaEmbed.addField(`AniList Page`, `[Click here!](${manga.links.al})`, true)
                            mangaEmbed.addField(`AniList Mean Score`, `${queryReturned.meanScore}`, true)
                        } else if (!queryReturned.averageScore && !queryReturned.meanScore){
                            mangaEmbed.addField(`AniList Page`, `[Click here!](${manga.links.al})`, true)
                        }
                        if (queryReturned.coverImage.color) {
                            mangaEmbed.setColor(`${queryReturned.coverImage.color}`)
                        }
                    }
                }
            }
            if (manga.links.mal) {
                mangaEmbed.addField(`MyAnimeList Page`, `[Click here!](${manga.links.mal})`, true)
            }
            if (manga.links.engtl) {
                mangaEmbed.addField(`Official English Translation`, `[Click here!](${manga.links.engtl})`, true)
            }
            if (!interaction) {
                return message.channel.send({
                    embeds: [mangaEmbed]
                })
            }
            await interaction.update({
                embeds: [mangaEmbed],
                components: []
            }).catch((err) => {
                console.log(err)
            })
        })
    }
}