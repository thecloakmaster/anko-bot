const mongoose = require("mongoose");

module.exports = mongoose.model("MangaChapter", new mongoose.Schema({
    GuildID: {
        type: String
    },
    WednesdayTimestamp: {
        type: Number
    }, 
    ClientID: {
        type: String
    }
}))