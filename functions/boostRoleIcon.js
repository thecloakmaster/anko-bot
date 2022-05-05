const {
    MessageEmbed
} = require("discord.js");
const BoosterMember = require(`../database/BoosterMember.js`)
module.exports = {
    async execute(roleName, roleID, roleIconURL, roleEmbedMessage, roleColour, message, client) {
        try {
            await message.guild.roles.create({
                name: `${roleName}`,
                color: `${roleColour}`,
                icon: `${roleIconURL}`,
                position: 42
            }).then((role) => {
                roleID = role.id
            }).catch((err) => {
                if (err.code === 50035) {
                    let roleEmbed2 = new MessageEmbed()
                        .setColor(`#e4a353`)
                        .setDescription(`An error occured while creating this role. Please provide a valid image. (The image should be a .png or a .jpg file and should be smaller than 256 KB.)`)
                    roleEmbedMessage.edit({
                        embeds: [roleEmbed2]
                    })
                    throw "Error"
                }
                let roleEmbed2 = new MessageEmbed()
                    .setColor(`#e4a353`)
                    .setDescription(`An error occured while creating this role. Contact the developer to fix this issue.`)
                roleEmbedMessage.edit({
                    embeds: [roleEmbed2]
                })
                throw "Error"
            })
            await message.member.roles.add(roleID).then(() => {
                let roleEmbed2 = new MessageEmbed()
                    .setColor(`${roleColour}`)
                    .setDescription(`The role <@&${roleID}> has been created and applied to <@${message.author.id}>`)
                return roleEmbedMessage.edit({
                    embeds: [roleEmbed2]
                })
            }).catch((err) => {
                let roleEmbed2 = new MessageEmbed()
                    .setColor(`#e4a353`)
                    .setDescription(`An error occured while creating this role. Please provide a valid image. (The image should be a .png or a .jpg file and should be smaller than 256 KB.)`)
                roleEmbedMessage.edit({
                    embeds: [roleEmbed2]
                })
                throw "Error"
            });
            await BoosterMember.findOneAndRemove({
                MemberID: `${message.author.id}`,
                GuildID: `${message.guild.id}`,
                ClientID: `${client.user.id}`
            })
            let newData = new BoosterMember({
                MemberID: `${message.author.id}`,
                RoleID: `${roleID}`,
                GuildID: `${message.guild.id}`,
                ClientID: `${client.user.id}`
            })
            newData.save().catch((err) => {
                let roleEmbed2 = new MessageEmbed()
                    .setColor(`#e4a353`)
                    .setDescription(`An error occured while creating this role. Contact the developer to fix this issue.`)
                roleEmbedMessage.edit({
                    embeds: [roleEmbed2]
                })
                throw "Error"
            });
        } catch (err) {

        }
    }
}