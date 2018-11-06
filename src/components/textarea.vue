<template>
    <div class="x-textarea" role="textarea">
        <textarea type="text" :value="value" @focus="focus" @blur="blur" @change="change" @input="$emit('input', $event.target.value)" ref="textarea" :class="{['line-through']:lineThrough}" :readonly="lineThrough"></textarea>
        <div class="line" :class="{active:onFocus}"></div>
    </div>
</template>
<script>
    export default {
        name: 'xTextarea',
        props: {
            value: String,
            lineThrough: Boolean
        },
        data() {
            return {
                onFocus: false,
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.handleHeight()
            })
        },
        methods: {
            focus(e) {
                this.$emit('focus', e)
                if (this.lineThrough) { return }
                this.onFocus = true
            },
            blur(e) {
                this.$emit('blur', e)
                this.onFocus = false
            },
            change(e) {
                this.$emit('change', e)
                this.handleHeight()
            },
            handleHeight() {
                let height = this.$refs.textarea.scrollHeight
                this.$el.style.height = height + 'px'
                this.$refs.textarea.height = height + 'px'
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/assets/color.scss';
    .x-textarea {
        position: relative;
        width: 100%;
        height: 25px;
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        >textarea {
            background: transparent;
            border: none;
            width: 100%;
            height: 100%;
            font-size: 14px;
            line-height: 22px;
            color: $main;
            resize: none;
            padding: 0 5px;
            &:focus {
                outline: none;
            }
            &.line-through {
                text-decoration: line-through;
                color: $sub;
                cursor: not-allowed;
            }
        }
        >.line {
            position: absolute;
            left: 50%;
            bottom: 0;
            height: 2px;
            width: 0;
            background: $p;
            transition: all .2s ease-in-out;
            border-radius: 1px;
            &.active {
                width: 100%;
                transform: translateX(-50%);
            }
        }
    }
</style>