<script lang="ts">
export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-spinner',
    },
  },
})
</script>

<template>
  <div class="animate-spin" :class="className">
    <slot></slot>
  </div>
</template>
