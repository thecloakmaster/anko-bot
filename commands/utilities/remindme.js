const Reminder = require(`../../database/Reminder.js`);
const ms = require(`ms`);
const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: `remindme`,
    description: `Sets a reminder for the specified time to remind you of the specified task.`,
    usage: `;remindme <Time> <Task>`,
    async execute(message, args, client) {
        if (!args) {
            return message.channel.send(`Please specify necessary arguments to set the reminder.\nSyntax: \`;remindme <Time> <Task>\``);
        };
        let timeList = ["second", "seconds", "sec", "s", "m", "min", "minutes", "minute", "h", "hrs", "hr", "hour", "hours", "d", "day", "days", "months", "month", "y", "year", "years"];
        let timeString = args[0];
        let task;
        if (!timeString) {
            return message.channel.send(`Please specify the time for this reminder to be set.\nSyntax: \`;remindme <Time> <Task>\``)
        }
        if (!isNaN(timeString)) {
            if (timeList.indexOf(args[1]) !== -1) {
                timeString = `${args[0]} ${args[1]}`
                task = args.slice(2).join(" ")
            } else if (timeList.indexOf(args[1]) === -1) {
                timeString = `${args[0]}h`
                task = args.slice(1).join(" ")
            }
        } else {
            task = args.slice(1).join(" ")
        }
        if (!ms(timeString)) {
            timeString = `1h`
            task = args.join(" ")
        }
        if (!task) {
            task = `undefined`
        }
        let time = ms(timeString);
        if (time >= 31556926000) {
            return message.channel.send(`Sorry the maximum time you can set for a reminder is 1 year. Please specify a shorter time frame.`)
        }
        if (time && task) {
            if (task.length > 1024) {
                return message.channel.send(`Please specify a shorter task for your reminder (shorter than 1024 characters).\nSyntax: \`;remindme <Time> <Task>\``)
            }
            let newData = new Reminder({
                UserID: `${message.author.id}`,
                Reminder: `${task}`,
                LastsTill: Date.now() + time,
                TimeString: `${timeString}`,
                ClientID: `${client.user.id}`
            })
            await newData.save().then(() => {
                let embed = new MessageEmbed()
                    .setColor(`${process.env.colour}`)
                    .setTitle(`A reminder has been set for ${timeString}.`)
                    .setDescription(`Task: ${task}`)
                    .setTimestamp();
                return message.channel.send({
                    embeds: [embed]
                })
            });
        } else {
            return message.channel.send(`Please specify necessary arguments to set the reminder.\nSyntax: \`;remindme <Time> <Task>\``);
        }
    }
}