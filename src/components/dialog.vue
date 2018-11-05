<template>
    <div class="dialog">
        <div class="action">
            <div class="choice">快速选择</div>
            <div class="datepicker">datepicker</div>
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
            return {}
        },
        computed: {},
        watch: {},
        created() {},
        mounted() {},
        beforedestroy() {},
        methods: {}
    }
</script>
<style scoped lang="scss">
    @import '@/assets/color.scss';
    .dialog {
        width: 100%;
        height: 100%;
        position: relative;
        padding: 20px;
        background: $p5;
        color: #fff;
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
            }
        }
    }
</style>