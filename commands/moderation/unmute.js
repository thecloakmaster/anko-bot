const {MessageEmbed} = require("discord.js");
const MuteRole = require(`../../database/MuteRole`)
const MutedMember = require('../../database/MutedMember.js');
module.exports = {
    name:`unmute`,
    description: 'Unmutes the specified member.',
    usage: ";unmute @mention or ;unmute <member ID>",
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_ROLES") || !message.member.permissions.has("MODERATE_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_ROLES\` & \`MODERATE_MEMBERS\``)
        } else if (!bot.permissions.has("MANAGE_ROLES") || !bot.permissions.has("MODERATE_MEMBERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_ROLES\` & \`MODERATE_MEMBERS\``)
        };
        let muteRole = await MuteRole.findOne({
            GuildID: message.guild.id
        });
        if (!muteRole) {
            return message.channel.send(`No mute role has been provided. Setup a mute role with \`;setmuterole <Ping the mute role>\`.`)
        }
        let guildMuteRole = await message.guild.roles.fetch(`${muteRole.MuteRoleID}`).catch(() => {});
        if (!guildMuteRole) {
            return message.channel.send(`Could not find the provided mute role. Setup a mute role again with \`;setmuterole <Ping the mute role>\`.`)
        }
        if (!args) {
            return message.channel.send(`Please specify a valid member to be muted.\nSyntax: \`;mute @mention <Time>\``)
        }
        let memberMute = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});
        if (!memberMute) {
            return message.channel.send(`Please specify a valid member to be unmuted.\nSyntax: \`;unmute @mention <Time>\``)
        }
        if (memberMute.roles.highest.position > bot.roles.highest.position) {
            return message.channel.send(`I cannot unmute someone higher than me in the role hierarchy.`)
        } else if (memberMute.roles.highest.position > message.member.roles.highest.position) {
            return message.channel.send(`You cannot unmute someone higher than you in the role hierarchy.`)
        }
        if (!memberMute.roles.cache.some(role => role.id === muteRole.MuteRoleID) && !memberMute.isCommunicationDisabled()) {
            const alrMuted = new MessageEmbed()
                .setColor(`${process.env.colour}`)
                .setTitle(`Error executing command.`)
                .setDescription(`This member is already unmuted.`)
                .setTimestamp();

            return message.channel.send({
                embeds: [alrMuted]
            });
        } else if (memberMute.roles.cache.some(role => role.id === muteRole.MuteRoleID)){
            await memberMute.roles.remove(guildMuteRole.id)
            await MutedMember.findOneAndRemove({
                UserID: `${memberMute.user.id}`,
                GuildID: `${message.guild.id}`,
                ClientID: `${client.user.id}`
            })
            const unMute = new MessageEmbed()
            .setColor(`${process.env.colour}`)
            .setDescription(`<@!${memberMute.user.id}> has been unmuted`)
            .setTimestamp();
            message.channel.send({embeds: [unMute]})
        } else if (memberMute.isCommunicationDisabled()) {
            await memberMute.timeout(0, ` `).catch((err) => {
                message.channel.send(`Error unmuting this member`)
                return console.log(err)
            });
            const unMute = new MessageEmbed()
                .setColor(`${process.env.colour}`)
                .setDescription(`<@!${memberMute.user.id}> has been unmuted`)
                .setTimestamp();
            return message.channel.send({
                embeds: [unMute]
            })
        }
    }
}