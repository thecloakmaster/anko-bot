const {
    MessageEmbed, MessageActionRow, MessageButton, MessageAttachment
} = require(`discord.js`)
const MFA = require(`mangadex-full-api`)

module.exports = {
    async execute(interaction, client) {
        let chapterNum = await interaction.fields.getTextInputValue(`chapterNumber`)
        let mangaID = interaction.message.embeds[0].footer.text.replace('ID: ', '')
        interaction.deferUpdate()
        MFA.login(`thecloakmaster`, `${process.env.MDpass}`).then(async () => {
            let manga = null
            let page = 0
            try {
                manga = await MFA.Manga.get(`${mangaID}`)
            } catch (err) {}
            if (!manga) {
                return
            } else if (manga) {
                const findChapter = async (targetManga, targetChap, offset = 0) => {
                    const chapters = await targetManga.getFeed({
                        translatedLanguage: ['en'],
                        order: {
                            publishAt: 'desc'
                        },
                        offset: offset,
                        limit: 100
                    });
                    if (chapters.length === 0) return null;
                    if (chapters.length === 1) return chapters[0]
                    for (const chap of chapters)
                        if (chap.chapter == targetChap && chap.isExternal === false) return chap;
                    return findChapter(targetManga, targetChap, offset + 100);
                }
                let chapter = await findChapter(manga, chapterNum)
                if (chapter && !chapter.isExternal) {
                    let pages = await chapter.getReadablePages();
                    if (!isNaN(page)) {
                        if (page > pages.length - 1 || page < 0) {
                            page = 0
                        }
                    }
                    if (chapter.chapter === null) {
                        chapterNum = 0
                    } else if (chapter.chapter) {
                        chapterNum = chapter.chapter
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
                    let chapterTitle = null
                    if (chapter.title) {
                        chapterTitle = chapter.title.replace(/\s/g, "_")
                        chapterTitle = chapterTitle.replace(/[’|!@`~&\/\\#,+()$~%'":*?<>{}‘]/g, "")
                    } else if (!chapter.title) {
                        if (manga.localizedTitle[mangaTitleLoc]) {
                            chapterTitle = manga.localizedTitle[mangaTitleLoc].replace(/\s/g, "_")
                            chapterTitle = chapterTitle.replace(/[’|!@`~&\/\\#,+()$~%'":*?<>{}‘]/g, "")
                        } else {
                            chapterTitle = ``
                        }
                    }
                    let mangaTitleLoc = manga.localizedTitle.availableLocales[0]
                    let mangaTitleReg = manga.localizedTitle[mangaTitleLoc]
                    mangaTitleReg = mangaTitleReg.replace(/\s/g, "_").replace(/[’|!@`~&\/\\#,+()$~%'":*?<>{}‘]/g, "")
                    const buttonList = [button1, button2, button3]
                    const row = new MessageActionRow().addComponents(buttonList);
                    let image = pages[page]
                    let file = new MessageAttachment(`${image}`).setName(`${mangaTitleReg}_${chapterTitle}_Ch_${chapterNum}_Page_${page+1}.png`)
                    let embed = new MessageEmbed()
                        .setAuthor({
                            name: `Chapter ${chapterNum}`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTitle(`${chapter.title}`)
                        .setFooter({
                            text: `Page ${page+1} of ${pages.length}`
                        })
                        .setColor(`#33FFBD`)
                        .setURL(`https://mangadex.org/chapter/${chapter.id}`)
                    let curPage = await interaction.editReply({
                        files: [file],
                        embeds: [embed.setImage(`attachment://${mangaTitleReg}_${chapterTitle}_Ch_${chapterNum}_Page_${page+1}.png`)],
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
                        if (i.user.id != interaction.member.user.id) return
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
                            .setName(`${mangaTitleReg}_${chapterTitle}_Ch_${chapterNum}_Page_${page+1}.png`)
                        await i.deferUpdate();
                        await i.editReply({
                            embeds: [embed
                                .setImage(`attachment://${mangaTitleReg}_${chapterTitle}_Ch_${chapterNum}_Page_${page+1}.png`)
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
                                components: [disabledRow]
                            }).catch((err) => {
                                return
                            });
                        } catch (err) {
                            console.log(err)
                        }
                    });
                } else if (!chapter) {
                    const findExtChapter = async (targetManga, targetChap, offset = 0) => {
                        const chapters = await targetManga.getFeed({
                            translatedLanguage: ['en'],
                            order: {
                                publishAt: 'desc'
                            },
                            offset: offset,
                            limit: 100
                        });
                        if (chapters.length === 0) return null;
                        if (chapters.length === 1) return chapters[0]
                        for (const chap of chapters)
                            if (chap.chapter == targetChap) return chap;
                        return findExtChapter(targetManga, targetChap, offset + 100);
                    }
                    chapter = findExtChapter(manga, chapterNum)
                    if (!chapter) {
                        return interaction.editReply({
                            content: `The chapter number you entered does not exist or is not available on MangaDex.`,
                            components: []
                        })
                    } else if (chapter) {
                        let mangaTitleLoc = manga.localizedTitle.availableLocales[0]
                        let mangaTitle = manga.localizedTitle[mangaTitleLoc]
                        let thumbnail = await MFA.Cover.get(manga.mainCover.id)
                        let mangaEmbed = new MessageEmbed()
                            .setImage(`${thumbnail.imageSource}`)
                            .setColor(`#33FFBD`)
                            .setTitle(`${mangaTitle}`)
                            .setDescription(`This chapter is not available on MangaDex. To read this chapter, follow this link: ${chapter.externalUrl}`)
                            .setURL(`https://mangadex.org/title/${manga.id}`)
                        return interaction.editReply({
                            embeds: [mangaEmbed],
                            components: []
                        })
                    }
                } else if (!chapter) {
                    
                }
            }
        })
    }
}