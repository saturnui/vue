<template>
  <div class="vuwi-dialog" @click.stop>
    <div class="flex items-center  p-2">
      <div class="flex-grow">
        <slot name="title" class=""></slot>
      </div>
      <button
        class="vuwi-btn vuwi-btn-icon rounded-full h-8 w-8"
        @click="close"
      >
        <tabler-x class="vuwi-dialog-close-icon h-4 w-4" />
      </button>
    </div>
    <Line />
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const close = () => {
      emit('update:modelValue', false)
    }
    return {
      close,
    }
  },
})
</script>
