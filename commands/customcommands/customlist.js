const CustomCommands = require('../../database/CustomCommands.js');
const _ = require('lodash');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'customlist',
    aliases: ['listcustom'],
    description: 'Lists all the server\'s custom commands.',
    usage: ';customlist',
    async execute(message, args, client) {
        let commandList = await CustomCommands.find({
            ClientID: `${client.user.id}`,
            GuildID: `${message.guild.id}`
        })
        if (!commandList || commandList?.length === 0) {
            return message.channel.send('This server has no custom commands.')
        } else if (commandList?.length > 0) {
            let embedArr = [],
                counter = 0,
                embedCounter = 0
            let commandsEmbed = new MessageEmbed()
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle(`List of custom commands`)
                .setColor(`${process.env.colour || "00FFFF"}`)
            commandList.forEach(async (command) => {
                if (counter % 10 === 0 && counter > 0) {
                    commandsEmbed.fields = []
                    embedCounter++
                }
                commandsEmbed.addField(`${command.CustomCommand}`, `${command.Description}`)
                embedArr[embedCounter] = _.cloneDeep(commandsEmbed)
                counter++
            })
            if (embedArr.length === 1) {
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
    }
}