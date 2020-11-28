'use strict';
require('dotenv').config();
const CommandClient = require('eris-command-handler'),
    Sequelize = require('sequelize'),
    fs = require('fs'),
    client = new CommandClient(process.env.TOKEN, {
        defaultImageFormat: "png",
        defaultImageSize: 2048,
        restMode: true
    },
        {
            description: "D&D Discord Bot",
            owner: "treeman0013#1081 and AlekEagle#0001",
            prefix: '!'
        }
    );

global.sequelize = new Sequelize(`postgres://alek:${process.env.DBPASS}@localhost:5432/alekeagle`, {
    logging: false
})

global.loadEvts = (reload) => {
    if (reload) {
        client.eventNames().forEach((e) => {
            if (e !== "ready") {
                var eventlisteners = client.rawListeners(e);
                if (
                    e === "messageReactionAdd" ||
                    e === "messageReactionRemove" ||
                    e === "messageCreate"
                ) {
                    eventlisteners = eventlisteners.slice(1);
                }
                eventlisteners.forEach((ev) => {
                    client.removeListener(e, ev);
                });
            }
        });
    }
    var events = fs.readdirSync("./events");
    console.log(`Loading ${events.length} events, please wait...`);
    events.forEach((e) => {
        if (reload) delete require.cache[require.resolve(`./events/${e}`)];
        var eventFile = require(`./events/${e}`);
        client.on(eventFile.name, (...args) => {
            eventFile.exec(client, ...args);
        });
    });
};

global.loadCmds = (reload) => {
    if (reload) {
        Object.values(client.commands)
            .map((c) => c.label)
            .filter((c) => c !== "help")
            .forEach((c) => {
                client.unregisterCommand(c);
            });
    }
    var commands = fs.readdirSync("./cmds");
    console.log(`Loading ${commands.length} commands, please wait...`);
    commands.forEach((c) => {
        if (reload) delete require.cache[require.resolve(`./cmds/${c}`)];
        var cmdFile = require(`./cmds/${c}`);
        client.registerCommand(
            cmdFile.name,
            (msg, args) => {
                try {
                    cmdFile.exec(client, msg, args);
                } catch (err) {
                    msg.channel.createMessage(
                        "An unexpected error has occured in the processing of this command, if the problem persists please contact Dad Bot's Support Team: https://alekeagle.com/d"
                    );
                    throw err;
                }
            },
            cmdFile.options
        );
    });
};


client.on('ready', () => {
    loadCmds();
    loadEvts();
})

















client.connect();