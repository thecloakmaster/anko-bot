const mongoose = require("mongoose");

module.exports = mongoose.model("Reminder", new mongoose.Schema({
    UserID: {
        type: String
    },
    Reminder: {
        type: String
    },
    LastsTill: {
        type: Number,
        default: null
    },
    TimeString: {
        type: String
    },
    ClientID: {
        type: String
    }
}))