'use strict'
const Router = require('koa-router')
const router = new Router()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../database/user.js')
const key = require('./key.js')

function encrypt(params) {
    const hmac = crypto.createHmac('sha256', key.hmac_key)
    hmac.update(params)
    return hmac.digest('hex')
}

const login = async (ctx, next) => {
    let data = ctx.request.body
    let result = await User.findOne({ where: { username: data.username } })
    ctx.response.status = 200
    if (result) {
        let { id, username, nickyname, uid, password, createdAt, updatedAt } = result.dataValues
        if (encrypt(data.password) === password) {
            let token = jwt.sign({ username, id }, key.jwt_key, { expiresIn: '1h' })
            ctx.response.body = { status: 'success', msg: '登录成功', isLogin: true, token, data: { id, username, nickyname, uid, createdAt, updatedAt } }
        } else {
            ctx.response.body = { status: 'fail', msg: '密码不正确', isLogin: false }
        }
    } else {
        let password = encrypt(data.password)
        let user = await User.create({ username: data.username, password })
        let { id, username, nickyname, uid, createdAt, updatedAt } = user.dataValues
        let token = jwt.sign({ username, id }, key.jwt_key, { expiresIn: '1h' })
        ctx.response.body = { status: 'success', msg: '注册成功', isLogin: true, token, data: { id, username, nickyname, uid, createdAt, updatedAt } }
    }
}

const check = async (ctx, next) => {
    ctx.response.status = 200
    if (ctx.state && ctx.state.user) {
        await User.findById(ctx.state.user.id).then(user => {
            if (user) {
                let { id, username, nickyname, uid, createdAt, updatedAt } = user.dataValues
                ctx.response.body = {
                    status: 'success',
                    isLogin: true,
                    data: { id, username, nickyname, uid, createdAt, updatedAt }
                }
            } else {
                ctx.response.body = {
                    status: 'fail',
                    msg: '用户不存在',
                    isLogin: false
                }
            }
        })
    } else {
        ctx.response.body = {
            status: 'fail',
            msg: '用户未登录',
            isLogin: false
        }
    }
}

const logout = async (ctx, next) => {
    ctx.response.status = 200
    if (ctx.state && ctx.state.user) {
        ctx.response.body = { status: 'success', msg: '注销成功', isLogin: false }
    } else {
        ctx.response.body = { status: 'fail', msg: '用户尚未登录', isLogin: false }
    }
}

const patch = async (ctx, next) => {
    ctx.response.status = 200
    let data = ctx.request.body
    let user = await User.findById(data.id)
    if (!user) {
        ctx.response.body = { status: 'fail', msg: '用户不存在' }
        return
    }
    let result = []
    if (data.password) {
        let password = encrypt(data.password)
        //返回值是个数字数组
        result = await User.update({ password }, { where: { id: data.id } })
    } else if (data.nickyname) {
        result = await User.update({ nickyname: data.nickyname }, { where: { id: data.id } })
    } else if (data.uid) {
        result = await User.update({ uid: data.uid }, { where: { id: data.id } })
    }
    if (result[0]) {
        let user = await User.findById(data.id)
        let { id, username, nickyname, uid, createdAt, updatedAt } = user.dataValues
        ctx.response.body = { status: 'success', msg: '修改成功', isLogin: true, data: { id, username, nickyname, uid, createdAt, updatedAt } }
    } else {
        ctx.response.body = { status: 'fail', msg: '系统异常，修改失败' }
    }
}

router.post('/login', login)
router.get('/check', check)
router.get('/logout', logout)
router.patch('/patch', patch)

module.exports = router