const {MessageEmbed} = require("discord.js");
module.exports = {
    name: `delrole`,
    description: `Deletes the specified role from the server.`,
    usage: `;delrole @Role`,
    async execute(message, args) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_ROLES\`.`)
        } else if (!bot.permissions.has("MANAGE_ROLES")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_ROLES\`.`)
        };
        let role = message.mentions.roles.first();
        let roleID = role.id
        let roleName = role.name
        let embed = new MessageEmbed()
        .setColor(`#e4a353`)
        .setDescription(`Deleting the role...`)
        let messageW = await message.channel.send({embeds: [embed]})
        role.delete().then(() => {
            let embed2 = new MessageEmbed()
                .setColor(`#e4a353`)
                .setDescription(`Deleted the role with ID ${roleID} and name ${roleName}.`)
            return messageW.edit({embeds: [embed2]})
        }).catch(() => {
            let embed2 = new MessageEmbed()
                .setColor(`#e4a353`)
                .setDescription(`Error encountered while deleting this role.`)
            return messageW.edit({
                embeds: [embed2]
            })
        })
    }
}