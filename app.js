'use strict'
const Koa = require('koa')
const koaBody = require('koa-body')
const Router = require('koa-router')
const koajwt = require('koa-jwt')
const key = require('./server/routes/key.js')
const auth = require('./server/routes/auth.js')

const app = new Koa()
const router = new Router()

app.use((ctx, next) => {
    return next().catch(err => {
        if (err.status === 401) {
            if (ctx.url === '/auth/check') {
                ctx.response.status = 200;
                ctx.response.body = {
                    status: 'fail',
                    isLogin: false
                };
            } else {
                ctx.response.status = 401;
                ctx.response.body = {
                    status: 'fail',
                    msg: '用户未登录'
                };
            }
        } else {
            throw (err)
        }
    })
})

router.use('/auth', auth.routes())
app.use(koajwt({ secret: key.jwt_key }).unless({ path: ['/auth/login'] }))
app.use(koaBody({ multipart: true, strict: false }))

app.use(router.routes())
app.listen(8989, () => {
    console.log('Koa开始监听8989端口')
})