<script lang="ts">
import { computed, defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'sa-progress-bar',
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
  <div :class="component">
    <div class="relative" :style="meterStyle">
      <slot></slot>
    </div>
  </div>
</template>
