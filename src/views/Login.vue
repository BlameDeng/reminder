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
                <span class="label" :class="{[`on-focus`]:nameOnFocus||username}">Username</span>
                <input type="text" v-model.trim="username" @focus="nameOnFocus=true" @blur="nameOnFocus=false">
                <div class="line" :class="{active:nameOnFocus||username}"></div>
            </div>
            <div class="password">
                <span class="label" :class="{[`on-focus`]:pswOnFocus||password}">Password</span>
                <input type="text" v-model.trim="password" @focus="pswOnFocus=true" @blur="pswOnFocus=false" @keyup.enter="onClick">
                <div class="line" :class="{active:pswOnFocus||password}"></div>
            </div>
            <div class="button" role="button" @click="onClick">
                <span class="text">登录</span>
                <span class="wave" v-show="waveVisible" ref="wave"></span>
            </div>
            <span class="tips">如果账号未注册，将自动为您注册</span>
        </div>
    </div>
</template>
<script>
    import daily from '@/assets/daily.js'
    import { mapMutations, mapActions } from 'vuex'
    export default {
        name: 'Login',
        mixins: [],
        components: {},
        props: {},
        data() {
            return {
                username: '',
                password: '',
                info: '',
                nameOnFocus: false,
                pswOnFocus: false,
                waveVisible: false,
                timerId: null,
                sentence: null,
            }
        },
        computed: {},
        watch: {},
        created() {
            let index = Math.floor(Math.random() * daily.length)
            this.sentence = daily[index]
        },
        mounted() {

        },
        beforedestroy() {},
        methods: {
            ...mapMutations(['setUser', 'setLogin']),
            ...mapActions(['login']),
            onClick(e) {
                if (this.timerId) {
                    window.clearTimeout(this.timerId)
                    this.waveVisible = false
                }
                this.waveVisible = true
                this.timerId = setTimeout(() => {
                    this.waveVisible = false
                }, 300);
                let { offsetX: x, offsetY: y } = e
                let wave = this.$refs.wave
                wave.style.top = y + 'px'
                wave.style.left = x + 'px'
                if (!this.username || !this.password) {
                    this.info = '账号或密码不能为空哦~~'
                    return
                }
                this.login({ username: this.username, password: this.password })
                    .then(res => {
                        res.token ? localStorage.setItem('user', res.token) : ''
                        this.setUser(res.data)
                        this.setLogin(res.isLogin)
                        this.$router.push('/user')
                    })
                    .catch(error => {
                        this.info = error.msg
                    })
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/assets/color.scss';
    @import '@/assets/common.scss';
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
            >.username {
                @include input;
            }
            >.password {
                @include input;
            }
            >.button {
                width: 100px;
                height: 35px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                cursor: pointer;
                overflow: hidden;
                transition: all .2s linear;
                &:hover {
                    background: rgba(0, 0, 0, .08);
                }
                >.wave {
                    pointer-events: none;
                    position: absolute;
                    border-radius: inherit;
                    width: 5px;
                    height: 5px;
                    transform: translateX(-50%) translateY(-50%);
                    background: rgba(0, 0, 0, .04);
                    animation: wave-active .3s linear;
                }
                >.text {
                    pointer-events: none;
                    color: $p;
                    font-size: 16px;
                    line-height: 24px;
                    user-select: none;
                    background: transparent;
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
    @keyframes wave-active {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(50);
        }
    }
</style>