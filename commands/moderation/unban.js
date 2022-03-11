const {
    MessageEmbed,
    Guild
} = require("discord.js");
module.exports = {
    name: "unban",
    description: "Unbans the specified user.",
    usage: ";unban <user ID>",
    async execute(message, args) {
        //Author permission check
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            const permerror = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`Error executing that command`)
                .setDescription(`You do not have the necessary permissions to execute this command`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        };

        let userBan = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => {});

        if (!userBan) {
            return message.reply("Send a valid user or user-ID.")
        }

        try {
            //If user is already banned
            const banList = await message.guild.bans.fetch(userBan);
            //const bannedUser = banList.find(user => user.id === `${userBan.id}`)
            if (!banList) {
                const alrBanned = new MessageEmbed()
                    .setColor("#e4a353")
                    .setTitle(`Error executing command.`)
                    .setDescription(`This user is not banned.`)
                    .setTimestamp();
                return message.reply({
                    embeds: [alrBanned]
                })
            }
        } catch (err) {

        }

        try {
            await message.guild.members.unban(userBan);
            const serverBanEmbed = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`${userBan.tag} has been unbanned.`)
            message.reply({
                embeds: [serverBanEmbed]
            });
        } catch (err) {
            const alrBanned = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`Error executing command.`)
                .setDescription(`This user is not banned.`)
                .setTimestamp();
            return message.reply({
                embeds: [alrBanned]
            })
        }
    }
}