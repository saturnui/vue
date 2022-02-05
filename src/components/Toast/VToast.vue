<template>
  <transition :name="component">
    <div v-if="show" :class="component">
      <slot />
      <slot name="action" />
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi';

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'sa-toast',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
