const {
    MessageEmbed
} = require("discord.js");

const ms = require("ms");

module.exports = {
    name: 'spank',
    description: 'Spanks the specified member and mutes them for 1 minute.',
    usage: ";spank @mention",
    aliases: ["shut"],
    async execute(message, args) {
        let spankRole = message.guild.roles.cache.find(role => role.name === 'Spanked');
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            try {
                message.member.roles.add(spankRole.id);
                setTimeout(function () {
                    message.member.roles.remove(spankRole.id);
                }, ms('1m'));
            } catch (err) {}
            const permerror = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`You got spanked instead.`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        };

        let memberSpank = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});

        if (!memberSpank) {
            return message.channel.send("Specify a valid user to be spanked.");
        }

        

        if (memberSpank.roles.cache.some(role => role.name === 'Spanked')) {
            const alrSpanked = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`Error executing command.`)
                .setDescription(`This member has already been spanked.`)
                .setTimestamp();

            return message.reply({
                embeds: [alrSpanked]
            });
        }

        try {
            memberSpank.roles.add(spankRole.id);
            const spankEmbed = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`${memberSpank.user.tag} has been spanked.`)
                .setTimestamp();
            message.channel.send({
                embeds: [spankEmbed]
            })

            setTimeout(function () {
                memberSpank.roles.remove(spankRole.id);
            }, ms('1m'));
        } catch (err) {
            console.log(err);
        }
    }
}