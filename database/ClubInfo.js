const mongoose = require(`mongoose`);

module.exports = mongoose.model(`ClubInfo`, new mongoose.Schema({
    ClubOwnerID: {
        type: String
    },
    ClubName: {
        type: String
    },
    ClubDescription: {
        type: String
    },
    ClubChannelID: {
        type: String,
        default: null
    },
    GuildID: {
        type: String
    },
    ClubRoleID: {
        type: String,
        default: null
    },
    ClubPingBool: {
        type: Boolean,
        default: false
    },
    MembersList: {
        type: Array,
        default: null
    },
    ClientID: {
        type: String
    }
}))