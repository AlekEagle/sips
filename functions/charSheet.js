'use strict';

const Sequelize = require('sequelize');
class CharSheet extends Sequelize.Model { };

CharSheet.init({
    id: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING(50),
    class: Sequelize.JSON,
    race: Sequelize.JSON,
    abilityScores: Sequelize.ARRAY(Sequelize.INTEGER),
    inventory: Sequelize.JSON,
    features: Sequelize.ARRAY(Sequelize.STRING),
    hp: Sequelize.JSON,
    speed: Sequelize.INTEGER,
    backstory: Sequelize.STRING(2000)
}, {
    sequelize
});

CharSheet.sync({ force: true });

module.exports = {
    RACES: require("./data/races.json"),

    CLASSES: [{ name: "Fighter", hp: 10 }, { name: "Rogue", hp: 8 }, { name: "Cleric", hp: 8 }, { name: "Wizard", hp: 6 }],

    ABILITY_KEYS: ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'],

    async create(sheet) {
        return await CharSheet.create(sheet);
    },
    async get(id) {
        return await CharSheet.findOne({
            where: {
                id
            }
        });
    },
    async update(id, values) {
        let char = await CharSheet.findOne({
            where: {
                id
            }
        });
        return await char.update(values);
    },
    async destroy(id) {
        let char = await CharSheet.findOne({
            where: {
                id
            }
        });
        return await char.destroy();
    }
}