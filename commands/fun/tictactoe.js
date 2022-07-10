const { 
    MessageActionRow,
    MessageButton
} = require('discord.js');

const _ = require('lodash');

async function winnerCheck(array) {    
    if ((array[0] === array[1] && array[1] === array[2] && array[0] !== 0 && array[1] !== 0 && array[2] !== 0) ||
        (array[3] === array[4] && array[4] === array[5] && array[3] !== 0 && array[4] !== 0 && array[5] !== 0) ||
        (array[6] === array[7] && array[7] === array[8] && array[6] !== 0 && array[7] !== 0 && array[8] !== 0) ||
        (array[0] === array[4] && array[4] === array[8] && array[0] !== 0 && array[4] !== 0 && array[8] !== 0) ||
        (array[2] === array[4] && array[4] === array[6] && array[2] !== 0 && array[4] !== 0 && array[6] !== 0) ||
        (array[0] === array[3] && array[3] === array[6] && array[0] !== 0 && array[3] !== 0 && array[6] !== 0) ||
        (array[1] === array[4] && array[4] === array[7] && array[1] !== 0 && array[4] !== 0 && array[7] !== 0) ||
        (array[2] === array[5] && array[5] === array[8] && array[2] !== 0 && array[5] !== 0 && array[8] !== 0)) {
        return `true`;
    } else {
        return `false`;
    }
}

async function buttonCheck(row1, row2, row3) {
    let row1Clone = _.cloneDeep(row1);
    let row2Clone = _.cloneDeep(row2);
    let row3Clone = _.cloneDeep(row3)
    row1 = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(`${row1Clone.components[0].customId}`)
            .setLabel(`${row1Clone.components[0].label}`)
            .setStyle(`${row1Clone.components[0].style}`)
            .setDisabled(),
        new MessageButton()
            .setCustomId(`${row1Clone.components[1].customId}`)
            .setLabel(`${row1Clone.components[1].label}`)
            .setStyle(`${row1Clone.components[1].style}`)
            .setDisabled(),
        new MessageButton()
            .setCustomId(`${row1Clone.components[2].customId}`)
            .setLabel(`${row1Clone.components[2].label}`)
            .setStyle(`${row1Clone.components[2].style}`)
            .setDisabled()
    )
    row2 = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId(`${row2Clone.components[0].customId}`)
            .setLabel(`${row2Clone.components[0].label}`)
            .setStyle(`${row2Clone.components[0].style}`)
            .setDisabled(),
        new MessageButton()
            .setCustomId(`${row2Clone.components[1].customId}`)
            .setLabel(`${row2Clone.components[1].label}`)
            .setStyle(`${row2Clone.components[1].style}`)
            .setDisabled(),
        new MessageButton()
            .setCustomId(`${row2Clone.components[2].customId}`)
            .setLabel(`${row2Clone.components[2].label}`)
            .setStyle(`${row2Clone.components[2].style}`)
            .setDisabled()
    )
    row3 = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId(`${row3Clone.components[0].customId}`)
        .setLabel(`${row3Clone.components[0].label}`)
        .setStyle(`${row3Clone.components[0].style}`)
        .setDisabled(),
        new MessageButton()
        .setCustomId(`${row3Clone.components[1].customId}`)
        .setLabel(`${row3Clone.components[1].label}`)
        .setStyle(`${row3Clone.components[1].style}`)
        .setDisabled(),
        new MessageButton()
        .setCustomId(`${row3Clone.components[2].customId}`)
        .setLabel(`${row3Clone.components[2].label}`)
        .setStyle(`${row3Clone.components[2].style}`)
        .setDisabled()
    )    
    return [row1, row2, row3]
}

async function counterC(counter, collector, array, curPage, i, row1, row2, row3) {
    if (counter >= 5) {
        let returnData = await winnerCheck(array);
        if (returnData === 'true') {
            let buttons = await buttonCheck(row1, row2, row3)
            await curPage.edit({
                content: `The winner of this game of TicTacToe is: <@!${i.user.id}>`,
                components: buttons
            }).then(() => {
                collector.stop();
            });            
        }
    } 
}

