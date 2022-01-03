<script setup lang="ts">
const props = defineProps({
  rootClass: {
    type: String,
    default: 'wi-progress-bar',
  },
  percent: {
    type: Number,
    default: 0,
  },
})

const meterStyle = computed(() => {
  return {
    width: `${props.percent}%`,
  }
})
</script>

<template>
  <div :class="rootClass">
    <div class="relative" :style="meterStyle">
      <slot></slot>
    </div>
  </div>
</template>
