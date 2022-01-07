<script setup lang="ts">
const props = defineProps({
  className: {
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
  <div :class="className">
    <div class="relative" :style="meterStyle">
      <slot></slot>
    </div>
  </div>
</template>
