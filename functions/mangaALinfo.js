const fetch = require(`node-fetch`);
const { MessageEmbed } = require(`discord.js`);

module.exports = {
    async execute(id, interaction, message) {
        if (interaction) await interaction.deferUpdate()
        let returnData = null
        let query = `query ($id: Int) {
            Media(id: $id type: MANGA) {
                title {
                  romaji
                  english
                  native
                  userPreferred
                }
                coverImage {
                  extraLarge
                  color
                }
                startDate {
                  year
                  month
                  day
                }
                endDate {
                  year
                  month
                  day
                }
                description
                chapters
                volumes
                status
                siteUrl                     
                format
                averageScore
                meanScore                                
            }
        }`;
        let variables = {
            id: parseInt(id[0])
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
            if (interaction) return await interaction.editReply({
                embeds: [],
                components: [],
                content: `No results for the following selection.`
            })
            else if (!interaction) return message.channel.send(`No results for the following selection.`)
        } else if (returnData) {
            let embed = new MessageEmbed()
                .setColor(`${returnData.coverImage.color || process.env.colour}`)
                .setTitle(`${returnData.title.romaji || returnData.title.english || returnData.title.native || returnData.title.userPreferred}`)
                .setDescription(`${returnData.description.replace(/<br>/g, "").replace(/<i>/g, "*").replace(/<\/i>/g, "*").replace(/<b>/g, "**").replace(/<\/b>/g, "**").replace(/<i\/>/g, "*") || "No description found."}`)
                .setURL(`${returnData.siteUrl}`)
                .setFooter({text: `Data taken from AniList`})
                .setThumbnail(`${returnData.coverImage.extraLarge}`);
            if (returnData.averageScore && returnData.meanScore) {
                embed.addField(`Average Score`, `${returnData.averageScore}`, true)
            } else if (!returnData.averageScore && returnData.meanScore) {
                embed.addField(`Mean Score`, `${returnData.meanScore}`, true)
            }

            if (returnData.format) {
                embed.addField(`Format`, `${returnData.format.charAt(0) + returnData.format.slice(1).toLowerCase()}`, true)
            }
            if (returnData.status) {
                embed.addField(`Status`, `${returnData.status.charAt(0) + returnData.status.slice(1).toLowerCase()}`, true)
            }

            if (returnData.status === `FINISHED` || returnData.status === `CANCELLED`) {
                if (returnData.volumes) embed.addField(`Volumes`, `${returnData.volumes}`, true)
                if (returnData.chapters) embed.addField(`Chapters`, `${returnData.chapters}`, true)
                if (returnData.startDate) embed.addField('Start Date (DD-MM-YYYY)', `${returnData.startDate.day.toString() || ""}-${returnData.startDate.month.toString() || ""}-${returnData.startDate.year.toString() || ""}`, true)
                if (returnData.endDate) embed.addField('End Date (DD-MM-YYYY)', `${returnData.endDate.day.toString() || ""}-${returnData.endDate.month.toString() || ""}-${returnData.endDate.year.toString() || ""}`, true)
            } else {
                if (returnData.startDate) embed.addField('Start Date (DD-MM-YYYY)', `${returnData.startDate.day.toString() || ""}-${returnData.startDate.month.toString() || ""}-${returnData.startDate.year.toString() || ""}`, true)
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