<script lang="ts">
export default defineComponent({
  props: {
    rootClass: {
      type: String,
      default: 'wi-spinner',
    },
  },
})
</script>

<template>
  <div :class="rootClass">
    <slot></slot>
  </div>
</template>
