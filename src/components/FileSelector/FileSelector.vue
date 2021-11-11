<template>
  <div @click="selectFiles">
    <slot></slot>
    <input
      ref="input"
      type="file"
      :multiple="multiple"
      class="hidden"
      @change="fileSelected"
    />
  </div>
</template>

<script lang="ts">
export type FileEventTarget = EventTarget & { files: FileList }

export default defineComponent({
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  setup(_, { emit }) {
    const input = ref()

    const selectFiles = () => {
      input.value.click()
    }

    // https://github.com/microsoft/TypeScript/issues/31816
    const fileSelected = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
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
