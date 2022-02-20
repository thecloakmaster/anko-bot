const {
    MessageEmbed,
    Guild,
    Message,
    MessageButton
} = require('discord.js');

const paginationEmbed = require('discordjs-button-pagination')

const {
    readdirSync
} = require("fs");

module.exports = {
    name:'help',
    description: 'Lists all the commands.',
    usage: ";help <command name> or ;help",
    async execute (message, args, client, Discord, bot) {

        client.commands = new Discord.Collection();
        
        const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);

            client.commands.set(command.name, command);
        }
        
        const owner = await message.client.users.fetch("423792631458562058").catch(() => {});

        if (!args[0]){
            const page2 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor("#e4a353")
            .setDescription(`**Bot Manual - Page 2 of 2**`)
            .addField(`Fun`, `\`;slap\`: Slaps the specified user for whatever the reason may be.
            \`;spank\`: Spanks the specified member and mutes them for 1 minute.`)
            .addField(`Moderation`, `\`;archivepins\`: Takes pins from a channel and archives them into embeds. 
            \`;ban\`: Bans the specified user.
            \`;kick\`: Kicks the specified member.
            \`;lock\`: Locks the channel.
            \`;mute\`: Mutes the specified member.
            \`;purge\`: Deletes the amount of messages specified.
            \`;unban\`: Unbans the specified user.
            \`;unlock\`: Unlocks the channel.
            \`;unmute\`: Unmutes the specified user.
            `)
            .addField(`Command Usage`, `Use \`;help <command name>\` for information about the command or use \`;help\` for the list of commands.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()}`});
            
            const page1 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor("#e4a353")
            .setDescription(`**Bot Manual - Page 1 of 2**`)
            .addField(`Utility`, `\`;avatar\`: Sends the avatar URL of the tagged user, or your own avatar.
            \`;customserverpfp\`: Sends the server specific profile picture of the member.
            \`;help\`: Sends commands' list and their info.
            \`;quote\`: Fetches previously sent message and sends it in an embed.
            \`;serverbanner\`: Sends the server banner.
            \`;servericon\`: Sends the server icon.
            \`;steal\`: Steals all the emotes from a single message and sends them to you via DMs.
            \`;whois\`: Gives information about the member specified or yourself.`)
            .addField(`Fun`, `\`;hug\`: Hugs the specified user and makes them feel a little better.
            \`;pat\`: Pats the specified user and makes them feel a little better.`)
            .addField(`Command Usage`, `Use \`;help <command name>\` for information about the command or use \`;help\` for the list of commands.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()}`});

            const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Previous')
                .setStyle('DANGER');

            const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Next')
                .setStyle('SUCCESS');

            const buttons = [button1, button2]

            timeout = 300000;
            const pages = [page1, page2]
            paginationEmbed(message, pages, buttons, timeout)
            
        } else {
            const commHelp = message.content.slice(5).trim().split(/ +/);
            const commandName = commHelp.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


            hiddenCommands = ['talk', 'newchp']
            for (let i = 0; i < hiddenCommands.length; i++) {
                let comm = hiddenCommands[i]
                if (!command || commandName === comm) return message.reply("This command does not exist.");
            }
	        

            try{
                const helpSpecific = new MessageEmbed()
                    .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
                    .setColor("#e4a353")
                    .setTitle(`Command: \`;${command.name}\``)
                    .addField(`Description:`, `${command.description}`)
                    .addField(`Aliases`, `\`${command.aliases || "No other aliases"}\``)
                    .addField(`Usage`, `\`${command.usage}\``);
                return message.channel.send({
                    embeds: [helpSpecific]
                })
            } catch (err) {
                console.log(err)
            }
        }
    }
}