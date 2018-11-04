import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

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
    actions: {}
})