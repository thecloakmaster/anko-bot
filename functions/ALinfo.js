const fetch = require(`node-fetch`)
const {
    MessageEmbed
} = require(`discord.js`)

module.exports = {
    async execute(id, interaction, message) {
        if (interaction) await interaction.deferUpdate()
        let returnData = null
        let query = `query ($id: Int) {
            Media(id: $id type: ANIME) {
              title {
                romaji
                english
                native
                userPreferred
              }
              description
              season
              seasonYear
              status
              episodes
              siteUrl
              nextAiringEpisode {
                  airingAt
                  timeUntilAiring
                  episode
              }
              coverImage {
                  extraLarge
                  color
              }
              format
              averageScore
              meanScore
            }
        }`;
        let variables = {
            id: parseInt(id)
        };
        let accessToken = `${process.env.AniListToken}`
        let url = 'https://graphql.anilist.co'
        let options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };
        await fetch(url, options).then(handleResponse).then((data) => {
            returnData = data.data.Media
        }).catch(() => {});

        function handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
        }
        if (!returnData) {
            if (interaction) return interaction.editReply({
                embeds: [],
                components: [],
                content: `No results for the following selection.`
            })
            else if (!interaction) return message.channel.send(`No results for the following selection.`)
        } else if (returnData) {
            let embed = new MessageEmbed()
                .setTitle(`${returnData.title.romaji || returnData.title.english || returnData.title.native || returnData.title.userPreferred}`)
                .setDescription(`${returnData.description.replace(/<br>/g, "").replace(/<i>/g, "*").replace(/<\/i>/g, "*") || "No description found."}`)
                .setURL(`${returnData.siteUrl}`)
                .setFooter({
                    text: `Status: ${returnData.status.charAt(0) + returnData.status.slice(1).toLowerCase().replace(/_/g, " ")}`
                })
                .setThumbnail(`${returnData.coverImage.extraLarge}`)
                .setColor(`${returnData.coverImage.color || process.env.colour}`)
            if (returnData.averageScore && returnData.meanScore) {
                embed.addField(`AniList Average Score`, `${returnData.averageScore}`)
            } else if (!returnData.averageScore && returnData.meanScore) {
                embed.addField(`AniList Mean Score`, `${returnData.meanScore}`)
            }
            if (returnData.status) {
                embed.addField(`Status`, `${returnData.status.charAt(0) + returnData.status.slice(1).toLowerCase()}`, true)
            }
            if ((returnData.status === `FINISHED` || returnData.status === `CANCELLED`) && returnData.episodes) {
                embed.addField(`Total episodes`, `${returnData.episodes}`, true)
            }
            if (returnData.format) {
                if (returnData.format === `MOVIE`) {
                    embed.addField(`Format`, `${returnData.format.charAt(0) + returnData.format.slice(1).toLowerCase()}`, true)
                } else {
                    embed.addField(`Format`, `${returnData.format}`, true)
                }
            }
            if (returnData.nextAiringEpisode) {
                if (returnData.nextAiringEpisode.timeUntilAiring && returnData.nextAiringEpisode.episode) {
                    embed.addField(`Episode ${returnData.nextAiringEpisode.episode} airs:`, `<t:${Math.round(Date.now()/1000 + returnData.nextAiringEpisode.timeUntilAiring)}:R>`, true)
                } else if (returnData.nextAiringEpisode.timeUntilAiring && !returnData.nextAiringEpisode.episode) {
                    embed.addField(`The next episode airs in:`, `<t:${Math.round(Date.now()/1000 + returnData.nextAiringEpisode.timeUntilAiring)}:R>`, true)
                }
                if (returnData.nextAiringEpisode.airingAt) {
                    embed.addField(`Next episode airs at`, `<t:${returnData.nextAiringEpisode.airingAt}:F>`, true)
                }
            }
            if (returnData.season && returnData.seasonYear) {
                embed.addField(`Season`, `${returnData.season.charAt(0) + returnData.season.slice(1).toLowerCase()} ${returnData.seasonYear}`, true)
            }
            if (interaction) return interaction.editReply({
                embeds: [embed],
                components: []
            })
            else if (!interaction && message) return message.channel.send({
                embeds: [embed]
            })
        }
    }
}