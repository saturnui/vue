<script lang="ts">
import { computed, defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-progress-bar',
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const meterStyle = computed(() => {
      return {
        width: `${props.percent}%`,
      }
    })
    return {
      meterStyle
    }
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
