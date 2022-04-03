const {MessageEmbed} = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'Bans the specified user.',
    usage: ";ban @mention <Reason>\` or \`;ban <user ID> <Reason> (the reason can be blank)",
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        } else if (!bot.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        }
        if (!args[0]) {
            return message.channel.send(`Please specify a valid user or user-ID to be banned.\nSyntax: \`;ban @Mention <Reason>\` or \`;ban <User-ID> <Reason>\`.`)
        }
        let userBan = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => {});
        if (!userBan) {
            return message.channel.send("Please specify a valid user or user-ID to be banned.\nSyntax: \`;ban @Mention <Reason>\` or \`;ban <User-ID> <Reason>\`.")
        }
        let reason = args.slice(1).join(" ") || "No reason given";
        let memberBan = await message.guild.members.fetch(`${userBan.id}`).catch(() => {})
        if (memberBan) {
            if (memberBan.roles.highest.position > bot.roles.highest.position) {
                return message.channel.send(`I cannot ban someone higher than me in the role hierarchy.`)
            } else if (memberBan.roles.highest.position > message.member.roles.highest.position) {
                return message.channel.send(`You cannot ban someone higher than you in the role hierarchy.`)
            }
            if (memberBan.permissions.has("BAN_MEMBERS")) {
                return message.channel.send(`You cannot ban this member as they also have the \`BAN_MEMBERS\` permission. You may try to do it manually.`)
            } else if (!memberBan.bannable) {
                return message.channel.send(`I cannot ban this member.`)
            };
        };
        try {
            const banList = await message.guild.bans.fetch(`${userBan.id}`).catch(() => {});
            if (banList) {
                return message.channel.send(`This user is already banned in this server.`)
            }
        } catch(err) {}

        if (await message.guild.members.fetch(`${userBan.id}`).catch(() => {}) && await message.guild.members.fetch(`${userBan.id}`).bannable) {
            try {
                const banEmbed = new MessageEmbed()
                    .setColor("#e4a353")
                    .setTitle(`You were banned from ${message.guild.name}.`)
                    .setDescription(`Reason: ${reason}`)
                    .setTimestamp();

                await userBan.send({
                    embeds: [banEmbed]
                });
            } catch (err) {
                console.log(err);
            }
        };

        try {
            await message.guild.members.ban(userBan, {
                days: 2,
                reason: reason
            });
            const serverBanEmbed = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`${userBan.tag} has been banned.`)
                .setDescription(`Reason: ${reason}`);
            message.channel.send({
                embeds: [serverBanEmbed]
            });
        } catch (err) {
            console.log(err)
            message.channel.send("I couldn't ban this member");
        }
    }
}