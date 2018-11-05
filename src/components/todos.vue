<template>
    <div class="todos">
    </div>
</template>
<script>
    import { mapMutations, mapActions } from 'vuex'
    export default {
        name: 'Todos',
        mixins: [],
        components: {},
        props: {},
        data() {
            return {value:''}
        },
        computed: {},
        watch: {},
        created() {},
        mounted() {},
        beforedestroy() {},
        methods: {
            ...mapMutations(['setUser', 'setLogin']),
            ...mapActions(['login']),
        }
    }
</script>
<style scoped lang="scss">
    @import '@/assets/color.scss';
    @import '@/assets/common.scss';
    .todos {}
</style>