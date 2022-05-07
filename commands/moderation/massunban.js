const {MessageEmbed} = require ('discord.js')

module.exports = {
    name: 'massunban',
    description: `Unbans the group of users specified.`,
    aliases: [`munban`],
    usage: `;massunban <User-ID(s)>`,
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        } else if (!bot.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        }
        if (!args[0]) {
            return message.channel.send(`Please specify valid user(s) or user-ID(s) to be banned.\nSyntax: \`;massunban <User-ID(s)>\`.`)
        }
        let i = 0
        let stringEmbed = ``
        for (let memberBan of args) {
            let userProp = await message.client.users.fetch(`${memberBan}`).catch(() => {})
            if (!userProp) {
                continue
            } else if (userProp) {
                try {
                    //If user is already unbanned
                    const banList = await message.guild.bans.fetch(userBan);
                    if (!banList) {
                        continue
                    }
                } catch (err) {}
                try {
                    await message.guild.members.unban(userProp).then(() => {
                        i += 1
                        stringEmbed += `\n**${i}.** <@!${userProp.id}>`
                    });
                } catch (err) {}
            }
        }
        if (i === 0) {
            message.channel.send(`No members/users were banned.\nSyntax: \`;massunban <User-ID(s)>\`.`)
        } else if (i >= 1) {
            let unbanSuccessEmbed = new MessageEmbed()
                .setColor("${process.env.colour}")
                .setTitle(`Massunban successful.`)
                .setDescription(`**${i}** user(s) have been unbanned from this server. The list of user(s) unbanned:${stringEmbed}`)
                .setTimestamp();

            return await message.channel.send({
                embeds: [unbanSuccessEmbed]
            })
        }
    }
}
