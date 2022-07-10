const {MessageEmbed} = require(`discord.js`)
module.exports = {
    name: 'uwuify',
    description: `Makes your message more UwU.`,
    aliases: [`uwu`, `owo`, `owoify`],
    usage: `;uwuify <Message content>`,
    async execute(message, args) {
        message.delete()
        let content = args.slice(0).join(" ")
        const repFirst = content.replace(/r|l/gi, "w")
        const repSecond = repFirst.replace(/R|L/gi, "W")
        let col = message.member.displayHexColor || "#000000"
        const owo = new MessageEmbed()
        .setColor(`${col}`)
        .setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL()})
        .setDescription(`${repSecond}`)
        return message.channel.send({embeds: [owo]})
    }
}