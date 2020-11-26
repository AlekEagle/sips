'use strict';

const randomRange = require('../functions/randomRange');

module.exports = {
    name: 'roll',

    exec: (client, msg, args) => {
        let max = 20;
        if (args[0] !== undefined) {
            max = parseInt(args[0].split(/d/i)[1]);
        }

        msg.channel.createMessage(`You rolled a \`${args[0].split(/d/i)[0] == 1 ? '' : parseInt(args[0].split(/d/i)[0]).toLocaleString()}d${max.toLocaleString()}\` and got \`${' '.repeat(parseInt(args[0].split(/d/i)[0] === '' ? 1 : args[0].split(/d/i)[0])).split('').map(() => randomRange(1, max)).reduce((a, b) => a + b, 0).toLocaleString()}\`!`);
    },

    options: {
        description: 'Roll dice',
        fullDescription: 'What do you think? It rolls dice',
        aliases: ['r', 'R', 'd', 'dice', 'die']
    }
}