const BoosterMember = require(`../database/BoosterMember.js`)
module.exports = {
    name: `guildMemberUpdate`,
    async execute(oldMember, newMember, client){
        let guildID = newMember.guild.id
        let memberID = newMember.user.id
        let boosterRole = newMember.guild.roles.premiumSubscriberRole
        if (!newMember.premiumSinceTimestamp && !newMember.roles.cache.some(role => role.id === boosterRole.id)) {
            let data = await BoosterMember.findOne({
                MemberID: `${memberID}`,
                GuildID: `${guildID}`,
                ClientID: `${client.user.id}`
            })
            if (!data) {
                return;
            } else if (data) {
                let role = await newMember.guild.roles.fetch(`${data.RoleID}`).catch(() => {})
                if (!role) {
                    try {
                        await BoosterMember.findOneAndRemove({
                            MemberID: `${memberID}`,
                            GuildID: `${guildID}`,
                            ClientID: `${client.user.id}`
                        }).then(() => console.log(`Successfully deleted the role in MongoDB`)).catch((err) => {
                            console.log(err)
                        })
                    } catch (err) {} 
                } else if (role) {
                    try {
                        await role.delete().then(() => {
                            newMember.user.send(`Thank you for supporting the Yofukashi no Uta server. Your custom role has been deleted if you had any. You can reclaim it back if you boost the server again.`)
                        }).catch((err) => console.log(err))
                        await BoosterMember.findOneAndRemove({
                            MemberID: `${memberID}`,
                            GuildID: `${guildID}`,
                            ClientID: `${client.user.id}`
                        }).then(() => console.log(`Successfully deleted the role in MongoDB`)).catch((err) => {
                            console.log(err)
                        })
                    } catch (err) {}
                }
            }
        } else if (newMember.premiumSinceTimestamp && newMember.roles.cache.some(role => role.id === boosterRole.id)) {
            return;
        }
    }
}