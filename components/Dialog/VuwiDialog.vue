<template>
  <div :class="`${theme}-dialog ${theme}-card`">
    <div class="p-2 flex items-center ">
      <div class="flex-grow">
        <slot name="title"></slot>
      </div>
      <button
        class="wi-btn wi-btn-icon"
        @click="$emit('close')"
      >
        <tabler-x class="h-6 w-6" />
      </button>
    </div>
    <VLine />
    <slot></slot>
    <slot name="actions"></slot>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'wi',
    },
  },
  emits: ['close'],
})
</script>
