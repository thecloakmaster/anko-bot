const mongoose = require("mongoose");

module.exports = mongoose.model("MutedMember", new mongoose.Schema({
    UserID: {
        type: String
    },
    GuildID: {
        type: String
    },
    GivenAt: {
        type: Number
    },
    LastsTill: {
        type: Number,
        default: null
    }
}))