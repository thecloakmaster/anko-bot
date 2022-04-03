const WarnedMember = require('../../database/WarnedMember.js')
const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: 'warn',
    description: 'Warns a member.',
    usage: ';warn @mention <Reason>\` or \`;warn <member ID> <Reason> (the reason can be blank)',
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        }
        if (!args[0]) {
            return message.channel.send(`Please specify a valid member or member ID to be warned.\nSyntax: \`;warn @mention <Reason>\` or \`;warn <member ID> <Reason>\`.`)
        }
        let memberWarn = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});
        if (!memberWarn) {
            return message.channel.send('Please specify a valid member or member ID to be warned.\nSyntax: \`;warn @mention <Reason>\` or \`;warn <member ID> <Reason>\`.')
        }
        if (memberWarn.roles.highest.position > bot.roles.highest.position) {
            return message.channel.send(`I cannot warn someone higher than me in the role hierarchy.`)
        } else if (memberWarn.roles.highest.position > message.member.roles.highest.position) {
            return message.channel.send(`You cannot warn someone higher than you in the role hierarchy.`)
        } else if (memberWarn.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`You cannot warn this member as they also have the \`BAN_MEMBERS\` permission.`)
        }
        let reason = args.slice(1).join(" ") || "No reason given."
        let warnAmount = await WarnedMember.find({
            MemberID: `${memberWarn.user.id}`,
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        let desc = `<@!${memberWarn.user.id}> has been warned for: ${reason}`
        if (warnAmount.length === 0) {
            if (!args[1]) {
                desc = `<@!${memberWarn.user.id}> has been warned.`
            } else if (args[1]) {
                desc = `<@!${memberWarn.user.id}> has been warned for ${reason}.`
            }
        } else if (warnAmount.length > 0) {
            if (!args[1]) {
                desc = `<@!${memberWarn.user.id}> has been warned.\nThey now have ${warnAmount.length + 1} warn on their account.`
            } else if (args[1]) {
                desc = `<@!${memberWarn.user.id}> has been warned for ${reason}.\nThey now have ${warnAmount.length + 1} warn on their account.`
            }

        }
        let warnEmbed = new MessageEmbed()
            .setColor('#e4a353')
            .setDescription(`${desc}`)
            .setTimestamp();
        let memberMessage = new MessageEmbed()
            .setColor('#e4a353')
            .setDescription(`You were warned in ${message.guild.name}.`)
            .addField(`Reason`, `${reason}`)
            .setTimestamp();

        try {
            let newData = new WarnedMember({
                MemberID: `${memberWarn.user.id}`,
                WarnReason: `${reason}`,
                MessageID: `${message.id}`,
                GuildID: `${message.guild.id}`,
                ClientID: `${client.user.id}`
            });
            newData.save();
            message.channel.send({
                embeds: [warnEmbed]
            })
            return memberWarn.send({
                embeds: [memberMessage]
            }).catch(() => {})
        } catch (err) {}
    }
}