const {
    MessageEmbed,
    Guild
} = require("discord.js");
module.exports = {
    name: 'ban',
    description: 'Bans a user',
    async execute(message, args) {
        //Author permission check
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            const permerror = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Error executing that command`)
                .setDescription(`You do not have the necessary permissions to execute this command`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        };

        let userBan = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => {});

        //Reason
        let reason = args.slice(1).join(" ") || "No reason given";

        //Ban embed being sent to the user
        const banEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`You were banned from the server`)
            .setDescription(`Reason: ${reason}`)
            .setTimestamp();

        if (!userBan) {
            return message.reply("Send a valid user or user-ID.")
        } else if (message.guild.members.cache.get(userBan.id)) {

            userBanTwo = message.guild.members.cache.get(userBan.id)

            //If user being banned has ban permissions himself
            if (userBanTwo.permissions.has("BAN_MEMBERS")) {
                const modban = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`Error executing command`)
                    .setDescription(`You cannot ban this member`)
                    .setTimestamp();

                return message.reply({
                    embeds: [modban]
                });
            };
            //If user is not bannable
            if (!userBanTwo.bannable) {
                const bannableNot = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`Error executing command`)
                    .setDescription(`I was unable to ban this user`)
                    .setTimestamp();

                return message.reply({
                    embeds: [bannableNot]
                });
            };
        };

        try {
            //If user is already banned
            const banList = await message.guild.bans.fetch(userBan);
            if (banList) {
                const alrBanned = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`Error executing command.`)
                    .setDescription(`This user is already banned.`)
                    .setTimestamp();
                return message.reply({
                    embeds: [alrBanned]
                })
            }
        } catch(err) {

        }

        if (message.guild.members.cache.get(userBan) && message.guild.members.cache.get(userBan).bannable) {
            try {
                await userBan.send({
                    embeds: [banEmbed]
                });
            } catch (err) {
                console.log(err);
            }
        };

        try {
            await message.guild.members.ban(userBan, {
                reason: reason
            });
            const serverBanEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`${userBan.tag} has been banned.`)
                .setDescription(`Reason: ${reason}`);
            message.reply({
                embeds: [serverBanEmbed]
            });
        } catch (err) {
            console.log(err)
            message.reply("Couldn't ban this member");
        }
    }
}