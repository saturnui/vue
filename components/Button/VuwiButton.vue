<script lang="ts">
export default defineComponent({
  props: {
    rootClass: {
      type: String,
      default: 'vuwi-btn',
    },
  },
})
</script>

<template>
  <button :class="rootClass">
    <slot></slot>
  </button>
</template>
