<template>
    <div class="todos">
        <div class="add" @click="onClickAdd">
            <x-icon name="add" class="icon" :class="{rotate:dialogVisible}"></x-icon>
        </div>
        <div class="content">
            <template v-if="allDestTodos&&allDestTodos.length&&visibleType==='all'">
                <div class="dest" v-for="dest in allDestTodos" :key="dest.time">
                    <div class="time">
                        <span class="relative" :class="{today:relativeTime(dest.time)==='今天'}">{{relativeTime(dest.time)}}</span>
                        {{dest.time}} {{days[new Date(dest.time).getDay()]}}
                    </div>
                    <template v-if="dest.data&&dest.data.length">
                        <div class="todo" v-for="todo in dest.data" :key="todo.id">
                            <div class="checkbox" :class="{checked:todo.done}" @click="onChecked(todo)">
                                <div class="sign"></div>
                            </div>
                            <x-textarea v-model.trim="todo.content" @blur="onBlur(todo)" :line-through="todo.done"></x-textarea>
                            <x-icon name="close" class="icon" @click="onDelete(todo)"></x-icon>
                        </div>
                    </template>
                </div>
            </template>
            <template v-if="processingTodos&&processingTodos.length&&visibleType==='processing'">
                <div class="dest" v-for="dest in processingTodos" :key="dest.time">
                    <div class="time">
                        <span class="relative" :class="{today:relativeTime(dest.time)==='今天'}">{{relativeTime(dest.time)}}</span>
                        {{dest.time}} {{days[new Date(dest.time).getDay()]}}
                    </div>
                    <template v-if="dest.data&&dest.data.length">
                        <div class="todo" v-for="todo in dest.data" :key="todo.id">
                            <div class="checkbox" :class="{checked:todo.done}" @click="onChecked(todo)">
                                <div class="sign"></div>
                            </div>
                            <x-textarea v-model.trim="todo.content" @blur="onBlur(todo)" :line-through="todo.done"></x-textarea>
                            <x-icon name="close" class="icon" @click="onDelete(todo)"></x-icon>
                        </div>
                    </template>
                </div>
            </template>
            <template v-if="completedTodos&&completedTodos.length&&visibleType==='completed'">
                <div class="dest" v-for="dest in completedTodos" :key="dest.time">
                    <div class="time">
                        <span class="relative" :class="{today:relativeTime(dest.time)==='今天'}">{{relativeTime(dest.time)}}</span>
                        {{dest.time}} {{days[new Date(dest.time).getDay()]}}
                    </div>
                    <template v-if="dest.data&&dest.data.length">
                        <div class="todo" v-for="todo in dest.data" :key="todo.id">
                            <div class="checkbox" :class="{checked:todo.done}" @click="onChecked(todo)">
                                <div class="sign"></div>
                            </div>
                            <x-textarea v-model.trim="todo.content" @blur="onBlur(todo)" :line-through="todo.done"></x-textarea>
                            <x-icon name="close" class="icon" @click="onDelete(todo)"></x-icon>
                        </div>
                    </template>
                </div>
            </template>
        </div>
        <transition name="dialog-show">
            <div class="dialog-wrapper" v-show="dialogVisible">
                <x-dialog @close-dialog="dialogVisible=false"></x-dialog>
            </div>
        </transition>
    </div>
