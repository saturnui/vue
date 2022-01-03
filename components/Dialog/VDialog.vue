<template>
  <div class="wi-dialog">
    <div class="wi-dialog-titlebar">
      <slot name="title" />
      <div class="flex-grow"></div>
      <VButton class="wi-btn wi-btn-icon" @click="$emit('close')">
        <tabler-x class="wi-dialog-close-icon" />
      </VButton>
    </div>
    <slot />
    <div class="wi-dialog-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    wi: {
      type: String,
      default: 'wi-dialog',
    },
  },
  emits: ['close'],
})
</script>
