<template>
  <div :class="className">
    <div :class="`${className}-titlebar`">
      <slot name="title" />
      <div class="flex-grow" />
      <VButton class="wi-btn-icon" @click="$emit('close')">
        <!-- tabler-x -->
        <CloseIcon name="close-icon" />
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
import CloseIcon from '../Icon/CloseIcon.vue'

export default defineComponent({
  components: { VButton, CloseIcon },
  props: {
    className: {
      type: String,
      default: 'wi-dialog',
    },
  },
  emits: ['close'],
})
</script>
