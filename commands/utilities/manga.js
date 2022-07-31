const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require(`discord.js`)
const MFA = require(`mangadex-full-api`)
const mangaALinfo = require('../../functions/mangaALinfo.js')

async function mangaSearch(mangaTitle) {
    let returnData = null
    let query = `query ($search: String) {
    	Page(page: 1, perPage: 10) {
            media(search: $search type: MANGA) {
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
        search: mangaTitle
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
    name: `manga`,
    description: `Grabs the requested chapter of Yofukashi no Uta from MangaDex and sends it in the chat.`,
    usage: `;manga <Chapter number> <Page number (optional)>`,
    cooldown: 5000,
    async execute(message, args, client) {
        let chp_no = args[0]
        if (!args[0]) {
            chp_no = 1
        } else if (isNaN(args[0])) {
            let mangaTitle = args.join(" ");
            let retrun = await mangaSearch(mangaTitle);
            if (!retrun) {
                return message.channel.send(`No manga with the title ${mangaTitle} was found on AniList.`);
            }
            let options = []
            for (let i of retrun) {
                options.push({
                    label: `${i.title.romaji.substring(0,100) || i.title.english.substring(0,100)}`,
                    value: `${i.id}`
                })
            }
            if (options.length === 1) {
                return await mangaALinfo.execute(retrun[0].id, null, message)
            } else if (options.length === 0) {
                return message.channel.send(`No manga with the title ${mangaTitle} was found on AniList.`);
            } else if (options.length > 1) {
                const embed = new MessageEmbed()
                    .setColor(`${process.env.colour}`)
                    .setTitle(`Manga Search Results`)
                    .setDescription(`These are ${options.length} results shown below for the AniList search for the title \`${mangaTitle}\`.\n Select any one of the options from the dropdown menu below to display the information.`)
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                        .setCustomId('select-manga-al')
                        .setPlaceholder('Select a manga from the following options.')
                        .setMaxValues(1)
                        .addOptions(options)
                    );
                return message.channel.send({
                    embeds: [embed],
                    components: [row]
                })
            }
        }
        MFA.login(`thecloakmaster`, `${process.env.MDpass}`).then(async () => {
            let manga = await MFA.Manga.getByQuery('Yofukashi no Uta');
            let chapters = await manga.getFeed({
                translatedLanguage: ['en'],
                order: {
                    chapter: 'asc'
                },
                limit: Infinity
            }, true);
            let chapter = null
            for (let i of chapters) {
                if (i.groups[0]) {
                    if (i.chapter === `${chp_no}` && i.groups[0].id == '063cf1b0-9e25-495b-b234-296579a34496') {
                        chapter = i
                    }
                }
            }
            if (!chapter) {
                for (let i of chapters) {
                    if (i.chapter === `${chp_no}`) {
                        chapter = i
                    }
                }
            }
            if (!chapter) return message.channel.send(`Chapter not found.\nSyntax: \`;manga <Chapter number> <Page number (optional)>\``)
            let pages = await chapter.getReadablePages();
            let page = 0
            if (args[1]) {
                if (!isNaN(args[1])) {
                    if (args[1] < pages.length) {
                        page = args[1] - 1
                    }
                }
            }
            const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('<')
                .setStyle('SECONDARY');

            const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('>')
                .setStyle('SECONDARY');

            const button3 = new MessageButton()
                .setCustomId('close')
                .setLabel('Close')
                .setStyle('DANGER')

            let chapterTitle = chapter.title.replace(/\s/g, "_")
            chapterTitle = chapterTitle.replace(/[’|!@`~&\/\\#,+()$~%'":*?<>{}\[\]‘]/g, "")
            const buttonList = [button1, button2, button3]
            const row = new MessageActionRow().addComponents(buttonList);
            let image = pages[page]
            let file = new MessageAttachment(`${image}`)
                .setName(`Yofukashi_no_Uta_${chapterTitle}_Ch_${chapter.chapter}_Page_${page+1}.png`);
            let embed = new MessageEmbed()
                .setAuthor({
                    name: `Chapter ${chapter.chapter}`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle(`${chapter.title || manga.localizedTitle[manga.localizedTitle.availableLocales[0]]}`)
                .setFooter({
                    text: `Page ${page+1} of ${pages.length}`
                })
                .setColor(`${process.env.colour}`)
                .setURL(`https://mangadex.org/chapter/${chapter.id}`);
            let curPage = await message.channel.send({
                files: [file],
                embeds: [embed.setImage(`attachment://Yofukashi_no_Uta_${chapterTitle}_Ch_${chapter.chapter}_Page_${page+1}.png`)],
                components: [row],
            });
            const filter = (i) =>
                i.customId === buttonList[0].customId ||
                i.customId === buttonList[1].customId ||
                i.customId === buttonList[2].customId;

            const collector = await curPage.createMessageComponentCollector({
                filter,
                time: 60000,
            });
            collector.on("collect", async (i) => {
                if (i.user.id != message.author.id) return
                switch (i.customId) {
                    case buttonList[0].customId:
                        page -= 1;
                        if (page < 0) {
                            page = 0
                            break
                        }
                        break;
                    case buttonList[1].customId:
                        page += 1;
                        if (page >= pages.length) {
                            page = page - 1
                            break
                        }
                        break;
                    default:
                        break;
                }
                if (i.customId === buttonList[2].customId) {
                    collector.stop();
                }
                file = new MessageAttachment(`${pages[page]}`)
                    .setName(`Yofukashi_no_Uta_${chapterTitle}_Ch_${chapter.chapter}_Page_${page+1}.png`);
                await i.deferUpdate();
                await i.editReply({
                    embeds: [embed
                        .setImage(`attachment://Yofukashi_no_Uta_${chapterTitle}_Ch_${chapter.chapter}_Page_${page+1}.png`)
                        .setFooter({
                            text: `Page ${page+1} of ${pages.length}`
                        })
                    ],
                    components: [row],
                    files: [file],
                });
                collector.resetTimer();
            });
            collector.on("end", () => {
                try {
                    let disabledRow = new MessageActionRow().addComponents(
                        buttonList[0].setDisabled(true),
                        buttonList[1].setDisabled(true),
                        buttonList[2].setDisabled(true).setLabel('Closed')
                    );
                    curPage.edit({
                        components: [disabledRow],
                    }).catch((err) => {
                        return
                    });
                } catch (err) {
                    console.log(err.code)
                }
            });
        }).catch((err) => {
            console.log(err)
        })

    }
}
