import Leancloud from '@/http/leancloud.js'
const Todo = new Leancloud('Todo')

const state = {}

const getters = {}

const mutations = {}

const actions = {
    async createTodo({ commit }, data) {
        let { content, time } = data
        let res = await Todo.create({ content, time }, 'TodoUser', data.uid)
        console.log(res)
        return res
    }
}

export default { state, getters, mutations, actions }