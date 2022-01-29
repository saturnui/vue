<script lang="ts">
import { defineComponent, ref } from 'vue-demi'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    const active = ref(false)
    const files = ref<File[]>()

    const drop = (event: any) => {
      files.value = [...event.dataTransfer.files]
      active.value = false
      emit('change', files.value)
    }
    return {
      active,
      files,
      drop,
    }
  },
})
</script>

<template>
  <div
    class="inline-block"
    @dragenter.prevent="active = true"
    @dragleave.prevent="active = false"
    @dragover.prevent="active = true"
    @drop.prevent="drop"
  >
    <slot v-bind="{ active, files }" />
  </div>
</template>
