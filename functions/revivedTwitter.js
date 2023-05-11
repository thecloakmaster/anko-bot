const jsdom = require('jsdom')
const {JSDOM} = jsdom;
const https = require("https")
const {WebhookClient} = require('discord.js');
const NewestTweet = require(`../database/NewTweet.js`);

module.exports = {
    async execute(username) {
        let finished = false;
        async function twitterFunction() {
            finished = false
            const feedHook = new WebhookClient({
                id: `909898898439565434`,
                token: `nSZjjY-7Gu37DSgRMZGSTHm6UnKSuSZ9W30fL85FZ31VpHmUi43NKrlDeHo5rXP-nius`,
            });
            let newLinks = [];
            let newMessages = [];
            let userObject = await NewestTweet.findOne({
                Username: username,
            });
            if (!userObject) {
                let newData = new NewestTweet({
                    Username: username,
                });
                await newData.save();
            }
            userObject = await NewestTweet.findOne({
                Username: username,
            });
            let preSetLinks = [userObject.TweetLink, userObject.SecondLink, userObject?.ThirdLink];
            const fetchProm = new Promise(async (resolve, reject) => {
                https.get(`https://nitter.net/${username}`, function (res) {
                    let siteData = '';
                    res.setEncoding("utf8");
                    res.on("data", (data) => {
                        siteData += data;
                    });
                    res.on("end", () => {
                        resolve(siteData);
                    });
                });
            });
            fetchProm.then(async (siteData) => {
                const document = new JSDOM(siteData);
                let mainElements =
                    document.window.document.getElementsByClassName(
                        "timeline-item"
                    );
                for (let i = 0; i < 3; i++) {
                    let newMessage;
                    let newTweetLink = mainElements[i].innerHTML.replace(
                        '<a class="tweet-link" href="',
                        ""
                    );
                    newTweetLink = newTweetLink.split(/#/)[0];
                    newTweetLink = newTweetLink.replace(/(\r\n|\n|\r|\ )/gm, "");
                    newTweetLink = `https://twitter.com${newTweetLink}`;
                    if (mainElements[i].innerHTML.includes("retweet-header")) {
                        newMessage = `${username} retweeted ${newTweetLink}`;
                    } else {
                        newMessage = `${username} tweeted ${newTweetLink}`;
                    }
                    if (!mainElements[i].innerHTML.includes("pinned")) {
                        newMessages.push(newMessage);
                        newLinks.push(newTweetLink);
                    }
                }
                for (let i = 2; i >= 0; i--) {
                    if (!preSetLinks.includes(newLinks[i])) {
                        await feedHook.send(newMessages[i]);
                        if (i === 1) {
                            if (newLinks[2] && newLinks[2] === preSetLinks[0]) {
                                await NewestTweet.findOneAndUpdate({Username: username},{ThirdLink: newLinks[2]});
                            }
                            await NewestTweet.findOneAndUpdate({Username: username}, {SecondLink: newLinks[i]});
                        } else if (i === 2) {
                            await NewestTweet.findOneAndUpdate({Username: username},{ThirdLink: newLinks[i]});
                        } else {
                            if (newLinks[1] === preSetLinks[0]) {
                                await NewestTweet.findOneAndUpdate({Username: username},{SecondLink: newLinks[1]});
                                if (newLinks[2] && newLinks[2] === preSetLinks[1]) {
                                    await NewestTweet.findOneAndUpdate({Username: username},{ThirdLink: newLinks[2]});
                                }
                            } else if (newLinks[2] && newLinks[2] === preSetLinks[0]) {
                                await NewestTweet.findOneAndUpdate({Username: username},{ThirdLink: newLinks[2]});
                            }
                            await NewestTweet.findOneAndUpdate({Username: username},{TweetLink: newLinks[i]});
                        }
                    }
                }
                finished = true;
            });
        }
        try {
            await twitterFunction();
        } catch (err) {
            console.log(err);
            finished = true;
        };
        setInterval(async () => {
            if (finished) {await twitterFunction();};
        }, 8000);
    }
}