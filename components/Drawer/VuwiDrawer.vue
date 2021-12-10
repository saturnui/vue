<template>
  <div :class="computedClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const resizeHandler = useDebounceFn(() => {
      emit('update:modelValue', false)
    }, 200)

    const computedClass = computed(() => {
      let c = `${props.theme}-drawer`
      if (props.modelValue) c += ' !translate-x-0 show'
      return c
    })

    onMounted(() => {
      globalThis.addEventListener('resize', resizeHandler, false)
    })

    onBeforeUnmount(() => {
      globalThis.removeEventListener('resize', resizeHandler)
    })

    return {
      computedClass,
    }
  },
})
</script>
