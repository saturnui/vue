<template>
  <img :src="dataUrl" class="bg-contain">
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue-demi'
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
      type: [File, String],
      default: '',
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const thumbnail = ref()
    const source = ref()
    const dataUrl = ref()

    watch(
      () => props.src,
      async (val) => {
        if (val instanceof File) {
          if (
            val.type === 'image/jpeg'
            || val.type === 'image/png'
            || val.type === 'image/gif'
            || val.type === 'image/svg+xml'
            || val.type === 'image/webp'
          ) {
            source.value = URL.createObjectURL(val)
            dataUrl.value = await useImageToDataUrl(val, Number(props.width), Number(props.height))
            emit('change', dataUrl.value)
          }
        } else {
          emit('change', val)
          return val
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
