<template>
    <div class="todos">
        <div class="add" @click="onClickAdd">
            <x-icon name="add" class="icon"></x-icon>
        </div>
        <div class="dialog-wrapper">
            <x-dialog></x-dialog>
        </div>
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
            return { value: '' }
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
                console.log(1)
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
            }
        }
        >.dialog-wrapper {
            border: $borderbase;
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
        }
        @media (min-width: 768px) {
            >.dialog-wrapper {
                right: 100px;
                bottom: 20px;
                width: 400px;
                height: 500px;
                border-radius: 4px;
            }
        }
        @media (min-width: 1200px) {
            >.dialog-wrapper {
                width: 500px;
                height: 500px;
            }
        }
    }
</style>