</template>
<script>
    import xIcon from '@/components/icon/icon.vue'
    import xDialog from '@/components/dialog.vue'
    import xTextarea from '@/components/textarea.vue'
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    export default {
        name: 'xTodos',
        mixins: [],
        components: { xIcon, xDialog, xTextarea },
        props: { visibleType: { type: String, default: 'all' } },
        data() {
            return {
                value: '',
                dialogVisible: false,
                days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                changing: false
            }
        },
        computed: {
            ...mapState({
                allTodos: state => state.todo.allTodos
            }),
            ...mapGetters(['processingTodos', 'completedTodos', 'allDestTodos'])
        },
        created() {},
        mounted() {},
        beforedestroy() {},
        methods: {
            ...mapMutations(['setUser', 'setLogin', 'updateTodo', 'filterTodo']),
            ...mapActions(['login', 'patchTodo', 'destroyTodo']),
            onClickAdd() {
                this.dialogVisible = !this.dialogVisible
            },
            onBlur(todo) {
                if (this.changing) return
                this.changing = true
                this.patchTodo(todo)
                    .then(res => {
                        let id = res.id
                        let { content, time, done } = res.attributes
                        this.updateTodo({ id, content, time, done })
                        this.changing = false
                    })
                    .catch(error => {
                        this.changing = false
                    })
            },
            onChecked(todo) {
                if (this.changing) return
                this.changing = true
                let { id, content, time, done } = todo
                this.patchTodo({ id, content, time, done: !done })
                    .then(res => {
                        let id = res.id
                        let { content, time, done } = res.attributes
                        this.updateTodo({ id, content, time, done })
                        this.changing = false
                    })
                    .catch(error => {
                        this.changing = false
                    })
            },
            onDelete(todo) {
                this.destroyTodo(todo.id)
                    .then(res => {
                        this.filterTodo(todo.id)
                    })
                    .catch(error => {})
            },
            relativeTime(params) {
                let dateObj
                if (params && typeof params === 'object') {
                    dateObj = params
                } else {
                    dateObj = new Date(params)
                }
                let now = Date.now()
                let space = dateObj.getTime() - now
                let n = Math.floor(space / (1000 * 60 * 60 * 24))
                let str = ''
                switch (n) {
                    case -3:
                        str = '前天'
                        break
                    case -2:
                        str = '昨天'
                        break
                    case -1:
                        str = '今天'
                        break
                    case 0:
                        str = '明天'
                        break
                    case 1:
                        str = '后天'
                        break
                    default:
                        str = n > 0 ? `${n+1}天后` : `${-(n+1)}天前`
                        break
                }
                return str
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/assets/color.scss';
    .todos {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-x: hidden;
        overflow-y: scroll;
        >.add {
            width: 70px;
            height: 70px;
            position: fixed;
            z-index: 8;
            right: 20px;
            bottom: 80px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: $p5;
            transition: all .2s ease-in-out;
            cursor: pointer;
            &:hover {
                background: $p4;
            }
            >.icon {
                color: rgba(255, 255, 255, .85);
                width: 30px;
                height: 30px;
                transition: transform .2s linear;
                &.rotate {
                    transform: rotateZ(-45deg);
                }
            }
        }
        >.content {
            background: #fff;
            width: 100%;
            min-height: 100%;
            >.dest {
                border-radius: 4px;
                &:last-child {
                    padding-bottom: 6px;
                }
                >.time {
                    font-size: 12px;
                    padding: 5px 0;
                    color: $sub;
                    text-align: center;
                    background: rgb(245, 245, 245);
                    position: relative;
                    >.relative {
                        position: absolute;
                        top: 50%;
                        left: 20px;
                        transform: translateY(-50%);
                        font-size: 12px;
                        cursor: default;
                        user-select: none;
                        &.today {
                            background: $p4;
                            padding: 1px 6px;
                            border-radius: 4px;
                            color: #fff;
                        }
                    }
                }
                >.todo {
                    position: relative;
                    margin: 10px 40px 6px;
                    &::after {
                        content: '';
                        display: block;
                        border-bottom: $borderbase;
                        width: 200%;
                        height: 200%;
                        position: absolute;
                        left: -50%;
                        top: -50%;
                        pointer-events: none;
                        transform: scale(.5);
                    }
                    >.checkbox {
                        position: absolute;
                        top: 50%;
                        left: -20px;
                        width: 16px;
                        height: 16px;
                        transform: translateY(-65%);
                        border-radius: 2px;
                        border: 2px solid $border;
                        cursor: pointer;
                        transition: all .2s ease-in-out;
                        background: transparent;
                        &:hover {
                            border-color: $p5;
                        }
                        &.checked {
                            border-color: $p5;
                            background: $p5;
                            >.sign {
                                width: 10px;
                                height: 5px;
                                border: 2px solid #fff;
                                border-top: none;
                                border-right: none;
                                transform: rotateZ(-45deg) translateY(3px) translateX(-1px);
                            }
                        }
                    }
                    >.icon {
                        width: 20px;
                        height: 20px;
                        position: absolute;
                        top: 50%;
                        right: -20px;
                        transform: translateY(-65%);
                        color: transparent;
                        cursor: pointer;
                        transition: all .3s ease-in-out;
                    }
                    &:hover {
                        >.icon {
                            color: $error;
                        }
                    }
                }
            }
        }
        @media(min-width: 768px) {
            >.content {
                margin: 0 auto;
                width: 580px;
            }
        }
        @media(min-width: 1024px) {
            >.content {
                width: 800px;
            }
        }
        @media(min-width: 1200px) {
            >.content {
                max-width: 1000px;
            }
        }
        >.dialog-wrapper {
            position: fixed;
            z-index: 10;
            ;
            right: 0;
            bottom: 60px;
            width: 100%;
            height: 50%;
            box-shadow: 2px 2px 8px rgba(0, 0, 0, .15);
            background: linear-gradient(to right, $p5, #fff);
        }
        @media (min-width: 768px) {
            >.dialog-wrapper {
                right: 100px;
                bottom: 80px;
                width: 400px;
                height: 300px;
                border-radius: 4px;
                background: $p3;
            }
        }
        @media (min-width: 1200px) {
            >.dialog-wrapper {
                width: 500px;
                height: 300px;
            }
        }
    }
    .dialog-show-enter-active, .dialog-show-leave-active {
        transition: all .2s ease-in-out;
    }
    .dialog-show-enter, .dialog-show-leave-to {
        opacity: 0;
        transform: translateY(-80px);
    }
    .dialog-show-enter-to, .dialog-show-leave {
        opacity: 1;
        transform: translateY(0);
    }
</style>