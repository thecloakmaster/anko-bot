const mongoose = require("mongoose");

module.exports = mongoose.model(`Match`, new mongoose.Schema({
    Members: {
        type: Array
    },
    Match: {
        type: Number
    },
    ClientID: {
        type: String
    }
}))