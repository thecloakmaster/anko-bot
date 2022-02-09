const {
    MessageEmbed,
    Guild,
    Message
} = require("discord.js");

const ms = require("ms");

module.exports = {
    name: 'mute',
    description: 'Mutes the specified member.',
    usage: ";mute @mention or ;mute <message ID>",
    async execute(message, args) {
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            const permerror = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Error executing that command.`)
                .setDescription(`You do not have the necessary permissions to execute this command.`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        };

        let memberMute = await message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});

        timeList = ["seconds", "sec", "s", "m", "min", "minutes", "h", "hrs", "hr", "hour", "hours", "d", "day", "days", "months", "month", "y", "year", "years"];

        reason = "No reason given.";
        time = '';

        //Reason
        if (timeList.indexOf(args[2]) >= 0) {
            time = args[1] + args[2];
            console.log(time);
            reason = args.slice(3).join(" ");
            if (!reason) {
                reason = 'No reason given.';
            }
        } else {
            time = args[1];
            reason = args.slice(2).join(" ");
            if (!reason) {
                reason = 'No reason given.';
            };
        }
        console.log(reason, time);

        let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');


        if (!memberMute) {
            return message.channel.send("Specify a valid user to be muted.");
        }

        //If user being muted has mute permissions himself
        if (memberMute.permissions.has("MANAGE_ROLES")) {
            const modMute = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Error executing command.`)
                .setDescription(`You cannot mute this member.`)
                .setTimestamp();

            return message.reply({
                embeds: [modMute]
            });
        }

        if (memberMute.roles.cache.some(role => role.name === 'Muted')) {
            const alrMuted = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Error executing command.`)
                .setDescription(`This member is already muted.`)
                .setTimestamp();

            return message.reply({
                embeds: [alrMuted]
            });
        }

        try {
            if (!time || !ms(time)) {
                const muteDM = new MessageEmbed()
                    .setTitle(`You have been muted in ${message.guild.name} indefinitely.`)
                    .setDescription(`Reason: ${time} ${reason}`)
                    .setColor("AQUA")
                    .setTimestamp();

                await memberMute.send({
                    embeds: [muteDM]
                });
            } else {
                const muteDM = new MessageEmbed()
                    .setTitle(`You have been muted in ${message.guild.name} for ${time}`)
                    .setDescription(`Reason: ${reason}`)
                    .setColor("AQUA")
                    .setTimestamp();

                await memberMute.send({
                    embeds: [muteDM]
                });
            }
        } catch (err) {
            console.log(err);
        }

        try {
            if (!time || !ms(time)) {
                memberMute.roles.add(muteRole.id);
                const muteEmbed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(`${memberMute.user.tag} has been muted indefinitely.`)
                    .setDescription(`Reason: ${time} ${reason}`)
                    .setTimestamp();
                return message.channel.send({
                    embeds: [muteEmbed]
                });
            }
            memberMute.roles.add(muteRole.id);
            const muteEmbedTwo = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`${memberMute.user.tag} has been muted for ${ms(ms(time))}.`)
                .setDescription(`Reason: ${reason}`)
                .setTimestamp();
            message.channel.send({
                embeds: [muteEmbedTwo]
            })

            setTimeout(function () {
                memberMute.roles.remove(muteRole.id);
                console.log("Unmute");
            }, ms(time));
        } catch (err) {
            console.log(err)
        };
    }
}