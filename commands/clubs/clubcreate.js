const {
    MessageEmbed,
    WebhookClient
} = require('discord.js');
const ClubList = require(`../../database/ClubLists.js`)
const ClubInfo = require(`../../database/ClubInfo.js`)

module.exports = {
    name: `clubcreate`,
    description: `Creates a club in the server.`,
    usage: `;clubcreate`,
    aliases: [`clubcr`, 'ccre', 'ccreate'],
    async execute(message, args, client) {
        const bot = await message.guild.members.fetch(`${client.user.id}`)
        if (!message.member.permissions.has("MANAGE_CHANNELS") || !message.member.permissions.has("MANAGE_ROLES")) {
            return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_CHANNELS\` & \`MANAGE_ROLES\`.`)
        } else if (!bot.permissions.has("MANAGE_CHANNELS") || !bot.permissions.has("MANAGE_ROLES")) {
            return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_CHANNELS\` & \`MANAGE_ROLES\`.`)
        }
        let guildClubList = await ClubList.findOne({
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        if (!guildClubList) {
            return message.channel.send(`This server does not have clubs setup.`)
        } else if (guildClubList) {
            if (guildClubList.ClubEnabled == false) {
                return message.channel.send(`This server does not have clubs enabled.`)
            }
        }
        message.channel.send(`Welcome to the club creation. Please specify the owner of the club.`)
        const filter = m => m.author.id === message.author.id
        const collector = message.channel.createMessageCollector({
            filter,
            max: 6,
            time: 300000
        });
        let counter = 0
        let clubOwner = null,
            clubName = null,
            clubChannelBool = null,
            clubDescription = null,
            clubPing = null,
            confirmationEnd = null,
            clubRoleID = null
        let confirmationEmbed = new MessageEmbed()
            .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL()
            })
            .setColor(`${process.env.colour || `e4a353`}`)
            .setFooter({
                text: `Requested by: ${message.author.tag}`
            })
        collector.on('collect', async (m) => {
            if (counter === 0) {
                if (m.content.toLowerCase() === 'none') {
                    if (!message.member.permissions.has(`ADMINISTRATOR`)) {
                        message.channel.send(`You do not have the permission to create public clubs.`)
                        collector.stop();
                    }
                    clubOwner = 'none'
                    message.channel.send(`A public club will always have club pings disabled.`)
                    message.channel.send(`The club owner has been set to: \`none\`\nPlease mention the name of the club you want to create. (The club name should be between 2 and 75 characters and without spaces)`)
                    confirmationEmbed.addField(`Club Owner`, `none`)
                } else {
                    clubOwner = m.mentions.members.first() || await message.guild.members.fetch(`${m.content}`).catch(() => {})
                    if (!clubOwner) {
                        clubOwner = null
                        message.channel.send(`Please specify a valid member to become the club's owner.`)
                        collector.stop()
                    } else if (clubOwner) {
                        message.channel.send(`The club owner has been set to: <@${clubOwner.user.id}>\nPlease mention the name of the club you want to create. (The club name should be between 2 and 75 characters and without spaces)`)
                        confirmationEmbed.addField(`Club Owner`, `${clubOwner.user.tag}`)
                    }
                }
            } else if (counter === 1) {
                clubName = m.content
                if (!clubName) {
                    clubName = null
                    message.channel.send(`No club name was given. Hence the club creation has been stopped.`)
                    collector.stop();
                }
                if (guildClubList) {
                    if (guildClubList.ClubList.indexOf(clubName) != -1) {
                        clubName = null
                        message.channel.send(`This club name already exists. Please name your club something else.`)
                        collector.stop();
                    }
                }
                try {
                    if (clubName.length > 75 || clubName.includes(' ')) {
                        clubName = null
                        message.channel.send(`Please enter a club name shorter than 75 characters which does not contain spaces.\nYou can format the string with hyphens (dashes).\nExample: \`club-name\``)
                        collector.stop();
                    } else if (clubName.length < 2) {
                        clubName = null
                        message.channel.send(`Please enter a longer club name.`)
                        collector.stop();
                    } else {
                        confirmationEmbed.setTitle(`Club Name: ${clubName.toLowerCase()}`)
                        message.channel.send(`The club's name has been set to \`${clubName.toLowerCase()}\`\nEnter this club's description. (Description should be between 2 and 500 characters.)`)
                    }
                } catch {}
            } else if (counter === 2) {
                clubDescription = m.content
                if (!clubDescription) {
                    clubDescription = null
                    message.channel.send(`No club description was given. Hence the club creation has been stopped.`)
                    collector.stop();
                }
                if (clubDescription.length > 500) {
                    clubDescription = null
                    message.channel.send(`Please enter a club description shorter than 500 characters.`)
                    collector.stop();
                } else if (clubDescription.length < 2) {
                    clubDescription = null
                    message.channel.send(`Please enter a longer club description.`)
                    collector.stop();
                }
                confirmationEmbed.setDescription(`Club Description: ${clubDescription}`)
                message.channel.send(`The club's description has been set.`)
                if (guildClubList) {                    
                    if (guildClubList.ClubCategoryID == 'null' || !guildClubList.ClubCategoryID) {
                        counter++
                        clubChannelBool = false
                        message.channel.send(`Does this club allow user pings? (y/n)`)
                    } else if (guildClubList.ClubCategoryID != 'null') {
                        let clubCat = await message.guild.channels.fetch(`${guildClubList.ClubCategoryID}`)
                        if (clubCat) {
                            if (clubCat.type == 'GUILD_CATEGORY') {
                                message.channel.send(`Does this club need a club channel? (y/n)`)
                            } else {
                                counter++
                                clubChannelBool = false
                                message.channel.send(`Could not find the club category defined when the club system was setup.\nKindly setup the club system with \`;clubenable\` again to make club channels.\nDoes this club allow user pings? (y/n)`)
                            }
                        } else if (!clubCat) {
                            counter++
                            clubChannelBool = false
                            message.channel.send(`Could not find the club category defined when the club system was setup.\nKindly setup the club system with \`;clubenable\` again to make club channels.\nDoes this club allow user pings? (y/n)`)
                        }
                    }
                }
            } else if (counter === 3) {
                if (m.content.toLowerCase().startsWith(`y`)) {
                    message.channel.send(`The club **will** have a club channel.\nDoes this club allow user pings? (y/n)`)
                    clubChannelBool = true
                    confirmationEmbed.addField(`Requires club channel?`, `${clubChannelBool.toString().charAt(0).toUpperCase() + clubChannelBool.toString().slice(1)}`, true)
                } else if (m.content.toLowerCase().startsWith(`n`)) {
                    message.channel.send(`The club **will not** have a club channel.\nDoes this club allow user pings? (y/n)`)
                    clubChannelBool = false
                    confirmationEmbed.addField(`Requires club channel?`, `${clubChannelBool.toString().charAt(0).toUpperCase() + clubChannelBool.toString().slice(1)}`, true)
                } else if (!m.content.toLowerCase().startsWith(`y`) && !m.content.toLowerCase().startsWith(`n`)) {
                    clubChannelBool = `undefined`
                    message.channel.send(`The input provided was not valid.`)
                    collector.stop();
                } else {
                    clubChannelBool = `undefined`
                    message.channel.send(`The input provided was not valid.`)
                    collector.stop();
                }
            } else if (counter === 4) {                
                if (m.content.toLowerCase().startsWith(`y`)) {
                    message.channel.send(`The club **will** allow users to be pinged.`)
                    clubPing = true
                    confirmationEmbed.addField(`Allows club pings?`, `${clubPing.toString().charAt(0).toUpperCase() + clubPing.toString().slice(1)}`, true)
                    message.channel.send({
                        content: `Confirm? (Y/N)`,
                        embeds: [confirmationEmbed]
                    })
                } else if (m.content.toLowerCase().startsWith(`n`)) {
                    message.channel.send(`The club **will not** allow users to be pinged.`)
                    clubPing = false
                    confirmationEmbed.addField(`Allows club pings?`, `${clubPing.toString().charAt(0).toUpperCase() + clubPing.toString().slice(1)}`, true)
                    message.channel.send({
                        content: `Confirm? (Y/N)`,
                        embeds: [confirmationEmbed]
                    })
                } else if (!m.content.toLowerCase().startsWith(`y`) && !m.content.toLowerCase().startsWith(`n`)) {
                    clubPing = `undefined`
                    message.channel.send(`The input provided was not valid.`)
                    collector.stop();
                } else {
                    clubPing = `undefined`
                    message.channel.send(`The input provided was not valid.`)
                    collector.stop();
                }
            } else if (counter === 5) {
                if (m.content.toLowerCase().startsWith(`y`)) {
                    confirmationEnd = 1                    
                    collector.stop();
                } else if (m.content.toLowerCase().startsWith(`n`)) {
                    confirmationEnd = 0
                    message.channel.send(`The club creation has been stopped. The club will not be created.`)
                    collector.stop();
                } else if (!m.content.toLowerCase().startsWith(`y`) && !m.content.toLowerCase().startsWith(`n`)) {
                    confirmationEnd = 0
                    message.channel.send(`No confirmation was given. Hence the club creation has been stopped.`)
                    collector.stop();
                }
            }
            counter++
            collector.resetTimer();
        });
        collector.on(`end`, async () => {
            if (clubOwner && clubName && clubDescription && clubChannelBool != `undefined` && clubPing != `undefined` && confirmationEnd != 0) {
                let clubChannel;
                if (clubChannelBool) {}
                if (clubChannelBool.toString() == `true`) {
                    if (guildClubList.ClubCategoryID == `null`) {
                        return message.channel.send(`There was an error fetching the club's category channel. Please set up the club system again. Channels cannot be present for clubs in this server.`)
                    }
                    let clubCategory = await message.guild.channels.fetch(`${guildClubList.ClubCategoryID}`).catch(() => {})
                    if (!clubCategory) {
                        return message.channel.send(`There was an error fetching the club's category channel. Please set up the club system again.`)
                    }
                    let clubRole = await message.guild.roles.create({
                        name: `${clubName.toLowerCase()}`
                    }).then((role) => clubRoleID = role.id)
                    let clubChannelObj = await message.guild.channels.create({
                        name: `${clubName}`,
                        topic: `${clubDescription.slice(0, 500)}`,
                        parent: clubCategory
                    }).then(async (channel) => {
                        clubChannel = channel.id
                        await channel.permissionOverwrites.edit(message.guild.id, {
                            VIEW_CHANNEL: false
                        })
                        await channel.permissionOverwrites.edit(clubRole, {
                            VIEW_CHANNEL: true
                        })
                    })                    
                    if (clubOwner != 'none') await clubOwner.roles.add(clubRole)
                } else if (clubChannelBool.toString() == `false`) {
                    clubChannel = null
                    clubRoleID = null
                }                
                if (guildClubList.ClubOwnerRole) {
                    let clubOwnerRole = await message.guild.roles.fetch(`${guildClubList.ClubOwnerRole}`)
                    if (clubOwnerRole && clubOwner != 'none') {
                        await clubOwner.roles.add(clubOwnerRole)
                    }
                }
                let clubArr = guildClubList.ClubList
                clubArr.push(`${clubName.toLowerCase()}`)                
                if (clubOwner === 'none') {
                    let newData = new ClubInfo({
                        ClubOwnerID: `${clubOwner}`,
                        ClubName: `${clubName.toLowerCase()}`,
                        ClubDescription: `${clubDescription}`,
                        ClubChannelID: `${clubChannel}`,
                        ClubRoleID: `${clubRoleID}`,
                        GuildID: `${message.guild.id}`,
                        ClubPingBool: false,
                        MembersList: [],
                        ClientID: `${client.user.id}`
                    })
                    await newData.save();
                } else {
                    let newData = new ClubInfo({
                        ClubOwnerID: `${clubOwner.user.id}`,
                        ClubName: `${clubName.toLowerCase()}`,
                        ClubDescription: `${clubDescription}`,
                        ClubChannelID: `${clubChannel}`,
                        ClubRoleID: `${clubRoleID}`,
                        GuildID: `${message.guild.id}`,
                        ClubPingBool: clubPing,
                        MembersList: [`${clubOwner.user.id}`],
                        ClientID: `${client.user.id}`
                    })
                    await newData.save();
                }
                await ClubList.findOneAndUpdate({
                    GuildID: `${message.guild.id}`,
                    ClientID: `${client.user.id}`
                }, {
                    ClubList: clubArr
                })
                return message.channel.send({content: `The club has been created!`, embeds: [confirmationEmbed]})
            } else if (confirmationEnd == 0) {
                return
            } else {
                return message.channel.send({content: `The club creation has ended as there was some missing data regarding the club. Kindly repeat the process again.`})
            }
        })
    }
}