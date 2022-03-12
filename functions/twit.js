const Twit = require('twit')
const Discord = require(`discord.js`)
module.exports = {
    async execute() {
        const T = new Twit({
            consumer_key: process.env.consumer_key,
            consumer_secret: process.env.consumer_secret,
            access_token: process.env.access_token,
            access_token_secret: process.env.access_token_secret,
            timeout_ms: 60 * 1000,
            strictSSL: true,
        })

        const stream = T.stream('statuses/filter', {
            follow: ['449609521', '1453395613282811911']
        })

        const feedHook = new Discord.WebhookClient({
            id: `909898898439565434`,
            token: `nSZjjY-7Gu37DSgRMZGSTHm6UnKSuSZ9W30fL85FZ31VpHmUi43NKrlDeHo5rXP-nius`
        })

        stream.on('tweet', function (tweet) {
            if (tweet.user.id === 449609521 || tweet.user.id === 1453395613282811911) {
                if (!tweet.retweeted_status) {
                    let url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
                    try {
                        feedHook.send(`${tweet.user.screen_name} tweeted this ${url}`).catch(err => {
                            console.log(err)
                        })
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    let url = "https://twitter.com/" + tweet.retweeted_status.user.screen_name + "/status/" + tweet.retweeted_status.id_str;
                    try {
                        feedHook.send(`${tweet.user.screen_name} retweeted this ${url}`).catch(err => {
                            console.log(err)
                        })
                    } catch (error) {
                        console.error(error);
                    }
                }
            }

        })

        stream.on('error', (e) => {
            console.log(e);
        })

    }
}