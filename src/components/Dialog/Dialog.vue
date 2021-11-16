<template>
  <div ref="dialog" class="vuwi-dialog" @click.stop>
    <div class="vuwi-dialog-title">
      <div>{{ title }}</div>
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
import { onClickOutside } from '@vueuse/core'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
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
    const dialog = ref()
    onMounted(() => {
      onClickOutside(dialog.value, () => {
        if (!props.modal)
          close()
      })
    })
    return {
      close,
      dialog,
    }
  },
})
</script>
