const {
    MessageEmbed
} = require("discord.js")
const Match = require(`../../database/Match.js`)

module.exports = {
    name: `match`,
    description: `Matches two users and finds their compatibility rating.`,
    usage: `;match <@Mention User>`,
    cooldown: 3000,
    async execute(message, args, client) {
        let commandUser = await message.author.id
        let matchedUser = await message.mentions.users.first()
        matchedUser = matchedUser.id
        if (matchedUser === commandUser) {
            return message.channel.send(`You cannot find the compatibility rating of you to yourself.`)
        }
        let col = message.member.displayHexColor || "#000000"
        let matchInt
        let embed = new MessageEmbed()
            .setAuthor({
                name: `${message.author.username}`,
                iconURL: `${message.author.displayAvatarURL()}`
            })
            .setColor(`${col}`)
        let matchFind = await Match.findOne({
            Members: [`${commandUser}`, `${matchedUser}`],
            ClientID: `${client.user.id}`
        })
        if (!matchFind) {
            let matchFind2 = await Match.findOne({
                Members: [`${matchedUser}`, `${commandUser}`],
                ClientID: `${client.user.id}`
            })
            if (!matchFind2) {
                matchInt = Math.floor(Math.random() * 101);
                if (commandUser == `423792631458562058` && matchedUser == `${client.user.id}`) {
                    matchInt = 100
                }
                let newData = new Match({
                    Members: [`${commandUser}`, `${matchedUser}`],
                    Match: matchInt,
                    ClientID: `${client.user.id}`
                })
                newData.save()
                embed.setDescription(`The compatibility rating of <@${commandUser}> and <@${matchedUser}> is **${matchInt}%**.`)
            } else if (matchFind2) {
                matchInt = matchFind2.Match
                embed.setDescription(`The compatibility rating of <@${commandUser}> and <@${matchedUser}> is **${matchInt}%**.`)
            }
        } else if (matchFind) {
            matchInt = matchFind.Match
            embed.setDescription(`The compatibility rating of <@${commandUser}> and <@${matchedUser}> is **${matchInt}%**.`)
        }
        if (matchInt <= 40) {
            return message.channel.send({
                content: `<:NazunaSadge:941019849403039795>`,
                embeds: [embed]
            })
        } else if (matchInt > 40 && matchInt <= 60) {
            return message.channel.send({
                content: `<:KouBlank:949915494159372339>`,
                embeds: [embed]
            })
        } else if (matchInt > 60 && matchInt <= 85) {
            return message.channel.send({
                content: `<:NazunaFlushed:948835663212593152>`,
                embeds: [embed]
            })
        } else if (matchInt > 85 && matchInt <= 99) {
            return message.channel.send({
                content: `<:NazunaKiss:933269636206690364>`,
                embeds: [embed]
            })
        } else if (matchInt == 100) {
            message.channel.send({
                content: `<:NazunaKiss:933269636206690364> <:NazunaKiss:933269636206690364> <:NazunaKiss:933269636206690364> <:NazunaKiss:933269636206690364> <:NazunaKiss:933269636206690364>`,
                embeds: [embed]
            })
            return message.channel.send(`Lets get married tonight!`)
        }
    }
}