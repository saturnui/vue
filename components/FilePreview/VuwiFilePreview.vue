<template>
  <img :src="source" />
  <hr />
  <img :src="dataUrl" />
  {{ dataUrl }}
</template>

<script lang="ts">
export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 48,
    },
    height: {
      type: Number,
      default: 48,
    },
    file: {
      type: File,
      default: null,
    },
  },
  setup(props) {
    const thumbnail = ref()
    const source = ref()
    const dataUrl = ref()

    const generateThumbnail = (
      file: File,
      boundBox = [props.width, props.height],
    ) => {
      // var scaleRatio = Math.min(...boundBox) / Math.max(file.width, file.height)
      const fileReader = new FileReader()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      return new Promise((resolve) => {
        fileReader.onload = () => {
          const image = new Image()
          image.onload = () => {
            const scaleRatio
              = Math.min(...boundBox) / Math.max(props.width, props.height)
            const w = props.width * scaleRatio
            const h = props.height * scaleRatio
            canvas.width = w
            canvas.height = h
            if (ctx)
              ctx.drawImage(image, 0, 0, w, h)

            dataUrl.value = canvas.toDataURL(file.type)
            resolve(canvas.toDataURL(file.type))
          }
          image.src = fileReader.result as string
        }
        fileReader.readAsDataURL(file)
      })
    }

    watch(
      () => props.file,
      async(file) => {
        if (file) {
          if (
            file.type === 'image/jpeg'
            || file.type === 'image/png'
            || file.type === 'image/gif'
          ) {
            source.value = URL.createObjectURL(file)
            dataUrl.value = await generateThumbnail(file)
          }
        }
      },
    )

    return {
      dataUrl,
      source,
      thumbnail,
    }
  },
})
</script>
