const Reminder = require(`../../database/Reminder.js`);
const {
    MessageEmbed
} = require("discord.js");
const _ = require(`lodash`)

module.exports = {
    name: `reminders`,
    description: `Shows you all your reminders.`,
    usage: `;reminders`,
    async execute(message, args, client) {
        let reminders = await Reminder.find({
            UserID: `${message.author.id}`,
            ClientID: `${client.user.id}`
        })
        if (reminders.length === 0) {
            return message.channel.send(`You have set no reminders for yourself.`)
        } else if (reminders.length >= 1) {
            let embed = new MessageEmbed()
                .setColor(`${process.env.colour}`)
                .setTitle(`Your Reminders`)
            let embedArr = []

            let embedCounter = 0,
                counter = 0
            for (let reminder of reminders) {
                if (counter % 5 === 0 && counter > 0) {
                    embed.fields = []
                    embedCounter++
                }
                if (reminder.Reminder.length > 256) {
                    embed.addField(`${reminder.Reminder.slice(0,252)}...`, `Duration: ${reminder.TimeString}`)
                    embedArr[embedCounter] = _.cloneDeep(embed)
                    counter++
                    continue
                }
                embed.addField(`${reminder.Reminder}`, `Duration: ${reminder.TimeString}`)
                embedArr[embedCounter] = _.cloneDeep(embed)
                counter++
            }
            if (embedArr.length == 1) {
                return message.channel.send({
                    embeds: embedArr
                })
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
    }
}