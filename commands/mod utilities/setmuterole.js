const MuteRole = require(`../../database/MuteRole.js`)
module.exports = {
    name: `setmuterole`,
    description: `Sets the server's mute role.`,
    usage: `;setmuterole <Ping the mute role>`,
    async execute (message) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.`)
        }
        const Role = message.mentions.roles.first()
        if(!Role) {
            return message.channel.send(`Please specify a valid role from the server.`)
        }
        let mutedRole = await MuteRole.findOne({
            GuildID: message.guild.id
        });
        if (!mutedRole) {
            let newData = new MuteRole({
                GuildID: `${message.guild.id}`,
                MuteRoleID: `${Role.id}`
            })
            newData.save();
            return message.channel.send(`<@&${Role.id}> has been set as the muted role.`)
        } else if (mutedRole) {
            await MuteRole.findOneAndRemove({
                GuildID: `${message.guild.id}`
            })
            let newData = new MuteRole({
                GuildID: `${message.guild.id}`,
                MuteRoleID: `${Role.id}`
            })
            newData.save();
            return message.channel.send(`<@&${Role.id}> has been set as the muted role.`)
        }
    }
}