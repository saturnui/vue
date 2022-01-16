<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-alert',
    },
  },
})
</script>

<template>
  <div :class="className">
    <slot></slot>
  </div>
</template>
