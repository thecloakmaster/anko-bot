const MutedMember = require (`../../database/MutedMember.js`)
const MuteRole = require (`../../database/MuteRole.js`)
const {MessageEmbed} = require("discord.js");
const ms = require("ms");

module.exports = {
    name: `mute`,
    description: 'Mutes the specified member.',
    usage: ";mute @Mention <Time> <Reason>\`or \`;mute <member ID> <Time> <Reason> (the reason and time can be left blank)",
    async execute(message, args, client) {
        //Permission checks
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_ROLES") || !message.member.permissions.has("MODERATE_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_ROLES\` & \`MODERATE_MEMBERS\`.`)
        } else if (!bot.permissions.has("MANAGE_ROLES") || !bot.permissions.has("MODERATE_MEMBERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_ROLES\` & \`MODERATE_MEMBERS\`.`)
        };
        let muteRole = await MuteRole.findOne({
            GuildID: message.guild.id
        });
        if (!muteRole) {
            return message.channel.send(`No mute role has been provided. Setup a mute role with \`;setmuterole <Ping the mute role>\`.`)
        }
        let guildMuteRole = await message.guild.roles.fetch(`${muteRole.MuteRoleID}`).catch(() => {});
        if(!guildMuteRole) {
            return message.channel.send(`Could not find the provided mute role. Setup a mute role again with \`;setmuterole <Ping the mute role>\`.`)
        }
        if (!args) {
            return message.channel.send(`Please specify a valid member to be muted.\nSyntax: \`;mute @Mention <Time>\``)
        }
        let memberMute = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});
        if (!memberMute) {
            return message.channel.send(`Please specify a valid member to be muted.\nSyntax: \`;mute @Mention <Time>\``)
        }
        if (memberMute.roles.highest.position > bot.roles.highest.position) {
            return message.channel.send(`I cannot mute someone higher than me in the role hierarchy.`)
        } else if (memberMute.roles.highest.position > message.member.roles.highest.position) {
            return message.channel.send(`You cannot mute someone higher than you in the role hierarchy.`)
        }
        //Time and reason validation and allocation 
        let timeList = ["second", "seconds", "sec", "s", "m", "min", "minutes", "minute", "h", "hrs", "hr", "hour", "hours", "d", "day", "days", "months", "month", "y", "year", "years"];
        let time = args[1];
        let reason = `No reason given.`;
        if (!time) {
             reason = args.slice(1).join(" ")
             if (!reason) {
                 reason = 'No reason given.';
             };
        } else if (!isNaN(args[1].charAt(0))) {
            if (timeList.indexOf(args[2]) >= 0) {
                time = args[1] + args[2];
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
        //Checks for member being already muted
        if (memberMute.roles.cache.some(role => role.id === muteRole.MuteRoleID)) {
            const alrMuted = new MessageEmbed()
                .setColor(`${process.env.colour}`)
                .setTitle(`Error executing command.`)
                .setDescription(`This member is already muted.`)
                .setTimestamp();

            return message.channel.send({
                embeds: [alrMuted]
            });
        } else if (memberMute.isCommunicationDisabled()) {
            const alrMuted = new MessageEmbed()
                .setColor(`${process.env.colour}`)
                .setTitle(`Error executing command.`)
                .setDescription(`This member is already muted.`)
                .setTimestamp();

            return message.channel.send({
                embeds: [alrMuted]
            });
        }
        //Muting (giving the role or timing them out) and adding to the database(if time is greater than 28 days)
        let msTime = 0
        if (time) {
            msTime = ms(time)
        }
        if (!time || msTime === 0){
            try {
                await memberMute.roles.add(muteRole.MuteRoleID).catch((err) => {
                    message.channel.send(`Error muting this member`)
                    return console.log(err)
                });;
                let muteEmbed = new MessageEmbed()
                    .setColor(`${process.env.colour}`)
                    .setTitle(`${memberMute.user.tag} has been muted indefinitely.`)
                    .setDescription(`Reason: ${reason}`)
                    .setTimestamp();

                let muteDM = new MessageEmbed()
                    .setTitle(`You have been muted in ${message.guild.name} indefinitely.`)
                    .setDescription(`Reason: ${reason}`)
                    .setColor(`${process.env.colour}`)
                    .setTimestamp();

                await memberMute.send({
                    embeds: [muteDM]
                }).catch(() => {});
                await message.channel.send({
                    embeds: [muteEmbed]
                })
            } catch(err) {
                console.log(err)
                message.channel.send(`Error muting this member`)
            }
        } else if (0 < msTime && msTime < 28*24*60*60*1000) {
            try {
                await memberMute.timeout(msTime, reason).catch((err) => {
                    message.channel.send(`Error muting this member`)
                    return console.log(err)
                });
                let muteDM = new MessageEmbed()
                    .setTitle(`You have been muted in ${message.guild.name} for ${time}`)
                    .setDescription(`Reason: ${reason}`)
                    .setColor(`${process.env.colour}`)
                    .setTimestamp();

                let muteEmbed = new MessageEmbed()
                    .setColor(`${process.env.colour}`)
                    .setTitle(`${memberMute.user.tag} has been muted for ${time}.`)
                    .setDescription(`Reason: ${reason}`)
                    .setTimestamp();
                
                await memberMute.send({
                    embeds: [muteDM]
                }).catch(() => {});
                await message.channel.send({
                    embeds: [muteEmbed]
                })
            } catch (err) {
                console.log(err)
                message.channel.send(`Error muting this member`)
            }
        } else if (msTime >= 28*24*60*60*1000) {
            try {
                await memberMute.roles.add(guildMuteRole.id).catch((err) => {
                    message.channel.send(`Error muting this member`)
                    return console.log(err)
                });;
                let newData = new MutedMember({
                    UserID: `${memberMute.user.id}`,
                    GuildID: `${message.guild.id}`,
                    GivenAt: Date.now(),
                    LastsTill: Date.now() + msTime,
                    ClientID: `${client.user.id}`
                })
                newData.save();

                let muteDM = new MessageEmbed()
                    .setTitle(`You have been muted in ${message.guild.name} for ${time}`)
                    .setDescription(`Reason: ${reason}`)
                    .setColor(`${process.env.colour}`)
                    .setTimestamp();

                let muteEmbed = new MessageEmbed()
                    .setColor(`${process.env.colour}`)
                    .setTitle(`${memberMute.user.tag} has been muted for ${time}.`)
                    .setDescription(`Reason: ${reason}`)
                    .setTimestamp();

                await memberMute.send({
                    embeds: [muteDM]
                }).catch(() => {});
                await message.channel.send({
                    embeds: [muteEmbed]
                })
            } catch(err) {
                console.log(err)
                return message.channel.send(`Error muting this member`)
            }
        }

    }
}