module.exports = {
    name: `tictactoe`,
    description: `Play TicTacToe in Discord with Discord buttons.`,
    usage: `;tictactoe <Member>`,
    aliases: [`ttt`],
    cooldown: 60000,
    async execute(message, args, client) {
        let memberTarget = message.mentions.members.first() || await message.guild.members.fetch(`${args[0]}`).catch(() => {});
        if (!memberTarget) return message.channel.send(`Please specify a valid member.\nSyntax: \`;tictactoe <Member>\``)
        if (memberTarget?.user.id === message.author.id) return message.channel.send(`You cannot play TicTacToe with yourself.\nSyntax: \`;tictactoe <Member>\``);
        if (memberTarget.user.id === client.user.id) {return message.channel.send(`I cannot play TicTacToe with you at the moment sorry!\nSyntax: \`;tictactoe <Member>\``);};
        const button1 = new MessageButton()
            .setCustomId('A1')
            .setLabel('-')
            .setStyle('SECONDARY');

        const button2 = new MessageButton()
            .setCustomId('A2')
            .setLabel('-')
            .setStyle('SECONDARY');

        const button3 = new MessageButton()
            .setCustomId('A3')
            .setLabel('-')
            .setStyle('SECONDARY');
        
        const button4 = new MessageButton()
            .setCustomId('B1')
            .setLabel('-')
            .setStyle('SECONDARY');
        
        const button5 = new MessageButton()
            .setCustomId('B2')
            .setLabel('-')
            .setStyle('SECONDARY');
        
        const button6 = new MessageButton()
            .setCustomId('B3')
            .setLabel('-')
            .setStyle('SECONDARY');
        
        const button7 = new MessageButton()
            .setCustomId('C1')
            .setLabel('-')
            .setStyle('SECONDARY');

        const button8 = new MessageButton()
            .setCustomId('C2')
            .setLabel('-')
            .setStyle('SECONDARY');

        const button9 = new MessageButton()
            .setCustomId('C3')
            .setLabel('-')
            .setStyle('SECONDARY');
        
        const buttonList1 = [button1, button2, button3];
        const buttonList2 = [button4, button5, button6];
        const buttonList3 = [button7, button8, button9];

        let row1 = new MessageActionRow().addComponents(buttonList1);
        let row2 = new MessageActionRow().addComponents(buttonList2);
        let row3 = new MessageActionRow().addComponents(buttonList3);
        
        const curPage = await message.channel.send({
            content: `The game has started!`,
            components: [row1, row2, row3],
        });

        const filter = (i) =>
            i.customId === buttonList1[0].customId ||
            i.customId === buttonList1[1].customId ||
            i.customId === buttonList1[2].customId ||
            i.customId === buttonList2[0].customId ||
            i.customId === buttonList2[1].customId ||
            i.customId === buttonList2[2].customId ||
            i.customId === buttonList3[0].customId ||
            i.customId === buttonList3[1].customId ||
            i.customId === buttonList3[2].customId;

        const collector = await curPage.createMessageComponentCollector({
            filter,
            time: 120000,
        });
        let array = [0,0,0,0,0,0,0,0,0];
        let counter = 0;
        let starter = 0;
        collector.on('collect', async function(i) {            
            await i.deferUpdate();            
            if (i.user.id !== message.author.id && i.user.id !== memberTarget.user.id) return;
            if (counter === 0) {
                if (i.user.id === message.author.id) starter = 1;
                else if (i.user.id === memberTarget.user.id) starter = 2;
            } else if (counter > 0) {
                if (starter === 1) {
                    if (counter%2 === 0) {
                        if (i.user.id != message.author.id) return;
                    } else if (counter%2 !== 0) {
                        if (i.user.id != memberTarget.user.id) return;
                    };
                } else if (starter === 2) {
                    if (counter % 2 === 0) {
                        if (i.user.id != memberTarget.user.id) return;
                    } else if (counter%2 !== 0) {
                        if (i.user.id != message.author.id) return;
                    };
                };
            }            
            switch (i.customId) {
                case buttonList1[0].customId:
                    if (i.user.id === message.author.id) {
                        array[0] = 1
                        row1 = new MessageActionRow().addComponents(
                            buttonList1[0].setDisabled(true).setLabel(`X`).setStyle(`PRIMARY`), buttonList1[1], buttonList1[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    } else if (i.user.id === memberTarget.user.id) {
                        array[0] = 2
                        row1 = new MessageActionRow().addComponents(
                            buttonList1[0].setDisabled(true).setLabel(`O`).setStyle(`SUCCESS`), buttonList1[1], buttonList1[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    };                                   
                    break;
                case buttonList1[1].customId:
                    if (i.user.id === message.author.id) {
                        array[1] = 1;
                        row1 = new MessageActionRow().addComponents(
                            buttonList1[0], buttonList1[1].setDisabled(true).setLabel(`X`).setStyle(`PRIMARY`), buttonList1[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    } else if (i.user.id === memberTarget.user.id) {
                        array[1] = 2;
                        row1 = new MessageActionRow().addComponents(
                            buttonList1[0], buttonList1[1].setDisabled(true).setLabel(`O`).setStyle(`SUCCESS`), buttonList1[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    };
                    break;
                case buttonList1[2].customId:
                    if (i.user.id === message.author.id) {
                        array[2] = 1;
                        row1 = new MessageActionRow().addComponents(
                            buttonList1[0], buttonList1[1], buttonList1[2].setDisabled(true).setLabel(`X`).setStyle(`PRIMARY`)
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    } else if (i.user.id === memberTarget.user.id) {
                        array[2] = 2;
                        row1 = new MessageActionRow().addComponents(
                            buttonList1[0], buttonList1[1], buttonList1[2].setDisabled(true).setLabel(`O`).setStyle(`SUCCESS`)
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    };
                    break;
                case buttonList2[0].customId:
                    if (i.user.id === message.author.id) {
                        array[3] = 1;
                        row2 = new MessageActionRow().addComponents(
                            buttonList2[0].setDisabled(true).setLabel(`X`).setStyle(`PRIMARY`), buttonList2[1], buttonList2[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    } else if (i.user.id === memberTarget.user.id) {
                        array[3] = 2;
                        row2 = new MessageActionRow().addComponents(
                            buttonList2[0].setDisabled(true).setLabel(`O`).setStyle(`SUCCESS`), buttonList2[1], buttonList2[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    };
                    break;
                case buttonList2[1].customId:
                    if (i.user.id === message.author.id) {
                        array[4] = 1;
                        row2 = new MessageActionRow().addComponents(
                            buttonList2[0], buttonList2[1].setDisabled(true).setLabel(`X`).setStyle(`PRIMARY`), buttonList2[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    } else if (i.user.id === memberTarget.user.id) {
                        array[4] = 2;
                        row2 = new MessageActionRow().addComponents(
                            buttonList2[0], buttonList2[1].setDisabled(true).setLabel(`O`).setStyle(`SUCCESS`), buttonList2[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    };
                    break;
                case buttonList2[2].customId:
                    if (i.user.id === message.author.id) {
                        array[5] = 1;
                        row2 = new MessageActionRow().addComponents(
                            buttonList2[0], buttonList2[1], buttonList2[2].setDisabled(true).setLabel(`X`).setStyle(`PRIMARY`)
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    } else if (i.user.id === memberTarget.user.id) {
                        array[5] = 2;
                        row2 = new MessageActionRow().addComponents(
                            buttonList2[0], buttonList2[1], buttonList2[2].setDisabled(true).setLabel(`O`).setStyle(`SUCCESS`)
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    };
                    break;
                case buttonList3[0].customId:
                    if (i.user.id === message.author.id) {
                        array[6] = 1;
                        row3 = new MessageActionRow().addComponents(
                            buttonList3[0].setDisabled(true).setLabel(`X`).setStyle(`PRIMARY`), buttonList3[1], buttonList3[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    } else if (i.user.id === memberTarget.user.id) {
                        array[6] = 2;
                        row3 = new MessageActionRow().addComponents(
                            buttonList3[0].setDisabled(true).setLabel(`O`).setStyle(`SUCCESS`), buttonList3[1], buttonList3[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    };
                    break;
                case buttonList3[1].customId:
                    if (i.user.id === message.author.id) {
                        array[7] = 1;
                        row3 = new MessageActionRow().addComponents(
                            buttonList3[0], buttonList3[1].setDisabled(true).setLabel(`X`).setStyle(`PRIMARY`), buttonList3[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                        
                    } else if (i.user.id === memberTarget.user.id) {
                        array[7] = 2;
                        row3 = new MessageActionRow().addComponents(
                            buttonList3[0], buttonList3[1].setDisabled(true).setLabel(`O`).setStyle(`SUCCESS`), buttonList3[2]
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    };
                    break;
                case buttonList3[2].customId:
                    if (i.user.id === message.author.id) {
                        array[8] = 1;
                        row3 = new MessageActionRow().addComponents(
                            buttonList3[0], buttonList3[1], buttonList3[2].setDisabled(true).setLabel(`X`).setStyle(`PRIMARY`)
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    } else if (i.user.id === memberTarget.user.id) {
                        array[8] = 2;
                        row3 = new MessageActionRow().addComponents(
                            buttonList3[0], buttonList3[1], buttonList3[2].setDisabled(true).setLabel(`O`).setStyle(`SUCCESS`)
                        );
                        counter++
                        await counterC(counter, collector, array, curPage, i, row1, row2, row3);
                    };
                    break;                
            }
            let returnData = await winnerCheck(array);
            if (returnData === 'false' && counter === 9) {
                await i.editReply({
                    components: [row1, row2, row3],
                }).then(() => {
                    collector.stop();
                });                
            } else {
                await i.editReply({
                    components: [row1, row2, row3],
                });
            }            
            collector.resetTimer();            
        });
        collector.on(`end`, async () => {
            let returnData = await winnerCheck(array);
            if (counter === 9 && returnData === 'false') {
                await curPage.edit({
                    content: `This game ended in a tie! You wasted your time.`
                })
            } else if (returnData === 'false' && counter < 9){
                let buttons = await buttonCheck(row1, row2, row3)
                await curPage.edit({content: `The game has ended with no winner.`, components: buttons})
            }
        })
    }
}