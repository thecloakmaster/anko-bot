const mongoose = require("mongoose");

module.exports = mongoose.model("CustomCommands", new mongoose.Schema({
    CustomCommand: {
        type: String
    },
    Description: {
        type: String
    },
    MessageContent: {
        type: String
    },
    MessageEmbeds: {
        type: Array,
        default: []
    },
    MessageAttachments: {
        type: Array,
        default: []
    },
    ClientID: {
        type: String
    },
    GuildID: {
        type: String
    }
}))