const WarnedMember = require('../../database/WarnedMember.js')
const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: 'removewarn',
    description: 'Removes the specified warn of a specified user.',
    usage: ';removewarns @mention <Warn code>\` or \`;removewarns <user ID> <Warn code>',
    aliases: [`remwarn`, 'rw'],
    async execute(message, args, client) {
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        }
        if (!args[0]) {
            return message.channel.send(`Please specify a valid member or member ID to be warned.\nSyntax: \`;removewarns @mention <Warn code>\` or \`;removewarns <member ID> <Warn code>\`.`)
        }
        if (!args[1]) {
            return message.channel.send(`Please specify a valid warn-code. To select or find a warn code use \`;fetchwarns\`.`)
        }
        let memberWarn = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});
        if (!memberWarn) {
            return message.channel.send('Please specify a valid member or member ID to remove the warns for.\nSyntax: \`;removewarns @mention <Warn code>\` or \`;removewarns <member ID> <Warn code>\`.')
        }
        let warnList = await WarnedMember.find({
            MemberID: `${memberWarn.user.id}`,
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        if (warnList.length === 0) {
            return message.channel.send('This user has no warns.')
        } else if (warnList.length > 0) {
            let warnCodeCheck = await WarnedMember.findOne({
                MemberID: `${memberWarn.user.id}`,
                MessageID: `${args[1]}`,
                GuildID: `${message.guild.id}`,
                ClientID: `${client.user.id}`
            })
            if (!warnCodeCheck) {
                let warnEmbed = new MessageEmbed()
                    .setColor('#e4a353')
                    .setTitle(`List of warns for ${memberWarn.user.username}`)
                let amnt = 0
                warnList.forEach(warn => {
                    let timeAt = new Date(warn.registeredAt)
                    amnt += 1
                    warnEmbed.addField(`Warn number ${amnt}`, `**Warn Code:** [${warn.MessageID}]\n**Warned at:** ${timeAt.toLocaleString("en-US", {weekday: "long", day:"numeric", month: "long", year:"numeric", hour:"numeric", minute:"numeric", second:"numeric"})}\n**Reason: **${warn.WarnReason}`);
                })
                warnEmbed.addField(`Amount of warns`, `${amnt}`);
                return message.channel.send({
                    content: 'Please select a warn from one of the warns mentioned below and execute the command with the proper warn code again.\nSyntax: \`;removewarns @mention <Warn code>\` or \`;removewarns <user ID> <Warn code>\`',
                    embeds: [warnEmbed]
                })

            } else if (warnCodeCheck) {
                let timeAt = new Date(warnCodeCheck.registeredAt)
                let warnEmbed = new MessageEmbed()
                    .setColor('#e4a353')
                    .setTitle(`Warn removed successfully`)
                    .setDescription(`The following warn has been removed for <@!${memberWarn.user.id}>:\n**Warn Code:** [${warnCodeCheck.MessageID}]\n**Warned at:** ${timeAt.toLocaleString("en-US", {weekday: "long", day:"numeric", month: "long", year:"numeric", hour:"numeric", minute:"numeric", second:"numeric"})}\n**Reason:** ${warnCodeCheck.WarnReason} `)
                await WarnedMember.findOneAndDelete({
                    MemberID: `${memberWarn.user.id}`,
                    MessageID: `${args[1]}`,
                    GuildID: `${message.guild.id}`,
                    ClientID: `${client.user.id}`
                })
                return message.channel.send({
                    embeds: [warnEmbed]
                })
            }
        }
    }
}
