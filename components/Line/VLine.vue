<template>
  <div :class="`${theme}-line`">
    <div :class="`${theme}-line-left`"></div>
    <slot></slot>
    <div :class="`${theme}-line-right`"></div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'wi',
    },
  },
  setup(props, { slots }) {
    const hasSlot = computed(() => {
      return !!slots.default?.length
    })
    return {
      hasSlot,
    }
  },
})
</script>
