const mongoose = require(`mongoose`)
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        mongoose.connect(`${process.env.mongoURL}`, {
            keepAlive: true,
        }).then(console.log(`Connected to MongoDB!`)).catch((err) => console.log(err));
        console.log('Ready!');
        client.user.setActivity("DMs for modmail.", {
            type: `LISTENING`
        })
        setInterval(async function () {
            client.user.setActivity("DMs for modmail.", {
                type: `LISTENING`
            })
        }, 600000)
    }
}