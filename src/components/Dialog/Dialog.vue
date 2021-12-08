<template>
  <div class="vuwi-dialog vuwi-light-dark">
    <div class="p-2 flex items-center ">
      <div class="flex-grow">
        <slot name="title"></slot>
      </div>
      <button
        class="vuwi-btn vuwi-btn-icon"
        @click="$emit('close')"
      >
        <tabler-x class="h-6 w-6" />
      </button>
    </div>
    <Line />
    <slot></slot>
    <slot name="actions"></slot>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  emits: ['close'],
})
</script>
