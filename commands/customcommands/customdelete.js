const CustomCommands = require('../../database/CustomCommands.js');

module.exports = {
    name: 'customdelete',
    aliases: ['deletecustom', 'customdel'],
    usage: ';customdelete <Custom command name>',
    description: 'Deletes a custom command.',
    async execute(message, args, client) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send('You do not have the permission to execute this command.\nPermissions required: \`ADMINISTRATOR\`');
        }
        if (!args) {
            return message.channel.send('Please provide valid arguments.')
        }
        let commandName = args[0].toLowerCase();
        let commandCheck = await CustomCommands.findOne({
            CustomCommand: commandName,
            ClientID: `${client.user.id}`,
            GuildID: `${message.guild.id}`
        })
        if (!commandCheck) {
            return message.channel.send('A custom command of this name does not exist.\nSyntax: \`;customdelete <Custom command name>\`')
        } else if (commandCheck) {
            await CustomCommands.findOneAndDelete({
                CustomCommand: commandName,
                ClientID: `${client.user.id}`,
                GuildID: `${message.guild.id}`
            })
            return message.channel.send(`The command with the name \`${commandName}\` was successfully deleted.`)
        }
    }
}