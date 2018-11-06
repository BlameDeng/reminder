<template>
    <div class="todos">
        <div class="add" @click="onClickAdd">
            <x-icon name="add" class="icon" :class="{rotate:dialogVisible}"></x-icon>
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
    import { mapMutations, mapActions } from 'vuex'
    export default {
        name: 'xTodos',
        mixins: [],
        components: { xIcon, xDialog },
        props: {},
        data() {
            return { value: '', dialogVisible: false }
        },
        computed: {},
        watch: {},
        created() {},
        mounted() {},
        beforedestroy() {},
        methods: {
            ...mapMutations(['setUser', 'setLogin']),
            ...mapActions(['login']),
            onClickAdd() {
                this.dialogVisible = !this.dialogVisible
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
        >.add {
            width: 70px;
            height: 70px;
            position: absolute;
            right: 20px;
            bottom: 20px;
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
        >.dialog-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 50%;
            box-shadow: 2px 2px 8px rgba(0, 0, 0, .15);
            background: linear-gradient(to right, $p5, #fff);
        }
        @media (min-width: 768px) {
            >.dialog-wrapper {
                right: 100px;
                bottom: 20px;
                width: 400px;
                height: 300px;
                border-radius: 4px;
                background: $p4;
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