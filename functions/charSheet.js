'use strict';

const Sequelize = require('sequelize');

class CharSheet extends Sequelize.Model { };

CharSheet.init({
    id: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING(50),
    class: Sequelize.JSON,
    race: Sequelize.STRING(50),
    abilityScores: Sequelize.ARRAY(Sequelize.INTEGER),
    inventory: Sequelize.JSON,
    features: Sequelize.ARRAY(Sequelize.STRING),
    hp: Sequelize.JSON,
    speed: Sequelize.INTEGER,
    backstory: Sequelize.STRING(2000)
}, {
    sequelize
});

CharSheet.sync();

module.exports = {
    async create(sheet) {
        return await CharSheet.create(sheet);
    }
}