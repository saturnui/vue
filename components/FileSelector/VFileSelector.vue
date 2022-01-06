<template>
  <div @click="selectFiles">
    <slot></slot>
    <input
      ref="input"
      type="file"
      :multiple="multiple"
      class="hidden"
      :accept="accept"
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
    accepts: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
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

    const accept = computed(() => {
      const val = props.accepts as string[]
      if (val instanceof Array)
        return val.map(v => `.${v}`).join(',')
      return ''
    })

    return {
      accept,
      fileSelected,
      input,
      selectFiles,
    }
  },
})
</script>
