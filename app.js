'use strict'
const Koa = require('koa')
const koaBody = require('koa-body')
const Router = require('koa-router')
const auth = require('./server/routes/auth.js')

const app = new Koa()
const router = new Router()

router.use('/auth', auth.routes())
app.use(koaBody({ multipart: true, strict: false }))

app.use(router.routes())
app.listen(8989, () => {
    console.log('Koa开始监听8989端口')
})