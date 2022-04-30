const mangaSearch = require(`../functions/mangaSearch`)

module.exports = {
    name: `interactionCreate`,
    async execute(interaction, client) {
        if (interaction.isSelectMenu()) {
            if (interaction.customId === `select-manga`) {
                mangaSearch.execute(interaction.values, interaction)
            }
        }
    }
}