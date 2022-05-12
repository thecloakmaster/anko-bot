const {MessageEmbed} = require (`discord.js`)
const ms = require(`ms`)
const giveawayInfo = require (`../../database/GiveawayInfo`)

module.exports = {
    name: 'giveaway',
	description: `Creates a giveaway.`,
	usage: `A step-by-step guided process where all the instructions will be provided. `,
	aliases: [`gway`,`gcreate`],
    async execute(message, args, client) {
		if (!message.member.permissions.has(`MANAGE_ROLES`)) {
			return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_ROLES\`.`)
		}
		message.channel.send(`Welcome to the giveaway setup. Please mention the channel you would want this giveaway to be displayed in.`)
		const filter = m => m.author.id === message.author.id
		const collector = message.channel.createMessageCollector({
			filter,
			max: 5,
			time: 60000
		});
		let counter = 0
		let time = null,
			channel = null,
			winners = null,
			prize = null,
			confirmationEnd = null,
			embedID = null
		collector.on('collect', async (m) => {
			if (counter === 0) {
				if (!m.mentions.channels.first()) {
					message.channel.send(`Please specify a valid channel.`)
					collector.stop();
				} else if (m.mentions.channels.first()) {
					channel = m.mentions.channels.first()
					message.channel.send(`The giveaway channel has been set to ${m.mentions.channels.first()}. Next, please specify the duration of this giveaway, preferably longer than 10 minutes.`)
				}
			} else if (counter === 1) {
				time = ms(m.content)
				if (!time) {
					message.channel.send(`Please specify a valid time frame.`)
					collector.stop();
				} else if (time) {
					message.channel.send(`The time duration of this giveaway has been set to \`${m.content}\`. Next, please specify the amount of winners for this giveaway.`)
				}
			} else if (counter === 2) {
				winners = parseInt(m.content)
				if (!winners) {
					message.channel.send(`Please specify a valid amount of winners.`)
					collector.stop();
				} else if (winners < 1) {
					message.channel.send(`Please specify a valid amount of winners.`)
					collector.stop();
				} else if (winners) {
					message.channel.send(`The amount of winners for this giveaway have been set to \`${winners}\`. Next, please specify the prize for this giveaway.`)
				}
			} else if (counter === 3) {
				prize = m.content
				if (!prize) {
					message.channel.send(`Please specify a prize for this giveaway.`)
					collector.stop();
				} else if (prize) {
					message.channel.send(`The prize of this giveaway has been set to \`${prize}\`.`)
					let giveawayEmbed = new MessageEmbed()
						.setAuthor({
							name: client.user.username,
							iconURL: client.user.displayAvatarURL()
						})
						.setColor(`${process.env.colour}`)
						.setTitle(`${prize}`)
						.setDescription(`Amount of winners: ${winners}`)
						.addField(`Ends in`, `<t:${Math.round((Date.now() + time)/1000)}:R>`)
						.setFooter({
							text: `Giveaway ID: GW${message.id}`
						})
					message.channel.send({content:`Confirm to start this giveaway. (Y/N)`, embeds: [giveawayEmbed]})
				}
			} else if (counter === 4) {
				if (m.content.toLowerCase().startsWith(`y`)) {
					confirmationEnd = 1
					let giveawayEmbed = new MessageEmbed()
						.setAuthor({
							name: client.user.username,
							iconURL: client.user.displayAvatarURL()
						})
						.setColor(`${process.env.colour}`)
						.setTitle(`${prize}`)
						.setDescription(`Amount of winners: ${winners}`)
						.addField(`Ends in`, `<t:${Math.round((Date.now() + time)/1000)}:R>`)
						.setFooter({
							text: `Giveaway ID: GW${message.id}`
						})
					await channel.send({
						content: `🎉 **ONGOING GIVEAWAY** 🎉`,
						embeds: [giveawayEmbed]
					}).then(async (msg) => {
						await msg.react(`🎉`)
						let newGiveaway = new giveawayInfo({
							ChannelID: `${channel.id}`,
							EmbedID: `${msg.id}`,
							GuildID: `${message.guild.id}`,
							GiveawayID: `GW${message.id}`,
							Prize: `${prize}`,
							Winners: winners,
							LastsTill: Date.now() + time,
							ClientID: `${client.user.id}`
						})
						newGiveaway.save();
					}).catch(() => {})
					await message.channel.send(`The giveaway has started.`)
				} else if (m.content.toLowerCase().startsWith(`n`)) {
					confirmationEnd = 0
					message.channel.send(`The giveaway setup has been stopped.`)
					collector.stop();
				} else if (!m.content.toLowerCase().startsWith(`y`) && !m.content.toLowerCase().startsWith(`n`)) {
					confirmationEnd = 0
					message.channel.send(`No confirmation was given. Hence the giveaway setup has been stopped.`)
					collector.stop();
				}
			}
			counter++
			collector.resetTimer();
		});
		collector.on(`end`, () => {
			if (prize && winners && time && channel && embedID && confirmationEnd === 0) {
				let newGiveaway = new giveawayInfo({
					ChannelID: `${channel.id}`,
					EmbedID: `${embedID}`,
					GuildID: `${message.guild.id}`,
					GiveawayID: `GW${message.id}`,
					Prize: `${prize}`,
					Winners: winners,
					LastsTill: Date.now() + time,
					ClientID: `${client.user.id}`
				})
				newGiveaway.save();
			}
		})
    }
}

