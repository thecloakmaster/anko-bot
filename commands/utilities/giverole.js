//const {MessageEmbed} = require("discord.js");
//const BoosterMember = require(`../../database/BoosterMember.js`)
//module.exports = {
//    name: `giverole`,
//    aliases: [`boosterrole`],
//    description: `Gives a custom role to the boosters of their choice.`,
//    usage: `;giverole <Hex colour for the role> <Role name> <Role icon URL (not necessary)>`,
//    async execute(message, args, client) {
//        let serverBoostRole = message.guild.roles.premiumSubscriberRole
//        if (!message.member.premiumSinceTimestamp && !message.member.roles.cache.some(role => role.id === serverBoostRole.id)) {
//            return message.channel.send(`You **are not** eligible for a custom role but you can be if you become a server booster.`)
//        } else if (message.member.premiumSinceTimestamp && message.member.roles.cache.some(role => role.id === serverBoostRole.id)) {
//            if (!args[0]) {
//                return message.channel.send(`You **are** eligible for a custom role.\n Use \`;help giverole\` to get help on creating a custom role for yourself.`)
//            }
//            let roleColour = args[0]
//            let hexReg = /^#[0-9A-F]{6}$|^[0-9A-F]{6}/i
//            let colRegMatch = roleColour.match(hexReg)
//            if (!colRegMatch) {
//                return message.channel.send(`Please enter a valid hex colour code.\nYou can pick a hex colour using this site: https://htmlcolorcodes.com.\nSyntax: \`;giverole \`__\`<Hex colour>\`__\`<Role name> <Icon URL for the role (not necessary)>\``)
//            }
//            roleColour = colRegMatch[0]
//            let roleName = args.slice(1, args.length - 1).join(" ")
//            if (!roleName) {
//                return message.channel.send(`Please enter a valid role name.\nSyntax: \`;giverole <Hex colour> \`__\`<Role name>\`__\` <Icon URL for the role (not necessary)>\``)
//            } else if (roleName.length > 100) {
//                return message.channel.send(`Please enter a shorter role name, preferably less than 100 characters.\nSyntax: \`;giverole <Hex colour> \`__\`<Role name>\`__\` <Icon URL for the role (not necessary)>\``)
//            }
//            let roleIconURL = null
//            if (args[args.length - 1]) {
//                roleIconURL = args[args.length - 1]
//                if (message.attachments.size > 0 && message.attachments.size < 2) {
//                    let attachments = Array.from(await message.attachments.values());
//                    roleIconURL = attachments[0].proxyURL
//                }
//                try {
//                    let urlcheck = new URL(roleIconURL)
//                } catch (err) {
//                    return message.channel.send(`Please enter a valid URL.\nSyntax: \`;giverole <Hex colour> <Role name> \`__\`<Icon URL for the role (not necessary)>\`__`)
//                }
//            }
//
//            if (!roleIconURL || message.guild.premiumTier === `NONE`) {
//                let data = BoosterMember.findOne({
//                    MemberID: `${message.author.id}`,
//                    GuildID: `${message.guild.id}`,
//                    ClientID: `${client.user.id}`
//                })
//                if (!data) {
//                    let roleID = 0
//                    let roleEmbed = new MessageEmbed()
//                        .setColor(`#e4a353`)
//                        .setDescription(`Creating a role...`)
//                    let roleEmbedMessage = message.channel.send({
//                        embeds: [roleEmbed]
//                    })
//                    await message.guild.roles.create({
//                        name: `${roleName}`,
//                        color: `${roleColour}`,
//                        position: 38
//                    }).then((role) => {
//                        roleID = role.id
//                    }).catch((err) => {
//                        let roleEmbed2 = new MessageEmbed()
//                            .setColor(`#e4a353`)
//                            .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                        roleEmbedMessage.edit({
//                            embeds: [roleEmbed2]
//                        })
//                        return console.log(err)
//                    })
//                    let newData = new BoosterMember({
//                        MemberID: `${message.author.id}`,
//                        RoleID: `${roleID}`,
//                        GuildID: `${message.guild.id}`,
//                        ClientID: `${client.user.id}`
//                    })
//                    newData.save().catch((err) => {
//                        let roleEmbed2 = new MessageEmbed()
//                            .setColor(`#e4a353`)
//                            .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                        roleEmbedMessage.edit({
//                            embeds: [roleEmbed2]
//                        })
//                        return console.log(err)
//                    });
//                    message.member.roles.add(roleID);
//                    let roleEmbed2 = new MessageEmbed()
//                        .setColor(`${roleColour}`)
//                        .setDescription(`The role <@&${roleID}> has been created and applied to <@${message.author.id}>`)
//                    return roleEmbedMessage.edit({
//                        embeds: [roleEmbed2]
//                    })
//                } else if (data) {
//                    let roleID = 0
//                    let dataRole = await message.guild.roles.fetch(`${data.RoleID}`)
//                    let roleEmbed = new MessageEmbed()
//                        .setColor(`#e4a353`)
//                        .setDescription(`Creating a role...`)
//                    let roleEmbedMessage = await message.channel.send({
//                        embeds: [roleEmbed]
//                    })
//                    if (!dataRole) {
//                        await BoosterMember.findOneAndRemove({
//                            MemberID: `${message.author.id}`,
//                            GuildID: `${message.guild.id}`,
//                            ClientID: `${client.user.id}`
//                        })
//                        await message.guild.roles.create({
//                            name: `${roleName}`,
//                            color: `${roleColour}`,
//                            position: 38
//                        }).then((role) => {
//                            roleID = role.id
//                        }).catch((err) => {
//                            let roleEmbed2 = new MessageEmbed()
//                                .setColor(`#e4a353`)
//                                .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                            roleEmbedMessage.edit({
//                                embeds: [roleEmbed2]
//                            })
//                            return console.log(err)
//                        })
//                        let newData = new BoosterMember({
//                            MemberID: `${message.author.id}`,
//                            RoleID: `${roleID}`,
//                            GuildID: `${message.guild.id}`,
//                            ClientID: `${client.user.id}`
//                        })
//                        newData.save().catch((err) => {
//                            let roleEmbed2 = new MessageEmbed()
//                                .setColor(`#e4a353`)
//                                .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                            roleEmbedMessage.edit({
//                                embeds: [roleEmbed2]
//                            })
//                            return console.log(err)
//                        });
//                        message.member.roles.add(roleID);
//                        let roleEmbed2 = new MessageEmbed()
//                            .setColor(`${roleColour}`)
//                            .setDescription(`The role <@&${roleID}> has been created and applied to <@${message.author.id}>`)
//                        return roleEmbedMessage.edit({
//                            embeds: [roleEmbed2]
//                        })
//                    } else if (dataRole) {
//                        await BoosterMember.findOneAndRemove({
//                            MemberID: `${message.author.id}`,
//                            GuildID: `${message.guild.id}`,
//                            ClientID: `${client.user.id}`
//                        })
//                        await message.guild.roles.edit(`${data.RoleID}`, {
//                            name: `${roleName}`,
//                            color: `${roleColour}`,
//                            position: 38
//                        }).then((role) => {
//                            roleID = role.id
//                        }).catch((err) => {
//                            let roleEmbed2 = new MessageEmbed()
//                                .setColor(`#e4a353`)
//                                .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                            roleEmbedMessage.edit({
//                                embeds: [roleEmbed2]
//                            })
//                            return console.log(err)
//                        })
//                        let newData = new BoosterMember({
//                            MemberID: `${message.author.id}`,
//                            RoleID: `${roleID}`,
//                            GuildID: `${message.guild.id}`,
//                            ClientID: `${client.user.id}`
//                        })
//                        newData.save().catch((err) => {
//                            let roleEmbed2 = new MessageEmbed()
//                                .setColor(`#e4a353`)
//                                .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                            roleEmbedMessage.edit({
//                                embeds: [roleEmbed2]
//                            })
//                            return console.log(err)
//                        });
//                        let roleEmbed2 = new MessageEmbed()
//                            .setColor(`${roleColour}`)
//                            .setDescription(`The role <@&${roleID}> has been created and applied to <@${message.author.id}>`)
//                        return roleEmbedMessage.edit({
//                            embeds: [roleEmbed2]
//                        })
//                    }
//                }
//            } else if (roleIconURL && message.guild.premiumTier != `NONE`) {
//                let data = BoosterMember.findOne({
//                    MemberID: `${message.author.id}`,
//                    GuildID: `${message.guild.id}`,
//                    ClientID: `${client.user.id}`
//                })
//                if (!data) {
//                    let roleID = 0
//                    let roleEmbed = new MessageEmbed()
//                        .setColor(`#e4a353`)
//                        .setDescription(`Creating a role...`)
//                    let roleEmbedMessage = message.channel.send({
//                        embeds: [roleEmbed]
//                    })
//                    await message.guild.roles.create({
//                        name: `${roleName}`,
//                        color: `${roleColour}`,
//                        icon: `${roleIconURL}`,
//                        position: 38
//                    }).then((role) => {
//                        roleID = role.id
//                    }).catch((err) => {
//                        let roleEmbed2 = new MessageEmbed()
//                            .setColor(`#e4a353`)
//                            .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                        roleEmbedMessage.edit({
//                            embeds: [roleEmbed2]
//                        })
//                        return console.log(err)
//                    })
//                    let newData = new BoosterMember({
//                        MemberID: `${message.author.id}`,
//                        RoleID: `${roleID}`,
//                        GuildID: `${message.guild.id}`,
//                        ClientID: `${client.user.id}`
//                    })
//                    newData.save().catch((err) => {
//                        let roleEmbed2 = new MessageEmbed()
//                            .setColor(`#e4a353`)
//                            .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                        roleEmbedMessage.edit({
//                            embeds: [roleEmbed2]
//                        })
//                        return console.log(err)
//                    });
//                    message.member.roles.add(roleID);
//                    let roleEmbed2 = new MessageEmbed()
//                        .setColor(`${roleColour}`)
//                        .setDescription(`The role <@&${roleID}> has been created and applied to <@${message.author.id}>`)
//                    return roleEmbedMessage.edit({
//                        embeds: [roleEmbed2]
//                    })
//                } else if (data) {
//                    let roleID = 0
//                    let dataRole = await message.guild.roles.fetch(`${data.RoleID}`)
//                    let roleEmbed = new MessageEmbed()
//                        .setColor(`#e4a353`)
//                        .setDescription(`Creating a role...`)
//                    let roleEmbedMessage = await message.channel.send({
//                        embeds: [roleEmbed]
//                    })
//                    if (!dataRole) {
//                        await BoosterMember.findOneAndRemove({
//                            MemberID: `${message.author.id}`,
//                            GuildID: `${message.guild.id}`,
//                            ClientID: `${client.user.id}`
//                        })
//                        await message.guild.roles.create({
//                            name: `${roleName}`,
//                            color: `${roleColour}`,
//                            icon: `${roleIconURL}`,
//                            position: 38
//                        }).then((role) => {
//                            roleID = role.id
//                        }).catch((err) => {
//                            let roleEmbed2 = new MessageEmbed()
//                                .setColor(`#e4a353`)
//                                .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                            roleEmbedMessage.edit({
//                                embeds: [roleEmbed2]
//                            })
//                            return console.log(err)
//                        })
//                        let newData = new BoosterMember({
//                            MemberID: `${message.author.id}`,
//                            RoleID: `${roleID}`,
//                            GuildID: `${message.guild.id}`,
//                            ClientID: `${client.user.id}`
//                        })
//                        newData.save().catch((err) => {
//                            let roleEmbed2 = new MessageEmbed()
//                                .setColor(`#e4a353`)
//                                .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                            roleEmbedMessage.edit({
//                                embeds: [roleEmbed2]
//                            })
//                            return console.log(err)
//                        });
//                        message.member.roles.add(roleID);
//                        let roleEmbed2 = new MessageEmbed()
//                            .setColor(`${roleColour}`)
//                            .setDescription(`The role <@&${roleID}> has been created and applied to <@${message.author.id}>`)
//                        return roleEmbedMessage.edit({
//                            embeds: [roleEmbed2]
//                        })
//                    } else if (dataRole) {
//                        let role = await message.guild.fetch(`${data.RoleID}`).catch(() => {})
//                        role.delete().catch((err) => console.log(err))
//                        await BoosterMember.findOneAndRemove({
//                            MemberID: `${message.author.id}`,
//                            GuildID: `${message.guild.id}`,
//                            ClientID: `${client.user.id}`
//                        })
//                        await message.guild.roles.create({
//                            name: `${roleName}`,
//                            color: `${roleColour}`,
//                            icon: `${roleIconURL}`,
//                            position: 38
//                        }).then((role) => {
//                            roleID = role.id
//                        }).catch((err) => {
//                            let roleEmbed2 = new MessageEmbed()
//                                .setColor(`#e4a353`)
//                                .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                            roleEmbedMessage.edit({
//                                embeds: [roleEmbed2]
//                            })
//                            return console.log(err)
//                        })
//                        let newData = new BoosterMember({
//                            MemberID: `${message.author.id}`,
//                            RoleID: `${roleID}`,
//                            GuildID: `${message.guild.id}`,
//                            ClientID: `${client.user.id}`
//                        })
//                        newData.save().catch((err) => {
//                            let roleEmbed2 = new MessageEmbed()
//                                .setColor(`#e4a353`)
//                                .setDescription(`An error occured while creating this role. Contact the developers to fix this issue.`)
//                            roleEmbedMessage.edit({
//                                embeds: [roleEmbed2]
//                            })
//                            return console.log(err)
//                        });
//                        let roleEmbed2 = new MessageEmbed()
//                            .setColor(`${roleColour}`)
//                            .setDescription(`The role <@&${roleID}> has been edited and applied to <@${message.author.id}>`)
//                        return roleEmbedMessage.edit({
//                            embeds: [roleEmbed2]
//                        })
//                    }
//                }
//            }
//        }
//    }
//}
//