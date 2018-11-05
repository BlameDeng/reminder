import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import store from '../store'

const router = new Router({
    routes: [{
            path: '/',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/user',
            component: () => import('@/views/User.vue'),
            meta: { requiresLogin: true }
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresLogin)) {
        if (store.state.isLogin) {
            next()
        } else {
            next('/')
        }
    } else {
        next()
    }
})

export default router