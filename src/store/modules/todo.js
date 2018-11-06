import Leancloud from '@/http/leancloud.js'
const Todo = new Leancloud('Todo')

const state = {}

const getters = {}

const mutations = {}

const actions = {
    async createTodo({ commit }, data) {
        let { content, time, done } = data
        let res = await Todo.create({ content, time, done }, 'TodoUser', data.uid)
        console.log(res)
        return res
    }
}

export default { state, getters, mutations, actions }