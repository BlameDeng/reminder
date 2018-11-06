<template>
    <div class="todos">
        <div class="add" @click="onClickAdd">
            <x-icon name="add" class="icon" :class="{rotate:dialogVisible}"></x-icon>
        </div>
        <div class="content">
            <template v-if="destTodos&&destTodos.length">
                <div class="dest" v-for="dest in destTodos" :key="dest.time">
                    <div class="time">{{dest.time}} {{days[new Date(dest.time).getDay()]}}</div>
                    <template v-if="dest.data&&dest.data.length">
                        <div class="todo" v-for="todo in dest.data" :key="todo.id">
                            <x-textarea v-model.trim="todo.content" @blur="onBlur(todo)"></x-textarea>
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
    import { mapState, mapMutations, mapActions } from 'vuex'
    export default {
        name: 'xTodos',
        mixins: [],
        components: { xIcon, xDialog, xTextarea },
        props: {},
        data() {
            return {
                value: '',
                dialogVisible: false,
                destTodos: null,
                days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            }
        },
        computed: {
            ...mapState({
                allTodos: state => state.todo.allTodos
            })
        },
        watch: {
            allTodos(val) {
                let dest = []
                let map = {}
                val.forEach(todo => {
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
                this.destTodos = dest
            }
        },
        created() {},
        mounted() {},
        beforedestroy() {},
        methods: {
            ...mapMutations(['setUser', 'setLogin']),
            ...mapActions(['login']),
            onClickAdd() {
                this.dialogVisible = !this.dialogVisible
            },
            onBlur(todo) {
                console.log(todo);
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
                &:last-child{
                    padding-bottom: 6px;
                }
                >.time {
                    font-size: 12px;
                    padding: 5px 0;
                    color: $sub;
                    text-align: center;
                    background: rgb(245, 245, 245);
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
            z-index: 10;;
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