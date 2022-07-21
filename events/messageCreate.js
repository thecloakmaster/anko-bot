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
            const embed = new Discord.MessageEmbed()
                .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL()})
                .setColor(`${process.env.colour}`)
                .setTitle(`ID: ${message.author.id}`)
                .setDescription(message.content)
                .setTimestamp();
            modHook.send({
                embeds: [embed]
            }).catch(() => {});            
            if (message.attachments.size > 0) {
                let embedArr = []                
                message.attachments.forEach(attachment => {
                    if (!attachment.proxyURL.includes('https://cdn.discordapp.com/') && !attachment.proxyURL.includes('https://media.discordapp.net/')) return
                    let imageURL = attachment.proxyURL;
                    let imageEmbed = new Discord.MessageEmbed()
                        .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL()})
                        .setColor(`${process.env.colour}`)
                        .setTitle(`ID: ${message.author.id}`)
                        .setImage(imageURL)
                        .setTimestamp();
                    let arrCopy = _.cloneDeep(imageEmbed)
                    embedArr.push(arrCopy);                    
                })
                await modHook.send({embeds: embedArr})
            }
        }
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        let args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


        if (!command) return;

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