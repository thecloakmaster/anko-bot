const WarnedMember = require('../../database/WarnedMember.js')
const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: 'fetchwarns',
    description: `Fetches the warns of a person.`,
    usage: `;fetchwarns @mention\` or \`;fetchwarns <member ID>`,
    aliases: [`fw`, `warnlist`, `warns`],
    async execute(message, args, client) {
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        }
        if (!args[0]) {
            return message.channel.send(`Please specify a valid member or member ID to be warned.\nSyntax: \`;fetchwarns @mention\` or \`;fetchwarns <member ID>\`.`)
        }
        let memberWarn = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});
        if (!memberWarn) {
            return message.channel.send('Please specify a valid member or member ID to fetch the warns for.\nSyntax: \`;fetchwarns @mention\` or \`;fetchwarns <member ID>\`.')
        }
        let warnList = await WarnedMember.find({
            MemberID: `${memberWarn.user.id}`,
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        if (warnList.length === 0) {
            return message.channel.send('This user has no warns.')
        } else if (warnList.length > 0) {
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
                embeds: [warnEmbed]
            })
        }
    }
}