<template>
    <div class="dialog">
        <div class="action">
            <div class="choice">
                <div @click="onChoice">快速选择</div>
                <div class="options" v-show="optionsVisible">
                    <div @click="onOption(0)">今天 {{days[new Date().getDay()]}}</div>
                    <div @click="onOption(1)">明天 {{days[(new Date().getDay()+1)%7]}}</div>
                    <div @click="onOption(2)">后天 {{days[(new Date().getDay()+2)%7]}}</div>
                </div>
            </div>
            <div class="datepicker">
                <input type="text" v-model.trim="year">/
                <input type="text" v-model.trim="month">/
                <input type="text" v-model.trim="date">
            </div>
            <div class="add">添加</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Dialog',
        mixins: [],
        components: {},
        props: {},
        data() {
            return {
                year: 0,
                month: 0,
                date: 0,
                optionsVisible: false,
                days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            }
        },
        computed: {},
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
        padding: 20px;
        color: #fff;
        border-radius: 4px;
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
                        padding: 0 25px;
                        text-align: center;
                        line-height: 40px;
                        &.options {
                            position: absolute;
                            left: 0;
                            bottom: 100%;
                            width: 100%;
                            padding: 0;
                            >div {
                                width: 100%;
                                font-size: 14px;
                                line-height: 40px;
                                background: transparent;
                                transition: all .2s ease-in-out;
                                &:hover {
                                    background: rgba(0, 0, 0, .09);
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
                        color: #fff;
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
        transition: opacity .2s ease-in-out;
    }
    .options-show-enter, .options-show-leave-to {
        opacity: 0;
    }
</style>