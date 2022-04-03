const mongoose = require("mongoose");

module.exports = mongoose.model("WarnedMember", new mongoose.Schema({
    MemberID: {
        type: String
    },
    MessageID: {
        type: String
    },
    WarnReason: {
        type: String
    },
    GuildID: {
        type: String
    },
    registeredAt: {
        type: Number,
        default: Date.now()
    },
    ClientID: {
        type: String
    }
}))