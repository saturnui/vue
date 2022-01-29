<script lang="ts">
import { defineComponent } from 'vue-demi';

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'wi-spinner',
    },
  },
})
</script>

<template>
  <div class="animate-spin" :class="component">
    <slot></slot>
  </div>
</template>
