<template>
  <div :class="className">
    <div name="line"></div>
    <slot></slot>
    <div name="line"></div>
  </div>
</template>

<script lang="ts">
import {  defineComponent, ref } from 'vue-demi'

export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-line',
    },
  },
})
</script>
