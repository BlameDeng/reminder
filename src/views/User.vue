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
                    <li @click="onClickAction('change')">修改密码</li>
                </ul>
            </transition>
        </header>
        <main class="main">
            <transition name="slide">
                <aside class="sider" v-show="siderVisible">
                    <ul>
                        <li>
                            <x-icon name="user" class="icon"></x-icon>
                            <span class="info">个人信息</span>
                        </li>
                        <li>
                            <x-icon name="list" class="icon"></x-icon>
                            <span class="info">全部事项</span>
                        </li>
                        <li>
                            <x-icon name="github" class="icon"></x-icon>
                            <span class="info">GitHub</span>
                        </li>
                    </ul>
                </aside>
            </transition>

        </main>
        <footer class="footer">footer</footer>
    </div>
</template>
<script>
    import xIcon from '@/components/icon/icon.vue'
    import { mapState, mapMutations, mapActions } from 'vuex'
    export default {
        name: 'User',
        mixins: [],
        components: { xIcon },
        props: {},
        data() {
            return {
                siderVisible: false,
                actionVisible: false
            }
        },
        computed: {
            ...mapState({
                user: state => state.user
            })
        },
        watch: {
            actionVisible(val) {
                val ? document.addEventListener('click', this.listenDocument) : document.removeEventListener('click', this.listenDocument)
            }
        },
        created() {},
        mounted() {},
        beforedestroy() {
            document.removeEventListener('click', this.listenDocument)
        },
        methods: {
            ...mapMutations(['setUser', 'setLogin']),
            ...mapActions(['logout']),
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
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/assets/global.scss';
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
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                border-radius: 2px;
                background: transparent;
                transition: all .2s linear;
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
                padding-left: 30px;
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
                    transition: all .2s linear;
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
        >.main {
            flex-grow: 1;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
            >.sider {
                width: 150px;
                height: 100%;
                flex-shrink: 0;
                box-shadow: 4px 0 4px -4px rgba(0, 0, 0, 0.15);
                >ul {
                    >li {
                        padding: 0.5em;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        cursor: pointer;
                        &:hover {
                            background: $bg;
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
            box-shadow: 0 -4px 4px -4px rgba(0, 0, 0, 0.15);
        }
    }
    .slide-enter-active,
    .slide-leave-active {
        transition: transform .4s ease-in-out;
    }
    .slide-enter,
    .slide-leave-to {
        transform: translateX(-100%);
    }
    .slide-enter-to,
    .slide-leave {
        transform: translateX(0);
    }
    .action-slide-enter-active, .action-slide-leave-active {
        transition: all .4s ease-in-out;
        overflow: hidden;
    }
    .action-slide-enter, .action-slide-leave-to {
        height: 0;
    }
    .action-slide-enter-to, .action-slide-leave {
        height: 60px;
    }
</style>