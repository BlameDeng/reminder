<template>
    <div class="user">
        <header class="header">
            <div class="menu" @click="onClickMenu">
                <x-icon name="menu" style="width:20px;height:20px;"></x-icon>
            </div>
            <div class="logo">
                <x-icon name="logo" style="width:20px;height:20px;"></x-icon>
                <span class="text">Reminder</span>
            </div>
            <div class="userinfo" @click="onClickUserInfo">
                <x-icon name="login" style="width:20px;height:20px;" class="icon"></x-icon>
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
                        <li style="color:#36b1bf;">
                            <x-icon name="user" class="icon"></x-icon>
                            <span class="info">账号信息</span>
                        </li>
                        <li style="color:#52c41a;">
                            <x-icon name="introduction" class="icon"></x-icon>
                            <span class="info">项目介绍</span>
                        </li>
                        <li style="color:#0366d6;">
                            <x-icon name="github" class="icon"></x-icon>
                            <span class="info">GitHub</span>
                        </li>
                    </ul>
                </aside>
            </transition>
            <x-todos></x-todos>
        </main>
        <footer class="footer">
            <ul class="footer-nav">
                <li>
                    <x-wave>
                        <div class="wrapper">
                            <x-icon name="everything" class="icon"></x-icon>
                            <span class="text">Everything</span>
                        </div>
                    </x-wave>
                </li>
                <li>
                    <x-wave>
                        <div class="wrapper">
                            <x-icon name="processing" class="icon"></x-icon>
                            <span class="text">Processing</span>
                        </div>
                    </x-wave>
                </li>
                <li>
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
                patching: false
            }
        },
        computed: {
            ...mapState({
                user: state => state.user
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
            }
        },
        created() {},
        mounted() {},
        beforedestroy() {
            document.removeEventListener('click', this.listenDocument)
        },
        methods: {
            ...mapMutations(['setUser', 'setLogin']),
            ...mapActions(['logout', 'patch']),
            onClickMenu() {
                this.siderVisible = !this.siderVisible
            },
            onClickUserInfo() {
                this.actionVisible = true
            },
            listenDocument() {
                this.actionVisible = false
            },
            onClickAction(type) {
                if (type === 'logout') {
                    this.logout()
                        .then(res => {
                            console.log(res)
                            this.setUser(null)
                            this.setLogin(res.isLogin)
                            localStorage.removeItem('user')
                            this.$router.push('/')
                        })
                        .catch(error => {
                            console.log(error)
                        })
                } else {
                    this.changeType = type
                    this.dialogVisible = true
                }
            },
            closeDialog() {
                this.input = ''
                this.info = ''
                this.dialogVisible = false
                this.patching = false
            },
            onClick() {
                if (this.patching) { return }
                if (this.changeType === 'password') {
                    if (!this.input) {
                        this.info = '密码不能为空哦~~'
                        return
                    } else {
                        this.patching = true
                        this.patch({
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
                    }
                } else if (this.changeType === 'nickyname') {
                    this.patching = true
                    this.patch({
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
            background: $p;
            color: #fff;
            box-shadow: 0 4px 4px -4px rgba(0, 0, 0, 0.15);
            position: relative;
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
                >.icon {
                    margin-left: -20px;
                }
                >.username {
                    font-size: 16px;
                    margin-left: 4px;
                    width: 70px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            >.action {
                color: $main;
                position: absolute;
                top: 100%;
                right: 30px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                cursor: pointer;
                user-select: none;
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
                    top: 4px;
                    right: 4px;
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
            flex-grow: 1;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
            >.sider {
                width: 200px;
                height: 100%;
                flex-shrink: 0;
                box-shadow: 4px 0 4px -4px rgba(0, 0, 0, .15);
                >ul {
                    >li {
                        padding: 15px;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        cursor: pointer;
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
        >.footer {
            width: 100%;
            height: 60px;
            box-shadow: 0 -4px 4px -4px rgba(0, 0, 0, .15);
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
</style>