'use strict';
const Router = require('koa-router');
const router = new Router();
const Note = require('../database/note.js');

const all = async (ctx, next) => {
    let uid = ctx.state.user.id;
    await Note.findAll({ where: { uid } }).then(notes => {
        ctx.response.status = 200;
        ctx.response.body = { status: 'success', data: notes };
    })
}

const create = async (ctx, next) => {
    let data = ctx.request.body;
    let uid = ctx.state.user.id;
    if (uid) {
        await Note.create({ uid, ...data }).then(note => {
            ctx.response.status = 200;
            ctx.response.body = { status: 'success', data: note.dataValues };
        })
    } else {
        ctx.response.status = 401;
        ctx.response.body = { status: 'fail', msg: '用户未登录' };
    }
}

const patch = async (ctx, next) => {
    let { id, content } = ctx.request.body;
    let note = await Note.findById(id);
    ctx.response.status = 200;
    if (note) {
        let array = await Note.update({ content }, { where: { id } });
        if (array[0] === 0) {
            ctx.response.body = { status: 'fail', msg: '更新失败' };
        } else {
            let note = await Note.findById(id);
            ctx.response.body = { status: 'success', data: note };
        }
    } else {
        ctx.response.body = { status: 'fail', msg: '笔记不存在' };
    }
}

const destroy = async (ctx, next) => {
    let id = ctx.request.body.id;
    await Note.destroy({ where: { id } }).then(res => {
        ctx.response.status = 200;
        ctx.response.body = { status: 'success', msg: '删除成功' };
    })
}

router.get('/all', all);
router.post('/create', create);
router.delete('/destroy', destroy);
router.patch('/patch', patch);

module.exports = router