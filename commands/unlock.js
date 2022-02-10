const {
    MessageEmbed,
    Guild,
    Message
} = require('discord.js');

module.exports = {
    name: 'unlock',
    description: 'Unlocks the channel.',
    usage: ";unlock",
    async execute(message, args) {
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            const permerror = new MessageEmbed()
                .setColor("#c4b29c")
                .setTitle(`Error executing that command`)
                .setDescription(`You do not have the necessary permissions to execute this command`)
                .setTimestamp();
            return message.channel.send({
                embeds: [permerror]
            });
        }

        if (message.channel.permissionsFor(message.guild.id).has('SEND_MESSAGES') === true) {
            const lockError = new MessageEmbed()
                .setColor("#c4b29c")
                .setTitle(`Error executing that command`)
                .setDescription(`This channel is already unlocked`)
                .setTimestamp();
            return message.channel.send({
                embeds: [lockError]
            });
        }

        try {
            message.channel.permissionOverwrites.edit(message.guild.id, {
                SEND_MESSAGES: true
            });
            const lockEmbed = new MessageEmbed()
                .setColor("#c4b29c")
                .setDescription(`<#${message.channel.id}> has been unlocked`);
            return message.channel.send({
                embeds: [lockEmbed]
            })
        } catch (e) {
            console.log(e);
        }
    }
}