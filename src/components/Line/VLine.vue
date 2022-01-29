<template>
  <div :class="component">
    <div name="line" />
    <slot />
    <div name="line" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'wi-line',
    },
  },
})
</script>
