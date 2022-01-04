<template>
  <img :src="dataUrl" class="bg-cover" />
</template>

<script lang="ts">
import { useImageToDataUrl } from '../../composables/image'

export default defineComponent({
  props: {
    width: {
      type: [String, Number],
      default: 48,
    },
    height: {
      type: [String, Number],
      default: 48,
    },
    src: {
      type: File,
      default: null,
    },
  },
  setup(props) {
    const thumbnail = ref()
    const source = ref()
    const dataUrl = ref()

    watch(
      () => props.src,
      async (file) => {
        if (file) {
          if (
            file.type === 'image/jpeg'
            || file.type === 'image/png'
            || file.type === 'image/gif'
          ) {
            source.value = URL.createObjectURL(file)
            dataUrl.value = await useImageToDataUrl(file, Number(props.width), Number(props.height))
          }
        }
      },
      { immediate: true },
    )

    return {
      dataUrl,
      source,
      thumbnail,
    }
  },
})
</script>
