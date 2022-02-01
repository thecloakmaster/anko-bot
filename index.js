const Discord = require('discord.js');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_PRESENCES" ] });

const fs = require ('fs');
const prefix = ';'

client.once('ready', () => {
	console.log('Ready!');
});

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.on('guildMemberAdd', member => {
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

client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


	if (!command) return;

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}

});

client.login(process.env.token);