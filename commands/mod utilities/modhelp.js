const {MessageEmbed} = require('discord.js');
const fs = require("fs");
module.exports = {
    name: `modhelp`, 
    description: `Lists admin related commands and provides information if command is specified.`, 
    usage: `;modhelp or ;modhelp <command>`,
    async execute (message, args, client, Discord) {
        if (!message.member.permissions.has("MODERATE_MEMBERS")) return;

        if (!args [0]) {
            const page1 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor(`${process.env.colour}`)
            .setTitle(`Hidden Mod Commands.`)
            .setDescription(`\`;embed\`: Sends an embed with the arguments specified or with the .txt or .json file(s) in the message.
            \`;editembed\`: Edits the contents of a message with the .txt or .json file in the message.
            \`;modhelp\`: Lists mod related commands and provides information if command is specified.
            \`;modreply\`: Replies to a user who sent the modmail.
            \`;newchp\`: Sends an embed to the new chapter channel.
            \`;talk\`: Sends a message to a channel via the bot. Not to be overused as it might be against Discord TOS.`)
            return message.channel.send({embeds: [page1]})
        } else {
            const commHelp = message.content.slice(10).trim().split(/ +/);
            const commandName = commHelp.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


            let hiddenCommands = ['talk', 'newchp', 'modreply', 'modmail', 'replymodmail', 'replymod', 'reply', `modhelp`]
            for (let i = 0; i < hiddenCommands.length; i++) {
                let comm = hiddenCommands[i]
                if (!command) return message.channel.send(`This command does not exist.`)
                if (commandName === comm) {
                    try {
                        const helpSpecific = new MessageEmbed()
                            .setAuthor({
                                name: client.user.username,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setColor(`${process.env.colour}`)
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
    }
}