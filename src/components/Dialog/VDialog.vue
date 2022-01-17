<template>
  <div :class="className">
    <div :class="`${className}-titlebar`">
      <slot name="title" />
      <div class="flex-grow" />
      <VButton class="wi-btn-icon" @click="$emit('close')">
        <!-- tabler-x -->
        <svg
          :class="`${className}-close-icon`"
          width="1.2em"
          height="1.2em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 24 24"
          class="wi-dialog-close-icon"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </g>
        </svg>
      </VButton>
    </div>
    <slot />
    <div :class="`${className}-actions`">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import VButton from '../Button/VButton.vue'

export default defineComponent({
  components: { VButton },
  props: {
    className: {
      type: String,
      default: 'wi-dialog',
    },
  },
  emits: ['close'],
})
</script>
