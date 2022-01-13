<template>
  <transition :name="className">
    <div v-if="show" :class="className">
      <slot />
      <slot name="action" />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-toast',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
