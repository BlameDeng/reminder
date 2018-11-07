<template>
    <div class="user">
        <header class="header">
            <div class="menu" @click="onClickMenu">
                <x-icon name="menu" style="width:20px;height:20px;"></x-icon>
            </div>
            <div class="logo">
                <x-icon name="logo" style="width:24px;height:24px;"></x-icon>
                <span class="text">Todos</span>
            </div>
            <div class="userinfo" @click="onClickUserInfo">
                <x-icon name="login" style="width:18px;height:18px;" class="icon"></x-icon>
                <div class="username" v-if="user&&(user.username||user.nickyname)">{{user.nickyname||user.username}}</div>
            </div>
            <transition name="action-slide">
                <ul class="action" v-show="actionVisible">
                    <li @click="onClickAction('logout')">注销登录</li>
                    <li @click="onClickAction('password')">修改密码</li>
                    <li @click="onClickAction('nickyname')">修改昵称</li>
                </ul>
            </transition>
        </header>
        <transition name="dialog">
            <div class="mask" v-show="dialogVisible">
                <div class="dialog">
                    <x-icon name="close" class="icon" @click="closeDialog"></x-icon>
                    <div class="title">
                        <span class="welcome" v-if="!info">{{changeType==='password'?'请输入新密码':'请输入新昵称'}}</span>
                        <span class="info" v-else>{{info}}</span>
                    </div>
                    <div class="input">
                        <x-input v-model.trim="input" :placeholder="placeholder"></x-input>
                    </div>
                    <div class="button" role="button">
                        <x-wave @click="onClick">
                            <span class="text">确定</span>
                        </x-wave>
                    </div>
                </div>
            </div>
        </transition>
        <main class="main">
            <transition name="slide">
                <aside class="sider" v-show="siderVisible">
                    <ul>
                        <li style="color:#52c41a;" @click="onClickSider('introduction')">
                            <x-icon name="introduction" class="icon"></x-icon>
                            <span class="info">关于 Todos</span>
                        </li>
                        <li style="color:#0366d6;" @click="onClickSider('link')">
                            <x-icon name="github" class="icon"></x-icon>
                            <span class="info">GitHub</span>
                        </li>
                    </ul>
                </aside>
            </transition>
            <x-todos :visible-type="visibleType"></x-todos>
        </main>
        <transition name="fade">
            <div class="intro-mask" v-show="introductionVisible">
                <div class="introduction">
                    <x-icon name="close" class="icon" @click="introductionVisible=false"></x-icon>
                    <h3 style="text-align:center;">项目介绍</h3>
                    <p><span>Todos</span> 是一款轻量级的在线待办 <span>SPA</span>。支持登录注册、增删改查、云端同步。</p>
                    <p><span>前端：Vue + Vuex + Vue Router + axios + CSS3</span></p>
                    <p><span>部署：Node + Koa2 + Leancloud</span> 用户账号信息保存在服务器，支持 <span>token</span> 验证登录，<span>todos</span> 事项保存在 <span>leancloud</span></p>
                </div>
            </div>
        </transition>
        <footer class="footer">
            <ul class="footer-nav">
                <li @click="onClickFooterNav('all')">
                    <x-wave>
                        <div class="wrapper">
                            <x-icon name="everything" class="icon"></x-icon>
                            <span class="text">Everything</span>
                        </div>
                    </x-wave>
                </li>
                <li @click="onClickFooterNav('processing')">
                    <x-wave>
                        <div class="wrapper">
                            <x-icon name="processing" class="icon"></x-icon>
                            <span class="text">Processing</span>
                        </div>
                    </x-wave>
                </li>
                <li @click="onClickFooterNav('completed')">
                    <x-wave>
                        <div class="wrapper">
                            <x-icon name="completed" class="icon"></x-icon>
                            <span class="text">Completed</span>
                        </div>
                    </x-wave>
                </li>
            </ul>
        </footer>
    </div>
