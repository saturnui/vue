<script setup lang="ts">
const props = defineProps({
  theme: {
    type: String,
    default: 'vuwi',
  },
  size: {
    type: Number,
    default: 5,
  },
  color: {
    type: String,
    default: 'border-primary',
  },
  width: {
    type: Number,
    default: 0.5,
  },
  percent: {
    type: Number,
    default: 0,
  },
})

const degreeUnit = 3.6

const pieContainerStyle = computed(() => {
  return {
    width: `${props.size}em`,
    height: `${props.size}em`,
  }
})

const pieStyle = computed(() => {
  const full = props.size
  const half = full * 0.5
  return {
    clip: props.percent < 50 ? `rect(0, ${full}em, ${full}em, ${half}em)` : '',
  }
})

const ringStyle = computed(() => {
  const full = props.size
  const half = full * 0.5
  const color = props.color
  if (props.percent < 50) {
    return {
      borderWidth: `${props.width}px`,
      background: `linear-gradient(to right, ${color} 50%, transparent 50%)`,
      clip: `rect(0, ${half}em, ${full}em, 0)`,
    }
  }

  return {
    borderWidth: `${props.width}px`,
    background: `linear-gradient(to right, ${color} 50%, transparent 50%)`,
    clip: `rect(0, ${half}em, ${full}em, 0)`,
  }
})

const ringClass = computed(() => {
  return `${props.theme}-progress-circle border ${props.color}`
})

const leftStyle = computed(() => {
  const val = props.percent * degreeUnit
  return {
    ...ringStyle.value,
    borderColor: props.color,
    transform: `rotate(${val}deg)`,
  }
})

const rightStyle = computed(() => {
  const val = Math.min(props.percent * degreeUnit, 180)
  return {
    ...ringStyle.value,
    borderColor: props.color,
    transform: `rotate(${val}deg)`,
  }
})
</script>

<template>
  <div
    class="relative rounded-full overflow-hidden"
    :style="pieContainerStyle"
  >
    <div :class="`${theme}-progress-circle`" :style="pieStyle">
      <div :class="ringClass" :style="leftStyle"></div>
      <div :class="ringClass" :style="rightStyle"></div>
    </div>
    <div :class="`${theme}-progress-circle-label`">
      <slot></slot>
    </div>
  </div>
</template>
