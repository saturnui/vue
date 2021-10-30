<template>
  <vuwi-file-drop ref="dropzone" class="block">
    <slot></slot>
  </vuwi-file-drop>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue-demi'
import { FileDropEvent } from './FileDropElement'

export default defineComponent({
  emits: ['change'],
  setup(_, { emit }) {
    const dropzone = ref()
    const files = ref<File[]>([])
    const _selectedFiles: string[] = []

    onMounted(() => {
      dropzone.value.addEventListener('filedrop', (event: FileDropEvent) => {
        files.value = []
        _selectedFiles.length = 0
        event.files.forEach(async item => {
          if (!_selectedFiles.includes(item.name)) {
            _selectedFiles.push(item.name)
            files.value.push(item) // TODO: should not be never
          }
          emit('change', files.value)
        })
      })
    })

    return {
      dropzone,
      files,
    }
  },
})
</script>
