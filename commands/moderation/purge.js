const {MessageEmbed} = require("discord.js");

module.exports = {
    name: 'purge',
    aliases: ['thanos'],
    description: "Deletes the amount of messages specified.",
    usage: ";purge <amount of messages>",
    async execute(message, args, client) {
        const delInput = args[0];
        message.delete();
        try {
            let delAmount = parseInt(delInput)
            delAmount = delAmount + 1
            const bot = await message.guild.members.fetch(`${client.user.id}`)
            if (!message.member.permissions.has(`MANAGE_MESSAGES`)) {
                return message.channel.send(`You do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_MESSAGES\`.`)
            } else if (!bot.permissions.has(`MANAGE_MESSAGES`)) {
                return message.channel.send(`I do not have the necessary permissions to execute this command.\nPermissions required: \`MANAGE_MESSAGES\`.`)
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
                    message.channel.bulkDelete(messages, true).catch((err) => {
                        console.log(err)
                        console.log(err.code)
                    })
                    .then((messages) => {
                        if (messages.size === 0) {
                            return
                        } else if  (messages.size>1) {
                            return message.channel.send(`${messages.size - 1} messages were deleted.`).then(msg => {
                                setTimeout(() => msg.delete(), 2000)
                            })
                        }
                    })
                    
                });
                
            } catch (err) {
                console.log(err);
            }


        } catch (err) {
            return message.channel.send("Please enter a valid amount.");
        }


    }

}