const mongoose = require("mongoose");

module.exports = mongoose.model("NewestTweet", new mongoose.Schema({
    Username: {
        type: String
    },
    TweetLink: {
        type: String
    },
    SecondLink: {
        type: String
    },
    ThirdLink: {
        type: String
    }
}))