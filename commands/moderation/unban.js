const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "unban",
    description: "Unbans the specified user.",
    usage: ";unban <user ID>",
    async execute(message, args) {
        //Author permission check
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        } else if (!bot.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        }

        let userBan = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => {});

        if (!userBan) {
            return message.channel.send("Send a valid user or user-ID.")
        }

        try {
            //If user is already unbanned
            const banList = await message.guild.bans.fetch(userBan);
            //const bannedUser = banList.find(user => user.id === `${userBan.id}`)
            if (!banList) {
                const alrBanned = new MessageEmbed()
                    .setColor("#e4a353")
                    .setTitle(`Error executing command.`)
                    .setDescription(`This user is not banned.`)
                    .setTimestamp();
                return message.message.channel.send({
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
            return message.channel.send({
                embeds: [serverBanEmbed]
            });
        } catch (err) {
            
        }
    }
}