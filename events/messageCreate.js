const Discord = require('discord.js');
const Cooldown = new Discord.Collection();
const ms = require('ms');
const _ = require('lodash');

module.exports = {
    name: `messageCreate`,
    async execute(message, client) {
        const prefix = ';'
        const modHook = new Discord.WebhookClient({
            id: `${process.env.Modmail_Webhook_ID}`,
            token: `${process.env.Modmail_Webhook_Token}`
        })
        if (message.channel.type === 'DM') {
            if (message.author.id === client.user.id) return;
            let embedArr = []
            const embed = new Discord.MessageEmbed()
                .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL()})
                .setColor(`${process.env.colour}`)
                .setTitle(`ID: ${message.author.id}`)
                .setDescription(message.content)
                .setTimestamp();
            let embedCop = _.cloneDeep(embed)
            let counter = 0
            if (message.attachments.size > 0) {
                message.attachments.forEach(attachment => {
                    if (!attachment.proxyURL.includes('https://cdn.discordapp.com/') && !attachment.proxyURL.includes('https://media.discordapp.net/')) return
                    let imageURL = attachment.proxyURL;
                    if (counter === 0) {
                        embed.setImage(imageURL);
                        embedCop = _.cloneDeep(embed);
                        embedArr.push(embedCop);
                    } else {
                        let imageEmbed = new Discord.MessageEmbed()
                            .setAuthor({
                                name: `${message.author.tag}`,
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setColor(`${process.env.colour}`)
                            .setTitle(`ID: ${message.author.id}`)
                            .setImage(imageURL)
                            .setTimestamp();
                        let arrCopy = _.cloneDeep(imageEmbed)
                        embedArr.push(arrCopy);
                    }
                    counter++
                })
            } else {
                embedArr.push(embedCop)
            }
            await modHook.send({embeds: embedArr})
        }

        if (message.content.includes("<@&908021112984727592>" || "<@908021112984727592>") && (message.guild.id === "908021112837922847" && message.channel.id === "908021114138132510" && message.author.id === "241602273187201026" )) {
            const channel = await message.guild.channels.cache.find(chn => chn.id === '908021114138132510');
            let channelCurrentName = channel.name.split("-");
            if (message.content.includes("korean" || "Korean" || "kr")) {
                await channel.setName(`ch-${parseInt(channelCurrentName[1]) + 1}-kr`);
            } else {
                await channel.setName(`ch-${parseInt(channelCurrentName[1]) + 1}-raws`);
            }
        }

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        let args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


        if (!command) {
            const CustomCommands = require('../database/CustomCommands.js');
            let customCommand = await CustomCommands.findOne({
                CustomCommand: `${commandName}`,
                ClientID: `${client.user.id}`,
                GuildID: `${message.guild.id}`
            })
            if (customCommand) {
                if (customCommand.MessageContent?.length > 0) {
                    if (customCommand.MessageAttachments?.length > 0) {
                        message.channel.send({content: customCommand.MessageContent, embeds: customCommand.MessageEmbeds})
                        return message.channel.send({content: `${customCommand.MessageAttachments.join("\n")}`})
                    } else {
                        return message.channel.send({content: customCommand.MessageContent, embeds: customCommand.MessageEmbeds})
                    }
                } else if (customCommand.MessageContent?.length === 0 && (customCommand.MessageEmbeds?.length > 0 || customCommand.MessageAttachments?.length > 0)){
                    if (customCommand.MessageEmbeds?.length > 0 && customCommand.MessageAttachments?.length > 0) {
                        return message.channel.send({embeds: customCommand.MessageEmbeds, content: `${customCommand.MessageAttachments.join("\n")}`})
                    } else if (customCommand.MessageEmbeds?.length > 0 && customCommand.MessageAttachments?.length === 0) {
                        return message.channel.send({embeds: customCommand.MessageEmbeds})
                    } else if (customCommand.MessageEmbeds?.length === 0 && customCommand.MessageAttachments?.length > 0) {
                        return message.channel.send({content: `${customCommand.MessageAttachments.join("\n")}`})
                    }
                }
            } else {
                return
            }
        };
        try {
            if (command.cooldown) {
                if (Cooldown.has(`${command.name}${await message.author.id}`)) {
                    return message.channel.send(`You are on a cooldown. Please wait for \`${ms(Cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true})}\` to execute this command again.`)
                }
                command.execute(message, args, client, Discord);
                if (!message.member.permissions.has("MODERATE_MEMBERS") && !message.member.permissions.has("ADMINISTRATOR") && !message.member.permissions.has("MANAGE_MESSAGES")) {
                    Cooldown.set(`${command.name}${await message.author.id}`, Date.now() + command.cooldown)
                    setTimeout(() => {
                        Cooldown.delete(`${command.name}${message.author.id}`)
                    }, command.cooldown)
                }
            } else if (!command.cooldown) {
                command.execute(message, args, client, Discord);
            }
        } catch (error) {
            console.error(error);
            message.channel.send('There was an error trying to execute that command!');
        }
    }
}