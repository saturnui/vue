<template>
  <file-drop ref="dropzone" class="block">
    <slot></slot>
  </file-drop>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import './FileDropElement.js'

export default defineComponent({
  emit: ['change'],
  setup(_, { emit }) {
    const dropzone = ref()
    const files = ref([])
    let _selectedFiles: File[] = []

    onMounted(() => {
      dropzone.value.addEventListener('filedrop', (event: any) => {
        files.value = []
        _selectedFiles.length = 0
        event.files.forEach(async (item: any) => {
          if (!_selectedFiles.includes(item.name)) {
            _selectedFiles.push(item.name)
            files.value.push(item as never) // TODO: should not be never
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
