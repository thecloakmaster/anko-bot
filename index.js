const Discord = require('discord.js');

const client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_PRESENCES", "DIRECT_MESSAGES"], partials: ["CHANNEL", "GUILD_MEMBER"]
});

const twitFunction = require(`./functions/twit.js`)
twitFunction.execute();

const unmuteCheck = require(`./functions/unmuteCheck.js`)
//setInterval(unmuteCheck.execute(client), 30*60*1000)
setInterval(async function () {
	try {
		let muteRole = await MuteRole.find()
		for (const muteRoleLoop of muteRole) {
			let guildID = muteRoleLoop.GuildID;
			let guild = await client.guilds.fetch(`${guildID}`).catch(() => {});
			let muteDeletes = await MutedMember.find({
				GuildID: guildID
			})
			if (!guild) {
				await MuteRole.findOneAndRemove({
					GuildID: guildID
				})
				for (memberMuteDelete in muteDeletes) {
					await MutedMember.findOneAndRemove({
						GuildID: guildID
					})
				}
			}
			let mutedRole = muteRoleLoop.MuteRoleID;
			let guildMuteRole = await guild.roles.fetch(`${mutedRole}`).catch(() => {});
			if (!guildMuteRole) {
				await MuteRole.findOneAndRemove({
					GuildID: guildID,
					MuteRoleID: mutedRole
				})
				for (memberMuteDelete in muteDeletes) {
					await MutedMember.findOneAndRemove({
						UserID: memberMuteDelete.UserID,
						GuildID: guildID
					})
				}
			}
			let mutedMember = await MutedMember.find({
				GuildID: guildID
			})
			for (const mutedMemberLoop of mutedMember) {
				let member = await guild.members.fetch(mutedMemberLoop.UserID).catch(() => {});
				if (!member) {
					if (Date.now() >= mutedMemberLoop.LastsTill) {
						await MutedMember.findOneAndRemove({
							UserID: mutedMemberLoop.UserID,
							GuildID: mutedMemberLoop.GuildID,
							LastsTill: mutedMemberLoop.LastsTill
						})
					}
					continue;
				} else if (member) {
					if (Date.now() >= mutedMemberLoop.LastsTill) {
						await MutedMember.findOneAndRemove({
							UserID: mutedMemberLoop.UserID,
							GuildID: mutedMemberLoop.GuildID,
							LastsTill: mutedMemberLoop.LastsTill
						})
					}
					await member.roles.remove(mutedRole).catch((err) => console.log(err))
				}
			}
		}
	} catch (err) {
		console.log(err)
	}
}, 30 * 60 * 1000)

client.commands = new Discord.Collection();
client.handlers = new Discord.Collection();
[`command_handler`, `event_handler`].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord);
})

client.login(process.env.token);

process.on(`unhandledRejection`, err => {
	console.log('Unknown error occured:\n')
	console.log(err)
	process.exit()
})