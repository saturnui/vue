<template>
  <slot v-bind="{ activeEl, setActive }"></slot>
</template>

<script lang="ts">
import {  defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const activeEl: HTMLElement | undefined = undefined

    const setActive = () => {
      emit('update:modelValue', 1)
    }

    return {
      activeEl,
      setActive,
    }
  },
})
</script>
