const {MessageEmbed} = require (`discord.js`)

module.exports = {
    name: `massspank`,
    description: `Spanks the specified members and mutes them for 1 minute.`,
    aliases: [`mspank`],
    usage: `;massspank @Mention(s)\`or \`;massspank <User-ID(s)>`,
    async execute (message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`);
        if (!message.member.permissions.has("MODERATE_MEMBERS")) {
            try {
                message.member.timeout(60000, "No perms :)").catch(() => {
                    return;
                })
            } catch (err) {};
            const permerror = new MessageEmbed()
                .setColor("#e4a353")
                .setTitle(`You got spanked instead.`)
                .setTimestamp();
            return message.reply({
                embeds: [permerror]
            });
        } else if (!bot.permissions.has(`MODERATE_MEMBERS`)) {
            return message.channel.send(`No perms :(`)
        };
        let membersSpank = await message.mentions.members;

        if (membersSpank.size === 0) {
            let i = 0
            let stringEmbed = ``
            for (let memberID of args) {
                let memberSpank = await message.guild.members.fetch(`${memberID}`).catch(() => {});
                if (!memberSpank) {
                    continue
                } else if (memberSpank) {
                    if (memberSpank.roles.highest.position > bot.roles.highest.position) {
                        i += 1
                        stringEmbed += `\n**${i}.** <@!${memberSpank.user.id}>`
                        continue
                    } else if (memberSpank.roles.highest.position > message.member.roles.highest.position) {
                        i += 1
                        stringEmbed += `\n**${i}.** <@!${memberSpank.user.id}>`
                        continue
                    };
                    try {
                        await memberSpank.timeout(60000, `Spank`).then(() => {
                            i += 1
                            stringEmbed += `\n**${i}.** <@!${memberSpank.user.id}>`
                        }).catch(() => {})
                    } catch (err) {
                        console.log(err);
                    };
                }
            }
            if (i === 0) {
                return message.channel.send(`No members were spanked.\nSyntax: \`;massspank @Mention(s)\` or \;massspank <User-ID(s)>\``);
            } else if (i >= 1) {
                let spankSuccessEmbed = new MessageEmbed()
                    .setColor("#e4a353")                    
                    .setDescription(`**${i}** member(s) have been spanked! These are the user(s) who were acting weird:${stringEmbed}`)
                    .setTimestamp();

                return await message.channel.send({
                    embeds: [spankSuccessEmbed]
                });
            }
        } else if (membersSpank.size != 0) {
            let i = 0
            let stringEmbed = ``
            for (let memberSpankID of membersSpank) {
                let memberSpank = await message.guild.members.fetch(`${memberSpankID[0]}`).catch(() => {});
                if (memberSpank.roles.highest.position > bot.roles.highest.position) {
                    i += 1
                    stringEmbed += `\n**${i}.** <@!${memberSpank.user.id}>`
                    continue
                } else if (memberSpank.roles.highest.position > message.member.roles.highest.position) {
                    i += 1
                    stringEmbed += `\n**${i}.** <@!${memberSpank.user.id}>`
                    continue
                };
                try {
                    await memberSpank.timeout(60000, `Spank`).then(() => {
                        i += 1
                        stringEmbed += `\n**${i}.** <@!${memberSpank.user.id}>`
                    }).catch(() => {})
                } catch (err) {
                    console.log(err);
                };
            }
            if (i === 0) {
                return message.channel.send(`No members were spanked.\nSyntax: \`;massspank @Mention(s)\` or \;massspank <User-ID(s)>\``);
            } else if (i >= 1) {
                let spankSuccessEmbed = new MessageEmbed()
                    .setColor("#e4a353")
                    .setDescription(`**${i}** member(s) have been spanked! These are the user(s) who were acting weird:${stringEmbed}`)
                    .setTimestamp();
                return await message.channel.send({
                    embeds: [spankSuccessEmbed]
                });
            }
        }

    }
}