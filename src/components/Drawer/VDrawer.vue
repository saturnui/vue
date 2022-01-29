<template>
  <div :class="component">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'wi-drawer',
    },
  },
})
</script>
