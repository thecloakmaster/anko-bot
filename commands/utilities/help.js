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
    async execute (message, args, client, Discord) {

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
            .setColor(`${process.env.colour}`)
            .setDescription(`**Bot Help Catalogue - Page 1 of 7**`)
            .addField(`Utility`, `\`;anime\`: Finds information about the specified anime title from AniList.
            \`;avatar\`: Get the image URL of the tagged user\'s avatar, or the image URL of your own avatar.
            \`;banner\`: Get the image URL of the tagged user\'s banner, or the image URL of your own banner.
            \`;customserverpfp\`: Sends the server specific profile picture of the member.
            \`;getrole\`: Gives a custom role to the boosters of their choice.
            \`;help\`: Lists all the commands and provides information if the command is specified.
            \`;manga\`: Grabs the requested chapter from MangaDex and sends it in the chat.
            \`;match\`: Matches two users and finds their compatibility rating.: 
            \`;md\`: Fetches a maximum of 10 series from MangaDex and shows the information about them.
            \`;mdread\`: Grabs the requested chapter of the series mentioned from MangaDex and sends it in the chat.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()}`});

            const page2 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor(`${process.env.colour}`)
            .setDescription(`**Bot Help Catalogue - Page 2 of 7**`)
            .addField(`Utility`, `\`;nextep\`: Tells you the status and airing time of the next episode of the specified anime.
            \`;quote\`: Fetches previously sent message and sends it in an embed.
            \`;reminders\`: Shows you all your reminders.
            \`;remindme\`: Sets a reminder for the specified time to remind you of the specified task.
            \`;servericon\`: Sends the server's icon.
            \`;serverbanner\`: Sends the server's banner.
            \`;serverinfo\`: Gives information about the server in which the command is executed.
            \`;serversplash\`: Sends the server's splash background image.
            \`;spoiler\`: Sends the specified image/video with a spoiler tag. (You should probably also learn to use the feature in-built in Discord to spoiler tag files)
            \`;steal\`: Steals all the emotes from a single message and sends them to you via DMs.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()}`});
            
            const page3 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor(`${process.env.colour}`)
            .setDescription(`**Bot Help Catalogue - Page 3 of 7**`)
            .addField(`Utility`, `\`;tmdb\`: Searches the TMDB database for a movie or a TV show and gives you the top rated result.
            \`;when\`: The answer to next chapter/episode when?
            \`;whois\`: Gives information about the member specified or yourself.`)
            .addField(`Fun`, `\`;hug\`: Hugs the specified member and makes them feel a little bit better.
            \`;kiss\`: Kisses the specified member and makes them feel a little bit better.
            \`;massspank\`: Spanks the specified members and mutes them for 1 minute.
            \`;pat\`: Pats the specified member and makes them feel a little bit better.
            \`;slap\`: Slaps the specified member for whatever the reason may be.            
            \`;spank\`: Spanks the specified member and mutes them for 1 minute.
            \`;tictactoe\`: Play TicTacToe in Discord with your friend with Discord buttons.`)            
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()}`});

            const page4 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor(`${process.env.colour}`)
            .setDescription(`**Bot Help Catalogue - Page 4 of 7**`)
            .addField('Fun', `\`;uwuify\`: Makes your message more UwU.`)
            .addField(`Clubs`, `\`;clubcreate\`: Creates a club in the server.
            \`;clubdelete\`: Deletes the specified club from the server.
            \`;clubdisable\`: Disables the club system in the server.
            \`;clubedit\`: Edits a club's information.
            \`;clubenable\`: Enables the club system in the server.
            \`;clubinfo\`: Gives the information of a club in the server.
            \`;clubjoin\`: Adds you as a club member in the specified club.
            \`;clubleave\`: Removes you from the specified club.
            \`;clublist\`: Lists all the clubs in the server.`)            
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()}`});

            const page5 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor(`${process.env.colour}`)
            .setDescription(`**Bot Help Catalogue - Page 5 of 7**`)
            .addField(`Clubs`, `\`;clubping\`: Pings all the members of the specified club.
            \`;clubrequest\`: Request a club to be created in the server.`)
            .addField(`Moderation`, `\`;ban\`: Bans the specified user.
            \`;clearwarns\`: Clears all the warns of the specified user.
            \`;fetchwarns\`: Fetches the warns of the specified user.
            \`;kick\`: Kicks the specified member.
            \`;lock\`: Locks the channel.
            \`;massban\`: Bans the group of users specified.
            \`;massunban\`: Unbans the group of users specified.
            \`;mute\`: Mutes the specified member.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()}`});

            const page6 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor(`${process.env.colour}`)
            .setDescription(`**Bot Help Catalogue - Page 6 of 7**`)
            .addField(`Moderation`, `\`;purge\`: Deletes the amount of messages specified.
            \`;removewarn\`: Removes the specified warn of the specified member.
            \`;unban\`: Unbans the specified user.
            \`;unlock\`: Unlocks the channel.
            \`;unmute\`: Unmutes the specified member.
            \`;warn\`: Warns the specified member.`)
            .addField(`Mod Utilities`, `\`;addemote\`: Adds an emote to the server with the name and image provided.
            \`;addsticker\`: Adds a sticker in the guild with the image and name provided.
            \`;archivepins\`: Takes pins from a channel and archives them into embeds.
            \`;giveaway\`: Creates a giveaway.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()}`});

            const page7 = new MessageEmbed()
            .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
            .setColor(`${process.env.colour}`)
            .setDescription(`**Bot Help Catalogue - Page 7 of 7**`)            
            .addField(`Mod Utilities`, `\`;greroll\`: Reroll a giveaway winner.
            \`;removeemote\`: Removes an emote from the server with the name or emotes provided.
            \`;removesticker\`: Removes a sticker from the server with the sticker provided.
            \`;renameemote\`: Renames the emote specified.
            \`;setmuterole\`: Sets the server's mute role.`)
            .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()}`});

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

            const embeds = [page1, page2, page3, page4, page5, page6, page7]
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
                if (i.user.id != message.author.id) return
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

            hiddenCommands = ['talk', 'newchp', 'modreply', 'modmail', 'replymodmail', 'replymod', 'reply', `adminhelp`, `embed`, `editembed`, `eembed`, `edit`]
            for (let i = 0; i < hiddenCommands.length; i++) {
                let comm = hiddenCommands[i]
                if (!command || commandName === comm) return message.reply("This command does not exist.");
            }
	        
            try{
                const helpSpecific = new MessageEmbed()
                    .setAuthor({name:client.user.username, iconURL: client.user.displayAvatarURL()})
                    .setColor(`${process.env.colour}`)
                    .setTitle(`Command: \`;${command.name}\``)
                    .addField(`Description:`, `${command.description}`)
                    .addField(`Aliases`, `\`${command.aliases || "No other aliases"}\``)
                    .addField(`Usage`, `\`${command.usage}\``)
                    .setFooter({text:`Made by ${owner.tag}`, iconURL: `${owner.displayAvatarURL()}`});
                if (!command.cooldown && !command.unicooldown) {
                    return message.channel.send({
                        embeds: [helpSpecific]
                    })
                } else if (command.cooldown || command.unicooldown) {
                    return message.channel.send({
                        embeds: [helpSpecific.addField(`Cooldown`, `${command.cooldown/1000 || command.unicooldown/1000} seconds`)]
                    })
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
}