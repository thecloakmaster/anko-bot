const fetch = require(`node-fetch`)
const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu
} = require(`discord.js`);
const ALinfo = require("../../functions/ALinfo.js");

async function aniQuery(anititle) {
    let returnData = null
    let query = `query ($search: String) {
    	Page(page: 1, perPage: 10) {
            media(search: $search type: ANIME) {
              title {
                romaji
                english
                native
                userPreferred
              }
              id
            }
    	}
    }`;
    let variables = {
        search: anititle
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
        returnData = data.data.Page.media
    }).catch(() => {});

    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }
    if (!returnData) {
        return null
    }
    return returnData
}

module.exports = {
    name: `anime`,
    description: `Finds information about the specified anime title from AniList.`,
    usage: `;anime <Anime Title>`,
    async execute(message, args) {
        if (!args.slice(0).join(" ")) {
            return message.channel.send(`Please enter a title for the command.\nSyntax: \`;anime <Anime title>\``)
        };
        let title = args.slice(0).join(" ");
        let retrun = await aniQuery(title);
        if (!retrun) {
            return message.channel.send(`No anime with that title was found.\nSyntax: \`;anime <Anime title>\``)
        }
        let options = []
        for (let i of retrun) {
            options.push({
                label: `${i.title.romaji.substring(0,100) || i.title.english.substring(0,100)}`,
                value: `${i.id}`
            })
        }
        if (options.length === 1) {
            await ALinfo.execute(retrun[0].id, null, message)
        } else if (options.length === 0) {
            return message.channel.send(`No manga with that specific title were to be found on AniList. Make sure you have typed the title correctly.`)
        } else if (options.length > 1) {
            const embed = new MessageEmbed()
                .setColor(`${process.env.colour}`)
                .setTitle(`Anime Search Results`)
                .setDescription(`These are ${options.length} results shown below for the AniList search for the title \`${args.slice(0).join(" ")}\`.\n Select any one of the options from the dropdown menu below to display the information.`)
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                    .setCustomId('select-anime')
                    .setPlaceholder('Select an anime from the following options.')
                    .setMaxValues(1)
                    .addOptions(options)
                );
            message.channel.send({
                embeds: [embed],
                components: [row]
            })
        }

    }
}