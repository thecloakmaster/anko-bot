const {
    MessageEmbed,
    Guild,
    Message
} = require("discord.js");

module.exports = {
    name: 'purge',
    aliases: ['thanos'],
    description: "Deletes the amount of messages specified.",
    usage: ";purge <amount of messages>",
    async execute(message, args) {

        const delInput = args[0];

        message.delete();

        try {
            let delAmount = parseInt(delInput)
            if (!message.member.permissions.has("MANAGE_MESSAGES")) {
                const permerror = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`Error executing that command`)
                    .setDescription(`You do not have the necessary permissions to execute this command`)
                    .setTimestamp();
                return message.reply({
                    embeds: [permerror]
                });
            }

            if (delAmount < 0 || !Number.isInteger(delAmount)) return message.reply("Please enter a positive integer.")

            if (delAmount > 100) {
                delAmount = 99
                return message.channel.send(`Cannot purge more than 100 messages at once`)
            }

            try {
                await message.channel.messages.fetch({
                    limit: delAmount
                }).then(messages => {
                    message.channel.bulkDelete(messages).catch((err) => {
                        console.log(err)
                        if (err.code === 50034) {
                            return message.channel.send("Cannot purge message older than 14 days.").then(msg => {
                                setTimeout(() => msg.delete(), 2000)
                            })
                        }
                    })
                    
                });
                setTimeout(function () {
                    return message.channel.send(`Deleted ${delAmount} messages`).then(msg => {
                        setTimeout(() => msg.delete(), 2000)
                    })
                }, 2000)
            } catch (err) {
                console.log(err);
            }


        } catch (err) {
            return message.channel.send("Please enter a valid amount.");
        }


    }

}