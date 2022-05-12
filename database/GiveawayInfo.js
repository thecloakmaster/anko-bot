const mongoose = require(`mongoose`);

module.exports = mongoose.model(`giveawayInfo`, new mongoose.Schema({
    ChannelID: {
        type: String
    },
    EmbedID: {
        type: String
    },
    GuildID: {
        type: String
    },
    GiveawayID: {
        type: String
    },
    Prize :{
        type: String
    },
    Winners: {
        type: Number
    },
    WinnersList: {
        type: Array,
        default: null
    },
    Ended: {
        type: Boolean,
        default: false
    },
    LastsTill: {
        type: Number
    },
    ClientID: {
        type: String
    }
}))