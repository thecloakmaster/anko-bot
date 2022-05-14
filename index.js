const Discord = require('discord.js');

const client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_PRESENCES", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS"], partials: ["CHANNEL", "GUILD_MEMBER", "REACTION"]
});

const twitFunction = require(`./functions/twit.js`)
twitFunction.execute();

const unmuteCheck = require(`./functions/unmuteCheck.js`)
unmuteCheck.execute(client)

const giveawayCheck = require(`./functions/giveawayCheck.js`)
giveawayCheck.execute(client)

client.commands = new Discord.Collection();
client.handlers = new Discord.Collection();
[`command_handler`, `event_handler`].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord);
})

client.login(process.env.token);

process.on(`unhandledRejection`, err => {
	console.log('Unknown error occured:\n')
	console.log(err)
})