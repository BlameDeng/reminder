'use strict'
const path = require('path')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(undefined, undefined, undefined, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, './user.sqlite')
})


const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING
    },
    nickyname: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    uid: {
        type: Sequelize.STRING
    }
})

// User.sync({ force: true }).then(() => {
//     User.create({
//         username: 'blame',
//         nickyname: '灵魂治愈',
//         password: '123456',
//         uid:'5be05da6ee920a006616d3e2'
//     }).then(res => {
//         console.log(res.dataValues)
//     })
// })

// { dataValues: { id: 1, username: 'blame', nickyname: '灵魂治愈', password: '123456', uid:'5be05da6ee920a006616d3e2'
//  updatedAt: 2018 - 11 - 04 T13: 04: 07.600 Z, createdAt: 2018 - 11 - 04 T13: 04: 07.600 Z } }


module.exports = User