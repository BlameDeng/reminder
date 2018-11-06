import Leancloud from '@/http/leancloud.js'
const Todo = new Leancloud('Todo')

const state = {
    allTodos: null
}

const getters = {
    allDestTodos(state) {
        state.allTodos = state.allTodos || []
        return getDestTodos(state.allTodos)
    },
    processingTodos(state) {
        state.allTodos = state.allTodos || []
        let todos = state.allTodos.filter(todo => !todo.done)
        return getDestTodos(todos)
    },
    completedTodos(state) {
        state.allTodos = state.allTodos || []
        let todos = state.allTodos.filter(todo => todo.done)
        return getDestTodos(todos)
    }
}

const mutations = {
    setAllTodos(state, payload) {
        state.allTodos = payload
    },
    addTodo(state, payload) {
        state.allTodos = state.allTodos || []
        state.allTodos.push(payload)
    },
    updateTodo(state, payload) {
        let todo = null
        for (let i = 0; i < state.allTodos.length; i++) {
            if (state.allTodos[i].id === payload.id) {
                todo = state.allTodos[i]
                break
            }
        }
        if (todo) {
            let index = state.allTodos.indexOf(todo)
            state.allTodos.splice(index, 1, payload)
        }
    },
    filterTodo(state, payload) {
        state.allTodos = state.allTodos.filter(todo => todo.id !== payload)
    }
}

const actions = {
    async createTodo({ commit }, data) {
        let { content, time, done } = data
        let res = await Todo.create({ content, time, done }, 'TodoUser', data.uid)
        return res
    },
    async fetchTodos({ commit }, uid) {
        let res = await Todo.fetchByDependent('TodoUser', uid)
        return res
    },
    async patchTodo({ commit }, data) {
        let { id, content, time, done } = data
        let res = await Todo.update({ content, time, done }, id)
        return res
    },
    async destroyTodo({ commit }, id) {
        let res = await Todo.destroy(id)
        return res
    }
}

function getDestTodos(todos) {
    let dest = []
    let map = {}
    todos.forEach(todo => {
        if (!map[todo.time]) {
            dest.push({ time: todo.time, data: [todo] })
            map[todo.time] = true
        } else {
            for (let i = 0; i < dest.length; i++) {
                if (todo.time === dest[i].time) {
                    dest[i].data.push(todo)
                }
            }
        }
    })
    return dest.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
}

export default { state, getters, mutations, actions }