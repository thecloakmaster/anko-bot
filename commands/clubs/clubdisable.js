const ClubList = require(`../../database/ClubLists.js`)

module.exports = {
    name: `clubdisable`,
    description: `Disables the club system in the server.`,
    usage: `;clubdisable`,
    aliases: [`cdisable`],
    async execute (message, args, client) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`ADMINISTRATOR\`.`)
        }
        let guildClubList = await ClubList.findOne({
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        if (guildClubList) {
            if (guildClubList.ClubEnabled) {
                await ClubList.findOneAndUpdate({
                    GuildID: `${message.guild.id}`,
                    ClientID: `${client.user.id}`
                }, {
                    ClubEnabled: false
                })
                return message.channel.send(`The system for clubs has been disabled in this server.`)
            } else if (!guildClubList.ClubEnabled) {
                return message.channel.send(`The system for clubs is already disabled in this server.`)
            }
        } else if (!guildClubList) {
            return message.channel.send(`The system for clubs is already disabled in this server.`)
        }
    }
}