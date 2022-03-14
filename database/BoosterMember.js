const mongoose = require("mongoose");

module.exports = mongoose.model("BoosterMember", new mongoose.Schema({
    MemberID: {type: String},
    RoleID: {type: String},
    GuildID: {type: String},
    registeredAt: { type: Number, default: Date.now()},
    ClientID: {type: String}
}))