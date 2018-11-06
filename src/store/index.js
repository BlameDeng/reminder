import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import auth from './modules/auth.js'
import todo from './modules/todo.js'

export default new Vuex.Store({
    modules: { auth, todo }
})