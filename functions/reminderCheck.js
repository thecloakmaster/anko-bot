const Reminder = require(`../database/Reminder.js`)
const MangaChapter = require(`../database/MangaChapter.js`)

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
            let manga = await MangaChapter.findOne({
                GuildID: `908021112837922847`,
                ClientID: `${client.user.id}`
            })
            console.log(manga)
            if (manga) {
                console.log(manga.WednesdayTimestamp)
                let ts = manga.WednesdayTimestamp + 604800
                console.log(ts)
                if (Math.round(Date.now() / 1000) >= manga.WednesdayTimestamp) {
                    await MangaChapter.findOneAndUpdate({
                        GuildID: `908021112837922847`,
                        ClientID: `${client.user.id}`
                    }, {
                        WednesdayTimestamp: ts
                    })
                }
            }
        }, 10000);        
    }    
}