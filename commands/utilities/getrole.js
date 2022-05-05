const {MessageEmbed} = require("discord.js");
const BoosterMember = require(`../../database/BoosterMember.js`)
const roleCreate = require(`../../functions/boostRole.js`)
const roleCreateIcon = require(`../../functions/boostRoleIcon.js`)
module.exports = {
    name: `getrole`,
    aliases: [`boosterrole`],
    description: `Gives a custom role to the boosters of their choice.`,
    usage: `;getrole <Hex colour for the role> <Role name> <Role icon URL (not necessary)>`,
    async execute(message, args, client) {
        let serverBoostRole = message.guild.roles.premiumSubscriberRole
        if (!message.member.premiumSinceTimestamp && !message.member.roles.cache.some(role => role.id === serverBoostRole.id) && !message.member.permissions.has(`ADMINISTRATOR`)) {
            return message.channel.send(`You are not eligible for a custom role but you can be if you become a server booster.`)
        } else if (message.member.premiumSinceTimestamp && message.member.roles.cache.some(role => role.id === serverBoostRole.id) || message.member.permissions.has(`ADMINISTRATOR`)) {
            if (!args[0]) {
                return message.channel.send(`You are eligible for a custom role.\n Use \`;help getrole\` to get help on creating a custom role for yourself.`)
            }
            let roleColour = args[0]
            let hexReg = /^#[0-9A-F]{6}$|^[0-9A-F]{6}/i
            let colRegMatch = roleColour.match(hexReg)
            if (!colRegMatch || roleColour.length > 6) {
                return message.channel.send(`Please enter a valid hex colour code.\nYou can pick out a hex colour code using this site: <https://htmlcolorcodes.com>.\nSyntax: \`;getrole <Hex colour> <Role name> <Icon URL for the role (not necessary)>\``)
            }
            roleColour = colRegMatch[0]
            let roleName = args.slice(1, args.length - 1).join(" ")
            let roleIconURL = args[args.length - 1]
            if (message.attachments.size > 0 && message.attachments.size < 2) {
                let attachments = Array.from(await message.attachments.values());
                roleIconURL = attachments[0].proxyURL
                roleName = args.slice(1).join(" ")
            }
            try {
                let urlcheck = new URL(roleIconURL)
                let imgMatch = roleIconURL.split(/[#?]/)[0].split('.').pop().trim();
                if (imgMatch != 'jpeg' && imgMatch != `jpg` && imgMatch != 'png') {
                    return message.channel.send(`Please enter a valid image URL to a .jpg or a .png file.`)
                }
                roleIconURL = roleIconURL.replace(/\s/g, '')
            } catch (err) {
                //return message.channel.send(`Please enter a valid URL.\nSyntax: \`;getrole <Hex colour> <Role name> <Icon URL for the role (not necessary)>\`__`)
                roleName = args.slice(1).join(" ")
                roleIconURL = null
            }
            if (!roleName) {
                return message.channel.send(`Please enter a valid role name.\nSyntax: \`;getrole <Hex colour> <Role name> <Icon URL for the role (not necessary)>\``)
            } else if (roleName.length > 100) {
                return message.channel.send(`Please enter a shorter role name, preferably less than 100 characters.\nSyntax: \`;getrole <Hex colour> <Role name> <Icon URL for the role (not necessary)>\``)
            }

            let PremiumTiers = ['NONE', 'TIER_1', 'TIER_2', 'TIER_3']
            if (!roleIconURL || PremiumTiers.indexOf(message.guild.premiumTier) <= 1) {
                let data = await BoosterMember.findOne({
                    MemberID: `${message.author.id}`,
                    GuildID: `${message.guild.id}`,
                    ClientID: `${client.user.id}`
                })
                //If guild has boosts and the DB doesn't have the member 
                if (!data) {
                    let roleID = 0
                    let roleEmbed = new MessageEmbed()
                        .setColor(`#e4a353`)
                        .setDescription(`Creating a role...`)
                    let roleEmbedMessage = await message.channel.send({
                        embeds: [roleEmbed]
                    })
                    await message.guild.roles.create({
                        name: `${roleName}`,
                        color: `${roleColour}`,
                        position: 38
                    }).then((role) => {
                        roleID = role.id
                    }).catch((err) => {
                        console.log(err)
                        let roleEmbed2 = new MessageEmbed()
                            .setColor(`#e4a353`)
                            .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
                        roleEmbedMessage.edit({
                            embeds: [roleEmbed2]
                        })
                        return console.log(err)
                    })
                    await message.member.roles.add(roleID).then(() => {
                        let roleEmbed2 = new MessageEmbed()
                            .setColor(`${roleColour}`)
                            .setDescription(`The role <@&${roleID}> has been created and applied to <@${message.author.id}>`)
                        return roleEmbedMessage.edit({
                            embeds: [roleEmbed2]
                        })
                    }).catch(() => {
                        console.log(err)
                        let roleEmbed2 = new MessageEmbed()
                            .setColor(`#e4a353`)
                            .setDescription(`An error occured while creating this role. Contact the developer to fix this issue.`)
                        return roleEmbedMessage.edit({
                            embeds: [roleEmbed2]
                        })
                    });
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
                            .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
                        roleEmbedMessage.edit({
                            embeds: [roleEmbed2]
                        })
                        return console.log(err)
                    });
                    //If guild has boosts and the DB has the member 
                } else if (data) {
                    let roleID = 0
                    let dataRole = await message.guild.roles.fetch(`${data.RoleID}`)
                    let roleEmbed = new MessageEmbed()
                        .setColor(`#e4a353`)
                        .setDescription(`Creating a role...`)
                    let roleEmbedMessage = await message.channel.send({
                        embeds: [roleEmbed]
                    })
                    if (!dataRole) {
                        //If guild has boosts, the DB has the member and the role present in the DB doesn't exist
                        roleCreate.execute(roleName, roleID, roleEmbedMessage, roleColour, message, client).catch(() => {})
                    } else if (dataRole) {
                        //If guild has boosts, the DB has the member and the role present in the DB exists
                        roleCreate.execute(roleName, roleID, roleEmbedMessage, roleColour, message, client).then(async () => {
                            await dataRole.delete().catch(() => {})
                        }).catch(() => {})
                    }
                }
            } else if (roleIconURL && PremiumTiers.indexOf(message.guild.premiumTier) >= 2) {
                let data = await BoosterMember.findOne({
                    MemberID: `${message.author.id}`,
                    GuildID: `${message.guild.id}`,
                    ClientID: `${client.user.id}`
                })
                //If guild has boosts and the DB doesn't have the member 
                if (!data) {
                    let roleID = 0
                    let roleEmbed = new MessageEmbed()
                        .setColor(`#e4a353`)
                        .setDescription(`Creating a role...`)
                    let roleEmbedMessage = await message.channel.send({
                        embeds: [roleEmbed]
                    })
                    await message.guild.roles.create({
                        name: `${roleName}`,
                        color: `${roleColour}`,
                        icon: `${roleIconURL}`,
                        position: 42
                    }).then((role) => {
                        roleID = role.id
                    }).catch((err) => {
                        console.log(err)
                        let roleEmbed2 = new MessageEmbed()
                            .setColor(`#e4a353`)
                            .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
                        roleEmbedMessage.edit({
                            embeds: [roleEmbed2]
                        })
                        return console.log(err)
                    })
                    await message.member.roles.add(roleID).then(() => {
                        let roleEmbed2 = new MessageEmbed()
                            .setColor(`${roleColour}`)
                            .setDescription(`The role <@&${roleID}> has been created and applied to <@${message.author.id}>`)
                        return roleEmbedMessage.edit({
                            embeds: [roleEmbed2]
                        })
                    }).catch(() => {
                        console.log(err)
                        let roleEmbed2 = new MessageEmbed()
                            .setColor(`#e4a353`)
                            .setDescription(`An error occured while creating this role. Contact the developer to fix this issue.`)
                        return roleEmbedMessage.edit({
                            embeds: [roleEmbed2]
                        })
                    });
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
                            .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
                        roleEmbedMessage.edit({
                            embeds: [roleEmbed2]
                        })
                        return console.log(err)
                    });
                    //If guild has boosts and the DB has the member 
                } else if (data) {
                    let roleID = 0
                    let dataRole = await message.guild.roles.fetch(`${data.RoleID}`)
                    let roleEmbed = new MessageEmbed()
                        .setColor(`#e4a353`)
                        .setDescription(`Creating a role...`)
                    let roleEmbedMessage = await message.channel.send({
                        embeds: [roleEmbed]
                    })
                    //If guild has boosts, the DB has the member and the role present in the DB doesn't exist
                    if (!dataRole) {
                        roleCreateIcon.execute(roleName, roleID, roleIconURL, roleEmbedMessage, roleColour, message, client).catch(() => {})
                        //If guild has boosts, the DB has the member and the role present in the DB exists
                    } else if (dataRole) {
                        roleCreateIcon.execute(roleName, roleID, roleIconURL, roleEmbedMessage, roleColour, message, client).then(async () => {
                            await dataRole.delete().catch(() => {})
                        }).catch(() => {})
                    }
                }
            }
        }
    }
}
