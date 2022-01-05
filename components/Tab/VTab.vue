<script lang="ts">
export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-tab-container',
    },
  },
})
</script>

<template>
  <button :class="className">
    <slot></slot>
  </button>
</template>
