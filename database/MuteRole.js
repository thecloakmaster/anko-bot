const mongoose = require("mongoose");

module.exports = mongoose.model("MuteRole", new mongoose.Schema({
    GuildID: {
        type: String
    },
    MuteRoleID: {
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