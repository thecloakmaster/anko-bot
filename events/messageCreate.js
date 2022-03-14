const Discord = require('discord.js');
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
                .setColor("#e4a353")
                .setTitle(`ID: [${message.author.id}]`)
                .setDescription(message.content)
                .setTimestamp();
            return modHook.send({
                embeds: [embed]
            }).catch(() => {});
        }
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


        if (!command) return;

        try {
            command.execute(message, args, client, Discord);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }

    }
}