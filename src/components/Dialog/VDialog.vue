<template>
  <div :class="component">
    <div name="titlebar">
      <slot name="title" />
      <div class="flex-grow" />
      <VButton icon @click="$emit('close')">
        <VCloseIcon name="close-icon" />
      </VButton>
    </div>
    <slot />
    <div name="actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import VButton from '../Button/VButton.vue'
import VCloseIcon from '../Icon/VCloseIcon.vue'

export default defineComponent({
  components: { VButton, VCloseIcon },
  props: {
    component: {
      type: String,
      default: 'sa-dialog',
    },
  },
  emits: ['close'],
})
</script>
