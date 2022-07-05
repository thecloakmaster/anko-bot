const mangaSearch = require(`../functions/mangaSearch.js`);
const modalMangaReader = require(`../functions/modalMangaReader.js`);
const ALinfo = require("../../functions/ALinfo.js");

module.exports = {
    name: `interactionCreate`,
    async execute(interaction, client) {
        if (interaction.isSelectMenu()) {
            if (interaction.customId === `select-manga`) {
                mangaSearch.execute(interaction.values, interaction)
            } else if (interaction.customId === `select-anime`) {
                ALinfo.execute(interaction.values, interaction)
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === `chapterNumber`) {
                modalMangaReader.execute(interaction, client)
            }
        }
    }
}