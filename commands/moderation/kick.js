const {MessageEmbed} = require("discord.js");

module.exports = {
    name:'kick',
    description: 'Kicks the specified member',
    usage: ";kick @mention <Reason>\` or \`;kick <user ID> <Reason> (the reason can be blank).",
    async execute(message, args) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("KICK_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`KICK_MEMBERS\`.`)
        } else if (!bot.permissions.has("KICK_MEMBERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`KICK_MEMBERS\`.`)
        }
        if (!args[0]) {
            return message.channel.send(`Please specify a valid member or user-ID to be kicked.\nSyntax: \`;kick @Mention <Reason>\` or \`;kick <User-ID> <Reason>\`.`)
        }
        let memberKick = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});
        if (!memberKick) {
            return message.channel.send("Please specify a valid member to be kicked.\nSyntax: \`;kick @Mention <Reason>\` or \`;kick <User-ID> <Reason>\`.");
        }
        let reason = args.slice(1).join(" ") || "No reason given";
        if (memberKick) {
            if (memberKick.roles.highest.position > bot.roles.highest.position) {
                return message.channel.send(`I cannot kick someone higher than me in the role hierarchy.`)
            } else if (memberKick.roles.highest.position > message.member.roles.highest.position) {
                return message.channel.send(`You cannot kick someone higher than you in the role hierarchy.`)
            }
            if (memberKick.permissions.has("KICK_MEMBERS")) {
                return message.channel.send(`You cannot ban this member`)
            }
        };
        try {
            const kickEmbed = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`You were kicked from the ${message.guild.name}.`)
                .setDescription(`Reason: ${reason}`)
                .setTimestamp();

            await userBan.send({
                embeds: [kickEmbed]
            });
        } catch (err) {
            console.log(err);
        }

        try {
            await message.guild.members.kick(memberKick, {reason: reason});
            const serverKickEmbed = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`${memberKick.user.tag} has been kicked.`)
                .setDescription(`Reason: ${reason}`);
            message.channel.send({
                embeds: [serverKickEmbed]
            });
        } catch (err) {
            console.log(err)
            return message.channel.send("I couldn't kick this member");
        }
        try {
            const kickDM = new MessageEmbed()
                .setTitle(`You have been kicked from ${message.guild.name}.`)
                .setDescription(`Reason: ${reason}`)
                .setColor("#e4a353")
                .setTimestamp();

            await memberKick.send({
                embeds: [kickDM]
            });
        } catch (err) {
            console.log(err)
        }
    }   
}