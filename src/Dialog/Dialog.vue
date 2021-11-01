<template>
  <div v-if="modelValue" ref="dialog" class="vuwi-dialog" @click.stop>
    <div class="dialog-title">
      <div>{{ title }}</div>
      <button class="btn btn-icon btn-sm" @click="close">
        <CloseIcon />
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { onClickOutside } from '@vueuse/core'
import { defineComponent, onMounted, ref } from 'vue-demi'
import CloseIcon from './icons/CloseIcon.vue'

export default defineComponent({
  components: { CloseIcon },
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
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const close = () => {
      emit('update:modelValue', false)
    }
    const dialog = ref()
    onMounted(() => {
      onClickOutside(dialog.value, () => {
        if (!props.modal) {
          close()
        }
      })
    })
    return {
      close,
      dialog,
    }
  },
})
</script>
