const WarnedMember = require('../../database/WarnedMember.js')

module.exports = {
    name: 'clearwarns',
    description: 'Clears all the warns of the specified user.',
    usage: ';clearwarns @mention\` or \`;clearwarns <user ID>',
    async execute(message, args, client) {
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        }
        if (!args[0]) {
            return message.channel.send(`Please specify a valid member or member ID to be warned.\nSyntax: \`;clearwarns @mention\` or \`;clearwarns <member ID>\`.`)
        }
        let memberWarn = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});
        if (!memberWarn) {
            return message.channel.send('Please specify a valid member or member ID to clear the warns for.\nSyntax: \`;clearwarns @mention\` or \`;clearwarns <member ID>\`.')
        }
        let warnList = await WarnedMember.find({
            MemberID: `${memberWarn.user.id}`,
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        if (warnList.length === 0) {
            return message.channel.send('This user has no warns.')
        } else if (warnList.length > 0) {
            await WarnedMember.deleteMany({
                MemberID: `${memberWarn.user.id}`,
                GuildID: `${message.guild.id}`,
                ClientID: `${client.user.id}`
            })
            return message.channel.send(`All the warns for this user have been cleared.`)
        }
    }
}
