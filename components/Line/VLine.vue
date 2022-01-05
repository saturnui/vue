<template>
  <div :class="className">
    <div :class="`${className}-left`"></div>
    <slot></slot>
    <div :class="`${className}-right`"></div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-line',
    },
  },
})
</script>
