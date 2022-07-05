const Reminder = require(`../database/Reminder.js`)

module.exports = {
    async execute(client) {
        setInterval(async function () {
            let reminders = await Reminder.find({
                ClientID: `${client.user.id}`
            })
            for (let reminder of reminders) {
                if (Date.now() >= reminder.LastsTill) {
                    let user = await client.users.fetch(`${reminder.UserID}`)
                    if (user) {
                        try {
                            await user.send(`You have been reminded to: ${reminder.Reminder}`)
                        } catch {}
                        await Reminder.findOneAndDelete({
                            UserID: `${reminder.UserID}`,
                            Reminder: `${reminder.Reminder}`,
                            LastsTill: reminder.LastsTill,
                            ClientID: `${client.user.id}`
                        })
                    } else if (!user) {
                        await Reminder.findOneAndDelete({
                            UserID: `${reminder.UserID}`,
                            Reminder: `${reminder.Reminder}`,
                            LastsTill: reminder.LastsTill,
                            ClientID: `${client.user.id}`
                        })
                    }
                }
            }
        }, 10000);
    }
}