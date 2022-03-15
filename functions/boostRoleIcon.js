const {
    MessageEmbed
} = require("discord.js");
const BoosterMember = require(`../database/BoosterMember.js`)
module.exports = {
    async execute(roleName, roleID, roleIconURL, roleEmbedMessage, roleColour, message, client) {
        await BoosterMember.findOneAndRemove({
            MemberID: `${message.author.id}`,
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        try {
            await message.guild.roles.create({
                name: `${roleName}`,
                color: `${roleColour}`,
                icon: `${roleIconURL}`,
                position: 38
            }).then((role) => {
                roleID = role.id
            }).catch((err) => {
                console.log(err)
                if (err.code === 50035) {
                    let roleEmbed2 = new MessageEmbed()
                        .setColor(`#e4a353`)
                        .setDescription(`An error occured while creating this role. Please provide a valid image.`)
                    roleEmbedMessage.edit({
                        embeds: [roleEmbed2]
                    })
                }
                let roleEmbed2 = new MessageEmbed()
                    .setColor(`#e4a353`)
                    .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
                roleEmbedMessage.edit({
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
                console.log(err.code)
                let roleEmbed2 = new MessageEmbed()
                    .setColor(`#e4a353`)
                    .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
                roleEmbedMessage.edit({
                    embeds: [roleEmbed2]
                })
                return console.log(err)
            });
            message.member.roles.add(roleID);
            let roleEmbed2 = new MessageEmbed()
                .setColor(`${roleColour}`)
                .setDescription(`The role <@&${roleID}> has been created and applied to <@${message.author.id}>`)
            return roleEmbedMessage.edit({
                embeds: [roleEmbed2]
            })
        } catch (err) {

        }
    }
}