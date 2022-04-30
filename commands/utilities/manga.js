const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require(`discord.js`)
const MFA = require(`mangadex-full-api`)

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
            return message.channel.send(`Please enter a valid chapter number.`)
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
                if (i.chapter === `${chp_no}` && i.groups[0].id == '063cf1b0-9e25-495b-b234-296579a34496') {
                    chapter = i
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
            chapterTitle = chapterTitle.replace(/[’|!@`~&\/\\#,+()$~%'":*?<>{}‘]/g, "")
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
                .setTitle(`${chapter.title}`)
                .setFooter({
                    text: `Page ${page+1} of ${pages.length}`
                })
                .setColor(`#e4a353`)
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
                        embeds: [embed],
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
