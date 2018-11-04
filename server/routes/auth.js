'use strict'
const Router = require('koa-router')
const router = new Router()
const crypto = require('crypto')
const User = require('../database/user.js')
const key = require('./key.js')

function encrypt(params) {
    const hmac = crypto.createHmac('sha256', key.hmac_key)
    hmac.update(params)
    return hmac.digest('hex')
}
// const register = async (ctx, next) => {
//   let data = ctx.request.body
//   const hmac = crypto.createHmac('sha256', key.hmac_key)
//   hmac.update(data.password)
//   let password = hmac.digest('hex')
//   let user = await User.findOne({ where: { username: data.username } })
//   ctx.response.status = 200
//   if (user) {
//     ctx.response.body = {
//       status: 'fail',
//       msg: '用户名已存在'
//     }
//   } else {
//     await User.create({ username: data.username, password }).then(user => {
//       let { username, id, createdAt, updatedAt } = user.dataValues
//       let token = jwt.sign({ username, id }, key.jwt_key, { expiresIn: '1h' })
//       ctx.response.body = {
//         status: 'success',
//         msg: '注册成功！',
//         data: { username, id, createdAt, updatedAt },
//         token,
//         isLogin: true
//       }
//     })
//   }
// }

const login = async (ctx, next) => {
    let data = ctx.request.body
    let result = await User.findOne({ where: { username: data.username } })
    ctx.response.status = 200
    if (result) {
        let { id, username, nickyname, password, createdAt, updatedAt } = result.dataValues
        if (encrypt(data.password) === password) {
            ctx.response.body = { status: 'success', msg: '登录成功', data: { id, username, nickyname, createdAt, updatedAt } }
        } else {
            ctx.response.body = { status: 'fail', msg: '密码不正确' }
        }
    } else {
        let password = encrypt(data.password)
        let user = await User.create({ username: data.username, password })
        let { id, username, nickyname, createdAt, updatedAt } = user.dataValues
        ctx.response.body = { status: 'success', msg: '注册成功', data: { id, username, nickyname, createdAt, updatedAt } }
    }
    // if (user) {
    //   const hmac = crypto.createHmac('sha256', key.hmac_key)
    //   hmac.update(data.password)
    //   let password = hmac.digest('hex')
    //   if (password === user.password) {
    //     let { username, id, createdAt, updatedAt } = user.dataValues
    //     let token = jwt.sign({ username, id }, key.jwt_key, { expiresIn: '1h' })
    //     ctx.response.body = {
    //       status: 'success',
    //       data: { username, id, createdAt, updatedAt },
    //       token,
    //       isLogin: true
    //     }
    //   } else {
    //     ctx.response.body = { status: 'fail', msg: '密码不正确' }
    //   }
    // } else {
    //   ctx.response.body = { status: 'fail', msg: '用户名不存在' }
    // }
}

// const check = async (ctx, next) => {
//   ctx.response.status = 200
//   if (ctx.state && ctx.state.user) {
//     await User.findById(ctx.state.user.id).then(user => {
//       let { username, id, createdAt, updatedAt } = user.dataValues
//       ctx.response.body = {
//         status: 'success',
//         isLogin: true,
//         data: { username, id, createdAt, updatedAt }
//       }
//     })
//   } else {
//     ctx.response.body = {
//       status: 'success',
//       isLogin: false
//     }
//   }
// }

// const logout = async (ctx, next) => {
//   ctx.response.status = 200
//   if (ctx.state && ctx.state.user) {
//     ctx.response.body = { status: 'success', msg: '注销成功' }
//   } else {
//     ctx.response.body = { status: 'fail', msg: '用户尚未登录' }
//   }
// }

// const patch = async (ctx, next) => {
//   ctx.response.status = 200
//   let { id } = ctx.state.user
//   let { username, password } = ctx.request.body
//   let user = await User.findOne({ where: { id, username } })
//   const hmac = crypto.createHmac('sha256', key.hmac_key)
//   hmac.update(password)
//   password = hmac.digest('hex')
//   if (user) {
//     let array = await User.update({ password }, { where: { username, id } })
//     if (array[0] === 0) {
//       ctx.response.body = { status: 'fail', msg: '修改密码失败' }
//     } else {
//       let user = await User.findById(id)
//       let { createdAt, updatedAt } = user
//       let token = jwt.sign({ username, id }, key.jwt_key, { expiresIn: '1h' })
//       ctx.response.body = {
//         status: 'success',
//         token,
//         msg: '密码修改成功！',
//         data: { username, id, createdAt, updatedAt }
//       }
//     }
//   } else {
//     ctx.response.body = { status: 'fail', msg: '用户不存在' }
//   }
// }

router.post('/login', login)
// router.get('/check', check)
// router.get('/logout', logout)
// router.patch('/patch', patch)

module.exports = router