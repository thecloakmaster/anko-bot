const {MessageEmbed} = require("discord.js");

module.exports = {
    name: `massban`,
    description: `Bans the group of users specified.`,
    aliases:[`mban`],
    usage: `;massban @Mention(s) \` or \`;massban <User-ID(s)>`,
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        } else if (!bot.permissions.has("BAN_MEMBERS")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`BAN_MEMBERS\`.`)
        }
        if (!args[0]) {
            return message.channel.send(`Please specify valid user(s) or user-ID(s) to be banned.\nSyntax: \`;massban @Mention(s) \` or \`;massban <User-ID(s)>\`.`)
        }
        let membersBanMentions = message.mentions.users
        if (membersBanMentions.size === 0) {
            let i = 0
            for (let memberBan of args) {
                let userProp = await message.client.users.fetch(`${memberBan}`).catch(() => {})
                if (!userProp) {
                    continue
                } else if (userProp) {
                    let memberToBeWas = await message.guild.members.fetch(`${userProp.id}`).catch(() => {})
                    if (memberToBeWas) {
                        if (memberToBeWas.roles.highest.position > bot.roles.highest.position) {
                            continue
                        } else if (memberToBeWas.roles.highest.position > message.member.roles.highest.position) {
                            continue
                        }
                        if (memberToBeWas.permissions.has("BAN_MEMBERS")) {
                            continue
                        } else if (!memberToBeWas.bannable) {
                            continue
                        };
                    };
                    try {
                        const banList = await message.guild.bans.fetch(`${userProp.id}`).catch(() => {});
                        if (banList) {
                            continue
                        }
                    } catch (err) {}
                    if (await message.guild.members.fetch(`${userProp.id}`).catch(() => {}) && await message.guild.members.fetch(`${userProp.id}`).bannable) {
                        try {
                            let banEmbed = new MessageEmbed()
                                .setColor(`${process.env.colour}`)
                                .setTitle(`You were banned from ${message.guild.name}.`)
                                .setDescription(`Reason: No reason provided.`)
                                .setTimestamp();

                            await userProp.send({
                                embeds: [banEmbed]
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    };
                    try {
                        await message.guild.members.ban(userProp, {
                            days: 2,
                            reason: `No reason provided.`
                        });
                        i += 1
                    } catch (err) {
                        console.log(err)
                        continue
                    }
                }
            }
            if (i === 0) {
                message.channel.send(`No members/users were banned.\nSyntax: \`;massban @Mention(s) \` or \`;massban <User-ID(s)>\`.`)
            } else if (i >= 1) {
                let banSuccessEmbed = new MessageEmbed()
                    .setColor(`${process.env.colour}`)
                    .setTitle(`Massban successful.`)
                    .setDescription(`**${i}** user(s) have been banned from this server.`)
                    .setTimestamp();

                return await message.channel.send({embeds: [banSuccessEmbed]})
            }
        } else if (membersBanMentions.size != 0) {
            let i = 0
            for (let memberBan of membersBanMentions) {
                await message.guild.members.ban(memberBan[0], {
                    days: 2,
                    reason: "No reason provided."
                }).then((member) => {i += 1}).catch((err) => console.log(err));
            }
            if (i === 0) {
                message.channel.send(`No members/users were banned.\nSyntax: \`;massban @Mention(s) \` or \`;massban <User-ID(s)>\`.`)
            } else if (i >= 1) {
                let banSuccessEmbed = new MessageEmbed()
                    .setColor(`${process.env.colour}`)
                    .setTitle(`Massban successful.`)
                    .setDescription(`**${i}** user(s) have been banned from this server.`)
                    .setTimestamp();

                return await message.channel.send({
                    embeds: [banSuccessEmbed]
                })
            }
        }
        
        
    }
}