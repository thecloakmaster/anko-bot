const ClubInfo = require(`../../database/ClubInfo.js`)
const ClubList = require(`../../database/ClubLists.js`)
const _ = require('lodash');
const {
    MessageEmbed, MessageActionRow, MessageButton
} = require("discord.js")

module.exports = {
    name: `clublist`,
    description: `Lists all the clubs in the server.`,
    usage: `;clublist`,
    aliases: [`clist`],
    async execute(message, args, client) {
        let guildClubList = await ClubList.findOne({
            GuildID: `${message.guild.id}`,
            ClientID: `${client.user.id}`
        })
        if (guildClubList) {
            if (guildClubList.ClubEnabled == false) {
                return message.channel.send(`This server does not have clubs enabled.`)
            } else if (guildClubList.ClubEnabled == true) {
                let clubsArr = guildClubList.ClubList
                if (clubsArr.length == 0) {
                    return message.channel.send(`This server does not have any clubs.`)
                }
                let clubList = await ClubInfo.find({
                    GuildID: `${message.guild.id}`,
                    ClientID: `${client.user.id}`
                })
                if (clubList.length == 0) {
                    return message.channel.send(`This server does not have any clubs.`)
                }
                let clubEmbed = new MessageEmbed()
                    .setAuthor({
                        name: client.user.username,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTitle(`Club List`)
                    .setColor(`${process.env.colour || `e4a353`}`)                    
                let embedArr = []
                
                let embedCounter = 0,
                    counter = 0
                clubList.forEach(async (club) => {
                    if (counter%5 === 0 && counter > 0) {
                        clubEmbed.fields = []
                        embedCounter++
                    }
                    clubEmbed.addField(`${club.ClubName}`, `${club.ClubDescription}`)
                    embedArr[embedCounter] = _.cloneDeep(clubEmbed)
                    counter++
                })
                if (embedArr.length == 1) {
                    return message.channel.send({embeds: embedArr})
                } else if (embedArr.length > 1) {
                    const button1 = new MessageButton()
                        .setCustomId('previousbtn')
                        .setLabel('Previous')
                        .setStyle('SECONDARY');

                    const button2 = new MessageButton()
                        .setCustomId('nextbtn')
                        .setLabel('Next')
                        .setStyle('SECONDARY');

                    const button3 = new MessageButton()
                        .setCustomId('close')
                        .setLabel('Close')
                        .setStyle('DANGER')

                    const buttonList = [button1, button2, button3]

                    let embed = 0
                    const row = new MessageActionRow().addComponents(buttonList);
                    const curPage = await message.channel.send({
                        embeds: [embedArr[embed]],
                        components: [row],
                    });

                    const filter = (i) =>
                        i.customId === buttonList[0].customId ||
                        i.customId === buttonList[1].customId ||
                        i.customId === buttonList[2].customId;;

                    timeout = 120000
                    const collector = await curPage.createMessageComponentCollector({
                        filter,
                        time: timeout,
                    });
                    collector.on("collect", async (i) => {
                        if (i.user.id != message.author.id) return
                        switch (i.customId) {
                            case buttonList[0].customId:
                                embed = embed - 1;
                                if (embed < 0) {
                                    embed = 0
                                    break
                                }
                                break;
                            case buttonList[1].customId:
                                embed = embed + 1;
                                if (embed >= embedArr.length) {
                                    embed = embed - 1
                                    break
                                }
                                break;
                            default:
                                break;
                        }
                        if (i.customId === buttonList[2].customId) {
                            collector.stop();
                        }
                        await i.deferUpdate();
                        await i.editReply({
                            embeds: [embedArr[embed]],
                            components: [row],
                        });
                        collector.resetTimer();
                    });
                    collector.on("end", () => {
                        try {
                            let disabledRow = new MessageActionRow().addComponents(
                                buttonList[0].setDisabled(true),
                                buttonList[1].setDisabled(true),
                                buttonList[2].setDisabled(true).setLabel('Closed')
                            );
                            curPage.edit({
                                embeds: [embedArr[embed]],
                                components: [disabledRow],
                            }).catch((err) => {
                                return
                            });
                        } catch (err) {
                            console.log(err.code)
                        }
                    });
                }
            }
        } else if (!guildClubList) {
            return message.channel.send(`This server does not have clubs setup.`)
        }
    }
}