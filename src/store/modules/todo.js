import Leancloud from '@/http/leancloud.js'
const Todo = new Leancloud('Todo')

const state = {
    allTodos: null
}

const getters = {}

const mutations = {
    setAllTodos(state, payload) {
        state.allTodos = payload
    }
}

const actions = {
    async createTodo({ commit }, data) {
        let { content, time, done } = data
        let res = await Todo.create({ content, time, done }, 'TodoUser', data.uid)
        console.log(res)
        return res
    },
    async fetchTodos({ commit }, uid) {
        let res = await Todo.fetchByDependent('TodoUser', uid)
        console.log(res)
        return res
    }
}

export default { state, getters, mutations, actions }