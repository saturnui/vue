<template>
  <div v-if="modelValue" class="vuwi-dialog" @click.stop>
    <div class="vuwi-row border-b justify-between py-3 pl-4 pr-2">
      <div class="font-medium">{{ title }}</div>
      <button class="btn btn-icon btn-sm" @click="close">
        <CloseIcon />
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
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
