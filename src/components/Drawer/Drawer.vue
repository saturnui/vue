<template>
  <div
    ref="drawer"
    class="vuwi-drawer -translate-x-full md:translate-x-0"
    :class="{ '!translate-x-0 show': modelValue }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue-demi'
import { debounce } from '../../helpers/debounce'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const drawer = ref()

    const resizeHandler = debounce(() => {
      emit('update:modelValue', false)
    }, 200)

    onMounted(() => {
      globalThis.addEventListener('resize', resizeHandler, false)
    })

    onBeforeUnmount(() => {
      globalThis.removeEventListener('resize', resizeHandler)
    })

    return {
      drawer,
    }
  },
})
</script>
