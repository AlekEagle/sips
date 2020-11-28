'use strict';

const ReactionMenu = require('../functions/reactionMenu'),
    CharacterSheet = require('../functions/charSheet');

module.exports = {
    name: 'createchar',

    exec: async (client, msg, args) => {
        let char = {};
        if ((await CharacterSheet.get(msg.author.id)) !== null) {
            msg.channel.createMessage('We don\'t support multiple character sheets yet! Sorry!');
        } else {
            let message = await msg.channel.createMessage('Alright, what is your character\'s name? (limit to 50 characters)');
            async function afterName() {
                let selection = 0;
                let menu = new ReactionMenu(client, msg, msg.author.id, function () {
                    return {
                        embed: {
                            title: `Pick ${char.name}'s race`,
                            fields: CharacterSheet.RACES.map((o, i, s) => {
                                let fieldVal = o.abilityBonuses.map((oo, ii, ss) => {
                                    return oo !== 0 ? `${CharacterSheet.ABILITY_KEYS[ii]}: ${oo}` : null
                                }).filter(s => s !== null)
                                return {
                                    name: `${selection === i ? '> ' : ''}${o.name}`,
                                    value: `Attribute Bonuses: \`\`\`\n${fieldVal.length < 1 ? 'none' : fieldVal.join('\n')}\n\`\`\`\nSubclasses: \`\`\`\n${o.subclass.length < 1 ? 'none' : o.subclass.map(e => e.name).join('\n')}\n\`\`\``,
                                    inline: true
                                };
                            }),
                            footer: {
                                text: 'gg'
                            }
                        }
                    }
                }, ['⬆', '⬇', '⏺', '⏹'], '5m');
                menu.addState('class', {
                    message: "hi"
                });
                menu.addEmoji('default', '⬆', function () {
                    if (--selection < 0) selection = CharacterSheet.RACES.length - 1;
                });
                menu.addEmoji('default', '⬇', function () {
                    if (++selection > CharacterSheet.RACES.length - 1) selection = 0;
                });
                menu.addEmoji('default', '⏺', function () {
                    char.race = CharacterSheet.RACES[selection];
                    if (char.race.subclass.length > 0) {
                        menu.setState('subclass');
                    } else {
                        menu.setState('class');
                    }
                });

            }
            async function characterName(mesg) {
                if (mesg.channel.id !== msg.channel.id || mesg.author.id !== msg.author.id) return;
                client.off('messageCreate', characterName);
                char.name = mesg.content;
                mesg.delete();
                message.delete();
                afterName();
                return;
            }
            client.on('messageCreate', characterName);
        }
    }
}