<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'sa-btn',
    },
  },
})
</script>

<template>
  <button :class="component">
    <slot />
  </button>
</template>
