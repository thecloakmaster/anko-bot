const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

const fs = require("fs");

module.exports = {
    name:'help',
    description: 'Lists all the commands and provides information if the command is specified.',
    usage: ";help <command name> or ;help",
    aliases: ['h'],
    async execute (message, args, client, Discord, bot) {

        client.commands = new Discord.Collection();
        
        const commandFolders = fs.readdirSync(`./commands`);
        
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                client.commands.set(command.name, command);
            }
        }
        
        const owner = await message.client.users.fetch("423792631458562058").catch(() => {});

        if (!args[0]){
            const page1 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor("#e4a353")
            .setDescription(`**Bot Help Catalogue - Page 1 of 4**`)
            .addField(`Utility`, `\`;avatar\`: Sends the avatar URL of the tagged user, or your own avatar.
            \`;customserverpfp\`: Sends the server specific profile picture of the member.
            \`;getrole\`: Gives a custom role to the boosters of their choice.
            \`;help\`: Lists all the commands and provides information if the command is specified.
            \`;quote\`: Fetches previously sent message and sends it in an embed.
            \`;serverbanner\`: Sends the server's banner.
            \`;servericon\`: Sends the server's icon.
            \`serversplash\`: Sends the server's splash background image.
            \`;spoiler\`: Sends the specified image/video with a spoiler tag. (You should probably also learn to use the feature in-built in Discord to spoiler tag files)
            \`;steal\`: Steals all the emotes from a single message and sends them to you via DMs.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()} | Some designs for the bot embeds are taken from Scarlett by Amash#0001`});

            const page2 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor("#e4a353")
            .setDescription(`**Bot Help Catalogue - Page 2 of 4**`)
            .addField(`Utility`, `\`;whois\`: Gives information about the member specified or yourself.`)
            .addField(`Fun`, `\`;hug\`: Hugs the specified member and makes them feel a little bit better.
            \`;kiss\`: Kisses the specified member and makes them feel a little bit better.
            \`;pat\`: Pats the specified member and makes them feel a little bit better.
            \`;slap\`: Slaps the specified member for whatever the reason may be.
            \`;spank\`: Spanks the specified member and mutes them for 1 minute.
            \`;uwuify\`: Makes your message more UwU.`)
            .addField(`Moderation`, `\`;ban\`: Bans the specified user.
            \`;clearwarns\`: Clears all the warns of the specified user.
            \`;fetchwarns\`: Fetches the warns of the specified user.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()} | Some designs for the bot embeds are taken from Scarlett by Amash#0001`});
            
            const page3 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor("#e4a353")
            .setDescription(`**Bot Help Catalogue - Page 3 of 4**`)
            .addField(`Moderation`, `\`;kick\`: Kicks the specified member.
            \`;lock\`: Locks the channel.
            \`;mute\`: Mutes the specified member.
            \`;purge\`: Deletes the amount of messages specified.
            \`;removewarn\`: Removes the specified warn of the specified member.
            \`;unban\`: Unbans the specified user.
            \`;unlock\`: Unlocks the channel.
            \`;unmute\`: Unmutes the specified member.
            \`;warn\`: Warns the specified member.`)
            .addField(`Mod Utilities`, `\`;addemote\`: Adds an emote to the server with the name and image provided.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()} | Some designs for the bot embeds are taken from Scarlett by Amash#0001`});

            const page4 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor("#e4a353")
            .setDescription(`**Bot Help Catalogue - Page 4 of 4**`)
            .addField(`Mod Utilities`, `\`;addsticker\`: Adds a sticker in the guild with the image and name provided.
            \`;archivepins\`: Takes pins from a channel and archives them into embeds.
            \`;removeemote\`: Removes an emote from the server with the name or emotes provided.
            \`;removesticker\`: Removes a sticker from the server with the sticker provided.
            \`;setmuterole\`: Sets the server's mute role.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()} | Some designs for the bot embeds are taken from Scarlett by Amash#0001`});

            const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel('Previous')
                .setStyle('SECONDARY');

            const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel('Next')
                .setStyle('SECONDARY');

            const button3 = new MessageButton()
                .setCustomId('close')
                .setLabel('Close')
                .setStyle('DANGER')

            const buttonList = [button1, button2, button3]

            const embeds = [page1, page2, page3, page4]
            let embed = 0
            const row = new MessageActionRow().addComponents(buttonList);
            const curPage = await message.channel.send({
                embeds: [embeds[embed]],
                components: [row],
            });

            const filter = (i) =>
                i.customId === buttonList[0].customId ||
                i.customId === buttonList[1].customId || 
                i.customId === buttonList[2].customId;;

            timeout = 120000
            const collector = await curPage.createMessageComponentCollector({
                filter,
                time: timeout,
            });
            collector.on("collect", async (i) => {
                switch (i.customId) {
                    case buttonList[0].customId:
                        embed = embed - 1;
                        if (embed < 0) {
                            embed = 0
                            break
                        }
                        break;
                    case buttonList[1].customId:
                        embed = embed + 1;
                        if (embed >= embeds.length) {
                            embed = embed - 1
                            break
                        }
                        break;
                    default:
                        break;
                }
                if (i.customId === buttonList[2].customId) {
                    collector.stop();
                }
                await i.deferUpdate();
                await i.editReply({
                    embeds: [embeds[embed]],
                    components: [row],
                });
                collector.resetTimer();
            });
            collector.on("end", () => {
                try {
                    let disabledRow = new MessageActionRow().addComponents(
                        buttonList[0].setDisabled(true),
                        buttonList[1].setDisabled(true),
                        buttonList[2].setDisabled(true).setLabel('Closed')
                    );
                    curPage.edit({
                        embeds: [embeds[embed]],
                        components: [disabledRow],
                    }).catch((err) => {
                        return
                    });
                } catch (err) {
                    console.log(err.code)
                }
            });
            
        } else {
            const commHelp = args[0].split(/ +/);
            const commandName = commHelp.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


            hiddenCommands = ['talk', 'newchp', 'modreply', 'modmail', 'replymodmail', 'replymod', 'reply', `adminhelp`]
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
                    .addField(`Usage`, `\`${command.usage}\``)
                    .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()} | Some designs for the bot embeds are taken from Scarlett by Amash#0001`});
                return message.channel.send({
                    embeds: [helpSpecific]
                })
            } catch (err) {
                console.log(err)
            }
        }
    }
}