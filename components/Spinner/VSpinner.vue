<script lang="ts">
export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-spinner animate-spin',
    },
  },
})
</script>

<template>
  <div :class="className">
    <slot></slot>
  </div>
</template>
