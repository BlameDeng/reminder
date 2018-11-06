<template>
    <div class="dialog">
        <x-icon name="close" class="icon" @click="$emit('close-dialog')"></x-icon>
        <textarea class="textarea" v-model.trim="content"></textarea>
        <div class="action">
            <div class="choice">
                <div @click="onChoice">快速选择</div>
                <transition name=options-show>
                    <div class="options" v-show="optionsVisible">
                        <div @click="onOption(0)">今天 {{days[new Date().getDay()]}}</div>
                        <div @click="onOption(1)">明天 {{days[(new Date().getDay()+1)%7]}}</div>
                        <div @click="onOption(2)">后天 {{days[(new Date().getDay()+2)%7]}}</div>
                        <div @click="onOption(3)">大后天 {{days[(new Date().getDay()+3)%7]}}</div>
                    </div>
                </transition>
            </div>
            <div class="datepicker">
                <input type="text" v-model.trim="year">/
                <input type="text" v-model.trim="month">/
                <input type="text" v-model.trim="date">
            </div>
            <div class="add" @click="onAddTodo">添加</div>
        </div>
    </div>
</template>
<script>
    import xIcon from '@/components/icon/icon.vue'
    import xTextarea from '@/components/textarea.vue'
    import { mapState, mapMutations, mapActions } from 'vuex'
    export default {
        name: 'Dialog',
        mixins: [],
        components: { xIcon, xTextarea },
        props: {},
        data() {
            return {
                year: 0,
                month: 0,
                date: 0,
                optionsVisible: false,
                days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                content: '',
                creating: false
            }
        },
        computed: {
            ...mapState({
                user: state => state.auth.user
            })
        },
        watch: {
            optionsVisible(val) {
                val ? document.addEventListener('click', this.listenDocument) : document.removeEventListener('click', this.listenDocument)
            }
        },
        created() { this.initDate() },
        mounted() {},
        beforedestroy() {
            document.removeEventListener('click', this.listenDocument)
        },
        methods: {
            ...mapMutations(['addTodo']),
            ...mapActions(['createTodo']),
            initDate(n) {
                let timeObj
                if (n) {
                    timeObj = new Date(n)
                } else {
                    timeObj = new Date()
                }
                this.year = timeObj.getFullYear()
                this.month = timeObj.getMonth() + 1
                this.date = timeObj.getDate()
            },
            onChoice() {
                this.optionsVisible = true
            },
            listenDocument() {
                this.optionsVisible = false
            },
            onOption(n) {
                let now = Date.now()
                n ? this.initDate(now + 1000 * 60 * 60 * 24 * n) : this.initDate()
            },
            fixed(n) {
                return n = n > 9 ? n : `0${n}`
            },
            onAddTodo() {
                if (!this.content || this.creating) { return }
                this.creating = true
                this.createTodo({ content: this.content, time: `${this.year}-${this.fixed(this.month)}-${this.fixed(this.date)}`, done: false, uid: this.user.uid })
                    .then(res => {
                        this.creating = false
                        this.content = ''
                        this.$emit('close-dialog')
                        this.initDate()
                        let id = res.id
                        let { content, done, time } = res.attributes
                        this.addTodo({ id, content, done, time })
                    })
                    .catch(error => {
                        this.creating = false
                    })
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/assets/color.scss';
    .dialog {
        width: 100%;
        height: 100%;
        position: relative;
        padding: 40px;
        padding-bottom: 50px;
        color: $main;
        border-radius: 4px;
        >.icon {
            position: absolute;
            color: $sub;
            top: 10px;
            right: 10px;
            width: 25px;
            height: 25px;
            cursor: pointer;
        }
        @media (min-width: 768px) {
            >.icon {
                display: none;
            }
        }
        >.textarea {
            resize: none;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            border: none;
            outline: none;
            padding: .5em;
            color: $main;
        }
        >.action {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div {
                padding: 0 25px;
                height: 40px;
                line-height: 40px;
                cursor: pointer;
                font-size: 16px;
                user-select: none;
                &.choice {
                    position: relative;
                    padding: 0;
                    >div {
                        font-size: 16px;
                        padding: 0 15px;
                        text-align: center;
                        line-height: 40px;
                        &.options {
                            position: absolute;
                            left: 0;
                            bottom: 100%;
                            width: 100%;
                            padding: 0;
                            background: #fff;
                            box-shadow: 2px 2px 8px rgba(0, 0, 0, .15);
                            border-radius: 4px;
                            >div {
                                width: 100%;
                                font-size: 12px;
                                line-height: 28px;
                                background: transparent;
                                transition: all .2s ease-in-out;
                                &:hover {
                                    background: rgba(0, 0, 0, .09);
                                }
                                &:first-child {
                                    border-top-left-radius: 4px;
                                    border-top-right-radius: 4px;
                                }
                                &:last-child {
                                    border-bottom-left-radius: 4px;
                                    border-bottom-right-radius: 4px;
                                }
                            }
                        }
                    }
                }
                &.datepicker {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    >input {
                        width: 20px;
                        text-align: center;
                        border: none;
                        box-shadow: none;
                        background: none;
                        cursor: default;
                        color: $main;
                        font-size: 16px;
                        &:focus {
                            outline: none;
                        }
                        &:first-child {
                            width: 40px;
                        }
                    }
                }
                &.add {
                    line-height: 40px;
                }
            }
        }
    }
    .options-show-enter-active, .options-show-leave-active {
        transition: opacity .3s ease-in-out;
    }
    .options-show-enter, .options-show-leave-to {
        opacity: 0;
    }
</style>