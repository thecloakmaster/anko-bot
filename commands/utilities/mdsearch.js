const MFA = require(`mangadex-full-api`)
const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require (`discord.js`)
const mangaSearch = require(`../../functions/mangaSearch`)

module.exports = {
    name: `mdsearch`,
    description:`Fetches a maximum of 10 series from MangaDex by their title and shows the information about them.`,
    usage: `;mdsearch <Title of the series>`,
    cooldown: 5000,
    async execute(message, args) {
        if (!args.slice(0).join(" ")) {
            return message.channel.send(`Please specify a title of a series.\nSyntax: \`;mdsearch <Title of the series>\``)
        }
        let manga = null
        MFA.login(`thecloakmaster`, `${process.env.MDpass}`).then(async () => {
            let options = []
            try {
                let mangas = await MFA.Manga.search(`${args.slice(0).join(" ")}`)
                for (let i of mangas) {
                    options.push({label: `${i.localizedTitle[i.localizedTitle.availableLocales[0]].substring(0,100)}`, value: `${i.id}`})
                }
            } catch (err) {
                console.log(err)
                return message.channel.send(`No series with that specific title was found on MangaDex. Make sure you have typed the title correctly.\nSyntax: \`;mdsearch <Title of the series>\``)
            }
            if (options.length === 1) {
                let interaction = null
                manga = await MFA.Manga.getByQuery(`${args.slice(0).join(" ")}`)
                return mangaSearch.execute(manga.id, interaction, message)
            } else if (options.length === 0) {
                return message.channel.send(`No series with that specific title was found on MangaDex. Make sure you have typed the title correctly.\nSyntax: \`;mdsearch <Title of the series>\``)
            } else if (options.length > 1) {
                const embed = new MessageEmbed()
                    .setColor("#33FFBD")
                    .setTitle(`Manga Search Results`)
                    .setDescription(`These are ${options.length} results shown below for the MangaDex search for the title \`${args.slice(0).join(" ")}\`.\n Select any one of the options from the dropdown menu below to display the information.`)
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                        .setCustomId('select-manga')
                        .setPlaceholder('Select a manga from the following options.')
                        .setMaxValues(1)
                        .addOptions(options)
                    );
                message.channel.send({
                    embeds: [embed],
                    components: [row]
                })
            }
        })
    }
}