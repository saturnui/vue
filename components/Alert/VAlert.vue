<script lang="ts">
export default defineComponent({
  props: {
    wi: {
      type: String,
      default: 'wi-alert',
    },
  },
})
</script>

<template>
  <div :class="wi">
    <slot></slot>
  </div>
</template>
