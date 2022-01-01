<script lang="ts">
export default defineComponent({
  props: {
    rootClass: {
      type: String,
      default: 'vuwi-window',
    },
  },
})
</script>

<template>
  <div :class="rootClass">
    <div :class="`${rootClass}-content`">
      <slot></slot>
    </div>
  </div>
</template>
