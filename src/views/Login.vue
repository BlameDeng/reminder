<template>
    <div class="login">
        <div class="logo" v-if="sentence">
            <p>{{sentence.en}}
                <br>
                {{sentence.zh}}
            </p>
        </div>
        <div class="dialog">
            <div class="title">
                <span class="welcome" v-if="!info">Welcome</span>
                <span class="info" v-else>{{info}}</span>
            </div>
            <div class="username">
                <x-input v-model.trim="username" placeholder="Username"></x-input>
            </div>
            <div class="password">
                <x-input v-model.trim="password" placeholder="Password"></x-input>
            </div>
            <div class="button" role="button">
                <x-wave @click="onClick">
                    <span class="text">登录</span>
                </x-wave>
            </div>
            <span class="tips">如果账号未注册，将自动为您注册</span>
        </div>
    </div>
</template>
<script>
    import daily from '@/assets/daily.js'
    import xInput from '@/components/input.vue'
    import xWave from '@/components/wave.vue'
    import { mapMutations, mapActions } from 'vuex'
    export default {
        name: 'Login',
        components: { xInput, xWave },
        data() {
            return {
                username: '',
                password: '',
                info: '',
                sentence: null,
            }
        },
        created() {
            let index = Math.floor(Math.random() * daily.length)
            this.sentence = daily[index]
        },
        methods: {
            ...mapMutations(['setUser', 'setLogin', 'addTodo']),
            ...mapActions(['login', 'createTodoUser', 'patchUser', 'createTodo']),
            onClick() {
                if (!this.username || !this.password) {
                    this.info = '账号或密码不能为空哦~~'
                    return
                }
                this.login({ username: this.username, password: this.password })
                    .then(res => {
                        res.token ? localStorage.setItem('user', res.token) : ''
                        if (res.data.uid) {
                            this.setUser(res.data)
                            this.setLogin(res.isLogin)
                            this.$router.push('/user')
                        } else {
                            let id = res.data.id
                            this.createTodoUser({ username: res.data.username })
                                .then(res => {
                                    let { id: uid } = res
                                    return this.patchUser({ id, uid })
                                })
                                .then(res => {
                                    this.setUser(res.data)
                                    this.setLogin(res.isLogin)
                                    this.$router.push('/user')
                                    let today = new Date()
                                    this.createTodo({ content: '欢迎使用 Todos', time: `${today.getFullYear()}-${this.fixed(today.getMonth()+1)}-${this.fixed(today.getDate())}`, done: false, uid: res.data.uid }).then(res => {
                                        let id = res.id
                                        let { content, done, time } = res.attributes
                                        this.addTodo({ id, content, done, time })
                                    })
                                })
                                .catch(error => {})
                        }
                    })
                    .catch(error => {
                        this.info = error.msg
                    })
            },
            fixed(n) {
                return n = n > 9 ? n : `0${n}`
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/assets/color.scss';
    .login {
        width: 100%;
        height: 100%;
        background: url('https://linkstore.oss-cn-shenzhen.aliyuncs.com/reminderbanner.jpg');
        background-position: center center;
        background-size: cover;
        >.logo {
            padding: 10px 0 0 20px;
            cursor: default;
            user-select: none;
            color: rgba(255, 255, 255, .85);
        }
        >.dialog {
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, .85);
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 4px;
            box-shadow: $shadow;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            >.title {
                user-select: none;
                text-align: center;
                color: $p;
                >.welcome {
                    font-size: 16px;
                    font-weight: 600;
                }
            }
            >.username, >.password {
                width: 240px;
            }
            >.button {
                width: 100px;
                height: 35px;
                border-radius: 4px;
                cursor: pointer;
                transition: all .2s linear;
                background: transparent;
                &:hover {
                    background: rgba(0, 0, 0, .04);
                }
                .text {
                    pointer-events: none;
                    color: $p;
                    font-size: 16px;
                    line-height: 24px;
                    user-select: none;
                }
            }
            >.tips {
                font-size: 12px;
                color: $sub;
                position: absolute;
                bottom: 4px;
                cursor: default;
                user-select: none;
            }
        }
    }
</style>