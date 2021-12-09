<template>
  <div :class="computedClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    vuwiClass: {
      type: String,
      default: 'vuwi-drawer',
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
      let c = props.vuwiClass
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
