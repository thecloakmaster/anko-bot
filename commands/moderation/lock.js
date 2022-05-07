const {
    MessageEmbed
} = require('discord.js');

module.exports = {
        name: 'lock',
        description: 'Locks the channel.',
        usage: ";lock",
        async execute(message, args, client) {
            const bot = await message.guild.members.fetch(`${client.user.id}`)
            if (!message.member.permissions.has('MANAGE_ROLES')) {
                return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_ROLES\`.`)
            } else if (!bot.permissions.has('MANAGE_ROLES')) {
                return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_ROLES\`.`)
            }

            if(message.channel.permissionsFor(message.guild.id).has('SEND_MESSAGES') === false) {
                const lockError = new MessageEmbed()
                    .setColor("${process.env.colour}")
                    .setTitle(`Error executing that command`)
                    .setDescription(`This channel is already locked`)
                    .setTimestamp();
                return message.channel.send({
                    embeds: [lockError]
                });
            }

            try {
                message.channel.permissionOverwrites.edit(message.guild.id, {
                    SEND_MESSAGES: false
                });
                const lockEmbed = new MessageEmbed()
                .setColor("${process.env.colour}")
                .setDescription(`<#${message.channel.id}> has been locked`);
                return message.channel.send({embeds: [lockEmbed]})
            } catch (e) {
                console.log(e);
            }
        }
}