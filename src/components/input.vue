<template>
    <div class="x-input" role="input">
        <span class="label" v-if="placeholder" :class="{[`on-focus`]:onFocus||value}">{{placeholder}}</span>
        <input type="text" :value="value" @focus="focus" @blur="blur" @change="$emit('change',$event)" @input="$emit('input',$event.target.value)">
        <div class="line" :class="{active:onFocus||value}"></div>
    </div>
</template>
<script>
    export default {
        name: 'xInput',
        props: {
            value: String,
            placeholder: String
        },
        data() {
            return {
                onFocus: false,
            }
        },
        methods: {
            focus(e) {
                this.$emit('focus', e)
                this.onFocus = true
            },
            blur(e) {
                this.$emit('blur', e)
                this.onFocus = false
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/assets/color.scss';
    .x-input {
        position: relative;
        width: 100%;
        >input {
            background: transparent;
            border: none;
            border-bottom: $borderbase;
            width: 100%;
            font-size: 16px;
            line-height: 24px;
            padding: 2px 0;
            color: $main;
            &:focus {
                outline: none;
            }
        }
        >.label {
            position: absolute;
            color: $sub;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            transition: all .3s ease-in-out;
            font-size: 16px;
            line-height: 24px;
            pointer-events: none;
            user-select: none;
            &.on-focus {
                font-size: 12px;
                line-height: 20px;
                color: $p;
                transform: translateY(-170%);
            }
        }
        >.line {
            position: absolute;
            left: 50%;
            bottom: 0;
            height: 3px;
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