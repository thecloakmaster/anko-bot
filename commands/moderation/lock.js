const {
    MessageEmbed
} = require('discord.js');

module.exports = {
        name: 'lock',
        description: 'Locks the channel.',
        usage: ";lock",
        async execute(message, args) {
            if (!message.member.permissions.has('MANAGE_ROLES')) {
                const permerror = new MessageEmbed()
                    .setColor("#e4a353")
                    .setTitle(`Error executing that command`)
                    .setDescription(`You do not have the necessary permissions to execute this command`)
                    .setTimestamp();
                return message.channel.send({
                    embeds: [permerror]
                });
            }

            if(message.channel.permissionsFor(message.guild.id).has('SEND_MESSAGES') === false) {
                const lockError = new MessageEmbed()
                    .setColor("#e4a353")
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
                .setColor("#e4a353")
                .setDescription(`<#${message.channel.id}> has been locked`);
                return message.channel.send({embeds: [lockEmbed]})
            } catch (e) {
                console.log(e);
            }
        }
}