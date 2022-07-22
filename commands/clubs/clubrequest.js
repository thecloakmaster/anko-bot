const {
    MessageEmbed,
    WebhookClient
} = require('discord.js');
const ClubList = require(`../../database/ClubLists.js`)

module.exports = {
    name: `clubrequest`,
    description: `Request a club to be created in the server.`,
    usage: `;clubrequest`,
    aliases: [`clubreq`, 'creq', 'crequest'],
    cooldown: 10000,
    async execute(message, args, client) {
        const filter = m => m.author.id === message.author.id
        const collector = message.channel.createMessageCollector({
            filter,
            max: 5,
            time: 300000
        });
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
        let counter = 0
        let clubName = null,
            clubChannelBool = null,
            clubDescription = null,
            clubPing = null,
            confirmationEnd = null
        const requestHook = new WebhookClient({
            id: `986343873930481715`,
            token: `52uJVdSDYsdeucHGRz55YxcU1SvBRMjCUa3MbnCaNJbQsMuxtsCzTO-W_MrkcI0AbPzv`
        })
        message.channel.send(`Welcome to the club request procedure. Please mention the name of the club you want to request. (The club name should be between 2 and 75 characters and without spaces)`)
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
                clubName = m.content
                if (!clubName) {
                    clubName = null
                    message.channel.send(`No club name was given. Hence the club request procedure has been stopped.`)
                    collector.stop();
                }
                if (guildClubList.length > 0) {
                    if (guildClubList.ClubList.indexOf(clubName.toLowerCase()) != -1) {
                        clubName = null
                        message.channel.send(`This club name already exists. Please name your club something else.`)
                        collector.stop();
                    }
                }
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
            } else if (counter === 1) {
                clubDescription = m.content
                if (!clubDescription) {
                    clubDescription = null
                    message.channel.send(`No club description was given. Hence the club request procedure has been stopped.`)
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
                        message.channel.send(`Does this club allow user pings? (y/n)`)
                    } else if (guildClubList.ClubCategoryID != 'null' && guildClubList.ClubCategoryID) {
                        let clubCat = await message.guild.channels.fetch(`${guildClubList.ClubCategoryID}`)
                        if (clubCat) {
                            if (clubCat.type == 'GUILD_CATEGORY') {
                                message.channel.send(`Does this club need a club channel? (y/n)`)
                            } else {
                                counter++
                                message.channel.send(`Does this club allow user pings? (y/n)`)
                            }                            
                        } else if (!clubCat) {
                            counter++
                            message.channel.send(`Does this club allow user pings? (y/n)`)
                        }
                    }
                }
            } else if (counter === 2) {
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
            } else if (counter === 3) {                
                if (m.content.toLowerCase().startsWith(`y`)) {
                    message.channel.send(`The club **will** allow users to be pinged.`)
                    clubPing = true
                    confirmationEmbed.addField(`Allows club pings?`, `${clubPing.toString().charAt(0).toUpperCase() + clubPing.toString().slice(1)}`, true)
                    message.channel.send({content: `Confirm? (Y/N)`, embeds: [confirmationEmbed]})
                } else if (m.content.toLowerCase().startsWith(`n`)) {
                    message.channel.send(`The club **will not** allow users to be pinged.`)
                    clubPing = false
                    confirmationEmbed.addField(`Allows club pings?`, `${clubPing.toString().charAt(0).toUpperCase() + clubPing.toString().slice(1)}`, true)
                    message.channel.send({content: `Confirm? (Y/N)`, embeds: [confirmationEmbed]})
                } else if (!m.content.toLowerCase().startsWith(`y`) && !m.content.toLowerCase().startsWith(`n`)) {
                    clubPing = `undefined`
                    message.channel.send(`The input provided was not valid.`)
                    collector.stop();
                } else {
                    clubPing = `undefined`
                    message.channel.send(`The input provided was not valid.`)
                    collector.stop();
                }
            } else if (counter === 4) {
                if (m.content.toLowerCase().startsWith(`y`)) {
                    confirmationEnd = 1                    
                    await requestHook.send({embeds: [confirmationEmbed]}).then(() => {return message.channel.send(`The club request has been made. Please wait till your club request gets reviewed. You will be notified shortly.`)})
                } else if (m.content.toLowerCase().startsWith(`n`)) {
                    confirmationEnd = 0
                    message.channel.send(`The club request procedure has been stopped. The club will not be requested.`)
                    collector.stop();
                } else if (!m.content.toLowerCase().startsWith(`y`) && !m.content.toLowerCase().startsWith(`n`)) {
                    confirmationEnd = 0
                    message.channel.send(`No confirmation was given. Hence the club request procedure has been stopped.`)
                    collector.stop();
                }
            }
            counter++
            collector.resetTimer();
        });
        collector.on(`end`, () => {
            return message.channel.send(`The club request procedure has ended.`)
        })
    }
}