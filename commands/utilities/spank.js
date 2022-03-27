const {MessageEmbed} = require("discord.js");

module.exports = {
    name: 'spank',
    description: 'Spanks the specified member and mutes them for 1 minute.',
    usage: ";spank @mention",
    aliases: ["shut"],
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MODERATE_MEMBERS")) {
            try {
                message.member.timeout(60000, "No perms :)")
            } catch (err) {}
            const permerror = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`You got spanked instead.`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        } else if (!bot.permissions.has(`MODERATE_MEMBERS`)) {
            return message.channel.send(`No perms :(`)
        };
        let memberSpank = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});

        if (!memberSpank) {
            return message.channel.send("Specify a valid user to be spanked.");
        }
        let reason = args.slice(1).join(" ")
        let spankEmbed = null
        if (reason) {
            spankEmbed = new MessageEmbed()
                .setColor("#e4a353")
                .setDescription(`<@!${memberSpank.user.id}> has been spanked for ${reason}.`)
                .setTimestamp();
        } else {
            spankEmbed = new MessageEmbed()
                .setColor("#e4a353")
                .setDescription(`<@!${memberSpank.user.id}> has been spanked.`)
                .setTimestamp();
        }
             
        if (memberSpank.roles.highest.position > bot.roles.highest.position) {
            return message.channel.send({embeds: [spankEmbed]})
        } else if (memberSpank.roles.highest.position > message.member.roles.highest.position) {
            return message.channel.send({embeds: [spankEmbed]})
        }
        try {
            await memberSpank.timeout(60000, `${reason}`).catch(err => console.log(err))
            return message.channel.send({embeds: [spankEmbed]})
        } catch (err) {
            console.log(err);
        }
    }
}