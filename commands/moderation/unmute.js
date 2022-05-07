const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: 'unmute2',
    description: 'Unmutes the specified member.',
    usage: ";unmute @mention or ;unmute <member ID>",
    async execute(message, args) {
        //Author perms check
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            const permerror = new MessageEmbed()
                .setColor("${process.env.colour}")
                .setTitle(`Error executing that command.`)
                .setDescription(`You do not have the necessary permissions to execute this command.`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        }
        console.log('pla')
        //Variable definition for the mentioned user or ID
        let memberMentioned = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => {});

        reason = args.slice(1).join(" ");
        if (!reason) {
            reason = 'No reason given.';
        }

        //Variable defining for mute role and userMute
        let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        let memberMute = null;

        //For bad user input
        if (!memberMentioned) {
            return message.channel.send("Specify a valid user to be unmuted.");
        } else if (message.guild.members.cache.get(memberMentioned.id)) {

            memberMute = message.guild.members.cache.get(memberMentioned.id);

            if (!memberMute.roles.cache.some(role => role.name === 'Muted')) {
                const alrUnmuted = new MessageEmbed()
                    .setColor("${process.env.colour}")
                    .setTitle("Unable to unmute this user.")
                    .setDescription("This user is already unmuted.");

                return message.channel.send({
                    embeds: [alrUnmuted]
                })
            }
        }
        try {
            memberMute.roles.remove(muteRole.id);
            const unmuteEmbed = new MessageEmbed()
                .setColor("${process.env.colour}")
                .setTitle(`${memberMute.user.tag} has been unmuted.`)
                .setDescription(`Reason: ${reason}`)
                .setTimestamp();
            message.channel.send({
                embeds: [unmuteEmbed]
            })

        } catch (err) {
            console.log(err)
            message.channel.send("...")

        }
    }
};