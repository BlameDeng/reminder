<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
    export default {
        name: 'App',
        data() {
            return {

            }
        },
        computed: {},
        watch: {},
        created() {},
        mounted() {},
        beforedestroy() {},
        methods: {

        }
    }
</script>
<style lang="scss">
    @import '@/assets/global.scss';
    @import '@/assets/color.scss';
    html, body {
        width: 100%;
        height: 100%;
    }
    #app {
        width: 100%;
        height: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>