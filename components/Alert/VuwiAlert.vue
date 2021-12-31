<script lang="ts">
export default defineComponent({
  props: {
    rootClass: {
      type: String,
      default: 'vuwi-alert',
    },
  },
})
</script>

<template>
  <div :class="rootClass">
    <slot></slot>
  </div>
</template>
