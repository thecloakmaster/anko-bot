const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name:'kick',
    description: 'Kicks the specified member',
    usage: ";kick @mention or ;kick <message ID>",
    async execute(message, args) {
        if (!message.member.permissions.has("KICK_MEMBERS")) {
            const permerror = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Error executing that command.`)
                .setDescription(`You do not have the necessary permissions to execute this command.`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        }
        let memberKick = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});

        let reason = args.slice(1).join(" ") || "No reason given";

        if (!memberKick) {
            return message.channel.send("Specify a valid user to be kicked.");
        }

        if (memberKick.permissions.has("KICK_MEMBERS")) {
            const modKick = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Error executing command.`)
                .setDescription(`You cannot kick this member.`)
                .setTimestamp();

            return message.reply({
                embeds: [modKick]
            });
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

        try {
            const serverKickEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`${memberKick.user.tag} has been kicked.`)
                .setDescription(`Reason: ${reason}`);
            message.reply({
                embeds: [serverKickEmbed]
            });
            await message.guild.members.kick(memberKick, {
                reason: reason
            });
        } catch (err) {
            console.log(err)
        }
    }   
}