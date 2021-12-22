<script setup lang="ts">
const props = defineProps({
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
  <div>
    <div class="relative" :style="meterStyle">
      <slot></slot>
    </div>
  </div>
</template>
