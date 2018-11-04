import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import request from '@/request/request.js'

const URL = {
    login: '/auth/login',
    logout: '/auth/logout'
}

export default new Vuex.Store({
    state: {
        user: null,
        isLogin: false
    },
    getters: {},
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setLogin(state, payload) {
            state.isLogin = payload
        }
    },
    actions: {
        async login({ commit }, data) {
            let res = await request({ url: URL.login, method: 'POST', data })
            console.log(res)
            return res
        }
    }
})