</template>
<script>
    import xIcon from '@/components/icon/icon.vue'
    import xInput from '@/components/input.vue'
    import xWave from '@/components/wave.vue'
    import xTodos from '@/components/todos.vue'
    import { mapState, mapMutations, mapActions } from 'vuex'
    export default {
        name: 'User',
        components: { xIcon, xInput, xWave, xTodos },
        data() {
            return {
                siderVisible: false,
                actionVisible: false,
                input: '',
                info: '',
                dialogVisible: false,
                changeType: '',
                changing: false,
                visibleType: 'all',
                introductionVisible: false
            }
        },
        computed: {
            ...mapState({
                user: state => state.auth.user
            }),
            placeholder() {
                if (this.changeType === 'password') {
                    return 'Password'
                } else if (this.changeType === 'nickyname') {
                    return 'Nickyname'
                }
            }
        },
        watch: {
            actionVisible(val) {
                val
                    ?
                    document.addEventListener('click', this.listenDocument) :
                    document.removeEventListener('click', this.listenDocument)
            },
            siderVisible(val) {
                val
                    ?
                    document.addEventListener('click', this.handleSider) :
                    document.removeEventListener('click', this.handleSider)
            }
        },
        mounted() {
            this.fetchTodos(this.user.uid)
                .then(todos => {
                    let array = []
                    todos.forEach(todo => {
                        let { id, attributes } = todo
                        let { content, done, time } = attributes
                        array.push({ id, content, done, time })
                    })
                    this.setAllTodos(array)
                })
        },
        beforedestroy() {
            document.removeEventListener('click', this.listenDocument)
            document.removeEventListener('click', this.handleSider)
        },
        methods: {
            ...mapMutations(['setUser', 'setLogin', 'setAllTodos']),
            ...mapActions(['logout', 'patchUser', 'fetchTodos']),
            onClickMenu() {
                this.siderVisible = true
            },
            onClickUserInfo() {
                this.actionVisible = true
            },
            handleSider() { this.siderVisible = false },
            listenDocument() {
                this.actionVisible = false
            },
            onClickAction(type) {
                if (type === 'logout') {
                    this.logout()
                        .then(res => {
                            this.setUser(null)
                            this.setLogin(res.isLogin)
                            localStorage.removeItem('user')
                            this.$router.push('/')
                        })
                        .catch(error => {})
                } else {
                    this.changeType = type
                    this.dialogVisible = true
                }
            },
            closeDialog() {
                this.input = ''
                this.info = ''
                this.dialogVisible = false
                this.changing = false
            },
            onClick() {
                if (this.changing) { return }
                if (this.changeType === 'password') {
                    if (!this.input) {
                        this.info = '密码不能为空哦~~'
                        return
                    }
                    this.changing = true
                    this.patchUser({
                            id: this.user.id,
                            username: this.user.username,
                            password: this.input
                        })
                        .then(res => {
                            this.setUser(res.data)
                            this.closeDialog()
                        })
                        .catch(error => {
                            this.closeDialog()
                        })
                } else if (this.changeType === 'nickyname') {
                    if (!this.input) {
                        this.info = '昵称不能为空哦~~'
                        return
                    }
                    this.changing = true
                    this.patchUser({
                            id: this.user.id,
                            username: this.user.username,
                            nickyname: this.input
                        })
                        .then(res => {
                            this.setUser(res.data)
                            this.closeDialog()
                        })
                        .catch(error => {
                            this.closeDialog()
                        })
                }
            },
            onClickSider(type) {
                if (type === 'link') {
                    window.open('https://github.com/BlameDeng/todos', '_blank')
                } else {
                    this.introductionVisible = true
                }
            },
            onClickFooterNav(type) {
                this.visibleType = type
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/assets/color.scss';
    .user {
        width: 100%;
        height: 100%;
        color: rgba(0, 0, 0, 0.65);
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        height: 100%;
        >.header {
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 30px;
            background: linear-gradient(to right, $p, #fff);
            color: #fff;
            box-shadow: 0 4px 4px -4px rgba(0, 0, 0, 0.15);
            position: relative;
            z-index: 10;
            >.menu {
                width: 35px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                border-radius: 2px;
                background: transparent;
                transition: all 0.2s linear;
                &:hover {
                    background: rgba(0, 0, 0, 0.15);
                }
            }
            >.logo {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                user-select: none;
                >.text {
                    font-size: 22px;
                    font-weight: 600;
                    margin-left: 4px;
                    font-style: italic;
                }
            }
            >.userinfo {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                height: 100%;
                width: 100px;
                position: relative;
                padding-left: 20px;
                color: $sub;
                >.icon {
                    margin-left: -20px;
                }
                >.username {
                    font-size: 14px;
                    margin-left: 4px;
                    width: 70px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    user-select: none;
                }
            }
            >.action {
                color: $main;
                position: absolute;
                top: 100%;
                right: 30px;
                z-index: 1;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                cursor: pointer;
                user-select: none;
                background: rgb(245, 245, 245);
                >li {
                    width: 100px;
                    padding: 4px 8px;
                    background: transparent;
                    transition: all 0.2s linear;
                    text-align: center;
                    &:hover {
                        background: $bg;
                    }
                    &:last-child {
                        border-bottom-left-radius: 4px;
                        border-bottom-right-radius: 4px;
                    }
                }
            }
        }
        >.mask {
            width: 100%;
            height: 100%;
            position: fixed;
            z-index: 5;
            background: rgba(0, 0, 0, 0.04);
            >.dialog {
                width: 300px;
                height: 200px;
                background: rgba(255, 255, 255, 0.85);
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
                >.icon {
                    color: $sub;
                    cursor: pointer;
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    &:hover {
                        color: $main;
                    }
                }
                >.title {
                    user-select: none;
                    text-align: center;
                    color: $p;
                    >.welcome {
                        font-size: 16px;
                        font-weight: 600;
                    }
                }
                >.input {
                    width: 240px;
                }
                >.button {
                    width: 100px;
                    height: 35px;
                    border-radius: 4px;
                    cursor: pointer;
                    background: transparent;
                    transition: all 0.2s linear;
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
            }
        }
        >.main {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
            position: relative;
            >.sider {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
                width: 200px;
                height: 100%;
                flex-shrink: 0;
                background: #fff;
                box-shadow: 4px 0 4px -4px rgba(0, 0, 0, .15);
                >ul {
                    >li {
                        padding: 15px;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        cursor: pointer;
                        background: transparent;
                        transition: all .2s ease-in-out;
                        &:hover {
                            background: $bg;
                        }
                        >.icon {
                            width: 18px;
                            height: 18px;
                        }
                        >.info {
                            display: inline-flex;
                            flex-grow: 1;
                            justify-content: center;
                            align-items: center;
                            user-select: none;
                        }
                    }
                }
            }
        }
        .intro-mask {
            position: fixed;
            z-index: 10;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .3);
            >.introduction {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                width: 100%;
                height: 400px;
                background: rgb(245, 245, 245);
                box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
                border-radius: 4px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: stretch;
                padding: 0 20px;
                >.icon {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    color: $sub;
                    &:hover {
                        color: $main;
                    }
                }
                span {
                    font-weight: 600;
                }
            }
            @media(min-width: 768px) {
                >.introduction {
                    margin: 0 auto;
                    width: 500px;
                }
            }
        }
        >.footer {
            width: 100%;
            height: 60px;
            box-shadow: 0 -4px 4px -4px rgba(0, 0, 0, .15);
            position: relative;
            z-index: 1;
            >.footer-nav {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                >li {
                    height: 100%;
                    background: transparent;
                    transition: all .2s linear;
                    &:hover {
                        background: rgba(0, 0, 0, .04);
                    }
                    .wrapper {
                        height: 100%;
                        padding: 0 30px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        color: $sub;
                        user-select: none;
                        .icon {
                            width: 25px;
                            height: 25px;
                        }
                    }
                }
            }
        }
    }
    .slide-enter-active,
    .slide-leave-active {
        transition: transform 0.4s ease-in-out;
    }
    .slide-enter,
    .slide-leave-to {
        transform: translateX(-100%);
    }
    .slide-enter-to,
    .slide-leave {
        transform: translateX(0);
    }
    .action-slide-enter-active,
    .action-slide-leave-active {
        transition: all 0.4s ease-in-out;
        overflow: hidden;
    }
    .action-slide-enter,
    .action-slide-leave-to {
        height: 0;
    }
    .action-slide-enter-to,
    .action-slide-leave {
        height: 90px;
    }
    .dialog-enter-active,
    .dialog-leave-active {
        transition: opacity 0.3s linear;
    }
    .dialog-enter,
    .dialog-leave-to {
        opacity: 0;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s ease-in-out;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>