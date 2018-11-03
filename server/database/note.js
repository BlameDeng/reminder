'use strict';
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(undefined, undefined, undefined, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, './note.sqlite')
});

const Note = sequelize.define('note', {
    content: { type: Sequelize.STRING },
    uid: { type: Sequelize.INTEGER }
})

module.exports = Note;