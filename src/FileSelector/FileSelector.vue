<template>
  <div @click="selectFiles">
    <slot></slot>
    <input type="file" ref="input" :multiple="multiple" @change="fileSelected" class="hidden" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-core'

export default defineComponent({
  props: ['multiple'],
  emits: ['change'],
  setup(props, { emit }) {
    const input = ref()

    const selectFiles = () => {
      input.value.click()
    }

    const fileSelected = (e: any) => {
      const files = e.target.files || e.dataTransfer.files
      emit('change', files)
    }

    return {
      fileSelected,
      input,
      selectFiles,
    }
  },
})
</script>

