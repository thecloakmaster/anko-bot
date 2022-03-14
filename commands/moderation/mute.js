const {
    MessageEmbed
} = require("discord.js");

const ms = require("ms");

module.exports = {
    name: 'mute2',
    description: 'Mutes the specified member.',
    usage: ";mute @mention or ;mute <member ID>",
    async execute(message, args) {
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            const permerror = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`Error executing that command.`)
                .setDescription(`You do not have the necessary permissions to execute this command.`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        };
        if (!args) {
            return message.channel.send(`Please specify a valid member to be muted.\nSyntax: \`;mute @mention <Time>\``)
        }
        let memberMute = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});
        if (!memberMute) {
            return message.channel.send(`Please specify a valid member to be muted.\nSyntax: \`;mute @mention <Time>\``)
        }
        let timeList = ["seconds", "sec", "s", "m", "min", "minutes", "h", "hrs", "hr", "hour", "hours", "d", "day", "days", "months", "month", "y", "year", "years"];

        let reason = "No reason given.";
        let time = '';

        if (!time) {
            reason = args.slice(1).join(" ")
            if (!reason) {
                reason = 'No reason given.';
            };
        } else if (!isNaN(args[1].charAt(0))) {
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
            };
        } else if (isNaN(args[1].charAt(0))) {
            reason = args.slice(1).join(" ")
            if (!reason) {
                reason = 'No reason given.';
            };
            time = null
        }
        if (!args[1]) {
            time = null
        }
        console.log(reason, time);

        let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');

        if (!memberMute) {
            return message.channel.send("Specify a valid user to be muted.");
        }

        //If user being muted has mute permissions himself
        //if (memberMute.permissions.has("MANAGE_ROLES")) {
        //    const modMute = new MessageEmbed()
        //        .setColor("#e4a353")
        //        .setTitle(`Error executing command.`)
        //        .setDescription(`You cannot mute this member.`)
        //        .setTimestamp();
        //    return message.reply({
        //        embeds: [modMute]
        //    });
        //}

        if (memberMute.roles.cache.some(role => role.name === 'Muted')) {
            const alrMuted = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`Error executing command.`)
                .setDescription(`This member is already muted.`)
                .setTimestamp();

            return message.reply({
                embeds: [alrMuted]
            });
        }

        try {
            if (!time) {
                const muteDM = new MessageEmbed()
                    .setTitle(`You have been muted in ${message.guild.name} indefinitely.`)
                    .setDescription(`Reason: ${reason}`)
                    .setColor("#e4a353")
                    .setTimestamp();

                await memberMute.send({
                    embeds: [muteDM]
                });
            } else {
                const muteDM = new MessageEmbed()
                    .setTitle(`You have been muted in ${message.guild.name} for ${time}`)
                    .setDescription(`Reason: ${reason}`)
                    .setColor("#e4a353")
                    .setTimestamp();

                await memberMute.send({
                    embeds: [muteDM]
                });
            }
        } catch (err) {
            console.log(err);
        }

        try {
            if (!time) {
                memberMute.roles.add(muteRole.id);
                const muteEmbed = new MessageEmbed()
                    .setColor("#e4a353")
                    .setTitle(`${memberMute.user.tag} has been muted indefinitely.`)
                    .setDescription(`Reason: ${reason}`)
                    .setTimestamp();
                return message.channel.send({
                    embeds: [muteEmbed]
                });
            }
            memberMute.roles.add(muteRole.id);
            const muteEmbedTwo = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`${memberMute.user.tag} has been muted for ${time}.`)
                .setDescription(`Reason: ${reason}`)
                .setTimestamp();
            message.channel.send({
                embeds: [muteEmbedTwo]
            })

            if (!time) {
                return
            } else {
                let timeMS = ms(time)
                let maxDelay = Math.pow(2, 31) - 1;
                if (timeMS > maxDelay) {
                    return;
                }
                setTimeout(function () {
                    memberMute.roles.remove(muteRole.id);
                    console.log("Unmuted");
                }, timeMS)
            }
        } catch (err) {
            console.log(err)
        };
    }
}