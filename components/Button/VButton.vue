<script lang="ts">
export default defineComponent({
  props: {
    wi: {
      type: String,
      default: 'wi-btn',
    },
  },
})
</script>

<template>
  <button :class="wi">
    <slot></slot>
  </button>
</template>
