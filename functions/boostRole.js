const {MessageEmbed} = require("discord.js");
const BoosterMember = require(`../database/BoosterMember.js`)
module.exports = {
    async execute(roleName, roleID, roleEmbedMessage, roleColour, message, client) {
        await BoosterMember.findOneAndRemove({
            MemberID: `${message.author.id}`,
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        await message.guild.roles.create({
            name: `${roleName}`,
            color: `${roleColour}`,
            position: 39
        }).then((role) => {
            roleID = role.id
        }).catch((err) => {
            console.log(err)
            let roleEmbed2 = new MessageEmbed()
                .setColor(`#e4a353`)
                .setDescription(`An error occured while creating this role. Contact the developer to fix this issue.`)
            return roleEmbedMessage.edit({
                embeds: [roleEmbed2]
            })
        })
        let newData = new BoosterMember({
            MemberID: `${message.author.id}`,
            RoleID: `${roleID}`,
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        newData.save().catch((err) => {
            console.log(err)
            let roleEmbed2 = new MessageEmbed()
                .setColor(`#e4a353`)
                .setDescription(`An error occured while creating this role. Contact the developer to fix this issue.`)
            return roleEmbedMessage.edit({
                embeds: [roleEmbed2]
            })
        });
        await message.member.roles.add(roleID).then(() => {
            let roleEmbed2 = new MessageEmbed()
                .setColor(`${roleColour}`)
                .setDescription(`The role <@&${roleID}> has been created and applied to <@${message.author.id}>`)
            return roleEmbedMessage.edit({
                embeds: [roleEmbed2]
            })
        }).catch(() => {
            let roleEmbed2 = new MessageEmbed()
                .setColor(`#e4a353`)
                .setDescription(`An error occured while creating this role. Contact the developer to fix this issue.`)
            return roleEmbedMessage.edit({
                embeds: [roleEmbed2]
            })
        });
    }
}