const mongoose = require(`mongoose`);

module.exports = mongoose.model(`ClubLists`, new mongoose.Schema({
    ClubList: {
        type: Array,
        default: null
    },
    ClubOwnerRole: {
        type: String,
        default: null
    },
    ClubCategoryID: {
        type: String
    },
    ClubEnabled: {
        type: Boolean
    },
    GuildID: {
        type: String
    },
    ClientID: {
        type: String
    }
}))