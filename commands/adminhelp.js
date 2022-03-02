const {
    MessageEmbed,
    Guild,
    Message
} = require('discord.js');
const {
    readdirSync
} = require("fs");
module.exports = {
    name: `adminhelp`, 
    description: `Lists admin related commands and provides information if command is specified.`, 
    usage: `;adminhelp or ;adminhelp <command>`,
    async execute (message, args, client, Discord) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        client.commands = new Discord.Collection();

        const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);

            client.commands.set(command.name, command);
        }

        if (!args [0]) {
            const page1 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor("#e4a353")
            .setTitle(`Hidden Mod Commands.`)
            .setDescription(`\`;adminhelp\`: Lists mod related commands and provides information if command is specified.
            \`;modreply\`: Replies to a user who sent the modmail.
            \`;newchp\`: Sends an embed to the new chapter channel.
            \`;talk\`: Sends a message to a channel via the bot. Not to be overused as it might be against Discord TOS.`)
        } else {
            const commHelp = message.content.slice(10).trim().split(/ +/);
            const commandName = commHelp.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


            hiddenCommands = ['talk', 'newchp', 'modreply', 'modmail', 'replymodmail', 'replymod', 'reply', `adminhelp`]
            for (let i = 0; i < hiddenCommands.length; i++) {
                let comm = hiddenCommands[i]
                if (!command) return message.channel.send(`This command does not exist.`)
                if (command === comm) {
                    try {
                        const helpSpecific = new MessageEmbed()
                            .setAuthor({
                                name: client.user.username,
                                iconURL: client.user.displayAvatarURL()
                            })
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
                } else return;
            }


            
        }
    }
}