const Discord = require('discord.js');

const client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_PRESENCES", "DIRECT_MESSAGES"], partials: ["CHANNEL"]
});

const fs = require('fs');
const prefix = ';'

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity("DMs for modmail.", {
		type: `LISTENING`
	})
});

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.on('guildMemberAdd', member => {
	if (member.user.bot === true) return;
	const welcomeEmbed = new Discord.MessageEmbed()
		.setColor("#00ffff")
		.setTitle(`Welcome to Yofukashi no Uta!`)
		.setDescription(`Be sure to check out <#908021113504825358> and <#908021113504825361> before you start chatting. Enjoy your stay here!`)
		.setImage(`https://images-ext-1.discordapp.net/external/c5ZtuDzOH1WQlK-1YTGBEvxffw2PhCuWKb77dYjIcYY/https/media.discordapp.net/attachments/912098426924183602/920996161878392882/N47QgJE.gif`)
		.setFooter({
			text: `There are currently ${member.guild.memberCount} vampires here.`
		})

	const channel = member.guild.channels.cache.get('908021113886482434')
	channel.send({
		content: `Welcome to the server <@${member.user.id}>!`,
		embeds: [welcomeEmbed]
	})
})

const Twit = require('twit')

const T = new Twit({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token: process.env.access_token,
	access_token_secret: process.env.access_token_secret,
	timeout_ms: 60 * 1000,
	strictSSL: true,
})

const stream = T.stream('statuses/filter', {
	follow: ['449609521', '1453395613282811911']
})

const feedHook = new Discord.WebhookClient({
	id: `909898898439565434`,
	token: `nSZjjY-7Gu37DSgRMZGSTHm6UnKSuSZ9W30fL85FZ31VpHmUi43NKrlDeHo5rXP-nius`
})

const modHook = new Discord.WebhookClient({
	id: `948301349802627122`,
	token: `bjYNMGYiTu1qSg--vzaw-NL9j32SUoKjFNFouL3QtC6nbjLLagU2k61cryFvyw2335Bt`
})

stream.on('tweet', function (tweet) {
	if (tweet.user.id === 449609521 || tweet.user.id === 1453395613282811911) {
		if (!tweet.retweeted_status) {
			let url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
			try {
				feedHook.send(`${tweet.user.screen_name} tweeted this ${url}`).catch(err => {
					console.log(err)
				})
			} catch (error) {
				console.error(error);
			}
		} else {
			let url = "https://twitter.com/" + tweet.retweeted_status.user.screen_name + "/status/" + tweet.retweeted_status.id_str;
			try {
				feedHook.send(`${tweet.user.screen_name} retweeted this ${url}`).catch(err => {
					console.log(err)
				})
			} catch (error) {
				console.error(error);
			}
		}
	}

})

stream.on('error', (e) => {
	console.log(e);
})

client.on('messageCreate', message => {
	if (message.channel.type === 'DM') {
		if (message.author.id === client.user.id) return;
		const embed = new Discord.MessageEmbed()
			.setColor("#e4a353")
			.setTitle(`ID: [${message.author.id}]`)
			.setDescription(message.content)
			.setTimestamp();
		return modHook.send({
			embeds: [embed]
		});
	}
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


	if (!command) return;

	try {
		command.execute(message, args, client, Discord);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}

});

client.login(process.env.token);

process.on('unhandledRejection', err => {
	console.log('Unknown error occured:\n')
	console.log(err)
})