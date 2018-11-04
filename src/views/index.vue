<template>
    <div class="index">
        <header class="header">
            <div class="menu" @click="onClickMenu">
                <x-icon name="menu" style="width:20px;height:20px;"></x-icon>
            </div>
            <div class="logo">
                <x-icon name="logo" style="width:20px;height:20px;"></x-icon>
                <span class="text">Reminder</span>
            </div>
            <div class="userinfo">
                <x-icon name="login" style="width:20px;height:20px;"></x-icon>
                <span class="username">username</span>
            </div>
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
    export default {
        name: 'Index',
        mixins: [],
        components: { xIcon },
        props: {},
        data() {
            return {
                siderVisible: false
            }
        },
        computed: {},
        watch: {},
        created() {},
        mounted() {},
        beforedestroy() {},
        methods: {
            onClickMenu() {
                this.siderVisible = !this.siderVisible
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/assets/global.scss';
    @import '@/assets/color.scss';
    .index {
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
            padding: 0 20px;
            background: $p;
            color: #fff;
            box-shadow: 0 4px 4px -4px rgba(0, 0, 0, 0.15);
            >.menu {
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                border-radius: 2px;
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
                >.username {
                    font-size: 16px;
                    margin-left: 4px;
                    cursor: default;
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
</style>