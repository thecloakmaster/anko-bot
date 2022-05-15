const mangaSearch = require(`../functions/mangaSearch`)
const modalMangaReader = require(`../functions/modalMangaReader`)

module.exports = {
    name: `interactionCreate`,
    async execute(interaction, client) {
        if (interaction.isSelectMenu()) {
            if (interaction.customId === `select-manga`) {
                mangaSearch.execute(interaction.values, interaction)
            } 
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === `chapterNumber`) {
                modalMangaReader.execute(interaction)
            }
        }
    }
}