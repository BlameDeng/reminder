<template>
    <div class="wave" @click="onClick">
        <div class="slot-wrapper">
            <slot></slot>
        </div>
        <span class="wave" v-show="waveVisible" ref="wave" :style="xStyle"></span>
    </div>
</template>
<script>
    export default {
        name: 'xWave',
        mixins: [],
        components: {},
        props: {
            duration: { type: Number, default: 500 }
        },
        data() {
            return {
                waveVisible: false
            }
        },
        computed: {
            xStyle() {
                return {
                    ['animation-duration']: `${this.duration}ms`
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.wave.addEventListener('animationend', this.endWave)
            })
        },
        beforedestroy() {
            this.$refs.wave.removeEventListener('animationend', this.endWave)
        },
        methods: {
            onClick(e) {
                this.$emit('click', e)
                if (this.waveVisible) { return }
                let { offsetX: x, offsetY: y } = e
                this.waveVisible = true
                this.$refs.wave.style.top = y + 'px'
                this.$refs.wave.style.left = x + 'px'
            },
            endWave() {
                this.waveVisible = false
            }
        }
    }
</script>
<style scoped lang="scss">
    .wave {
        width: 100%;
        height: 100%;
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        cursor: pointer;
        overflow: hidden;
        >.slot-wrapper {
            pointer-events: none;
        }
        >.wave {
            pointer-events: none;
            position: absolute;
            border-radius: inherit;
            width: 5px;
            height: 5px;
            transform: translateX(-50%) translateY(-50%);
            background: rgba(0, 0, 0, .04);
            animation-name: wave-active;
            animation-timing-function: linear;
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