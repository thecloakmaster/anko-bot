const MDsearch = require(`../functions/MDsearchResults`)

module.exports = {
    name: `interactionCreate`,
    async execute(interaction, client) {
        if (interaction.isSelectMenu()) {
            if (interaction.customId === `select-manga`) {
                MDsearch.execute(interaction.values, interaction)
            }
        }
    }
}