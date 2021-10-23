<template>
  <img :src="source" />
  <hr />
  <img :src="dataUrl" />
  {{ dataUrl }}
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

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
    },
  },
  setup(props) {
    const thumbnail = ref()
    const source = ref()
    const dataUrl = ref()

    const generateThumbnail = (file, boundBox = [props.width, props.height]) => {
      // var scaleRatio = Math.min(...boundBox) / Math.max(file.width, file.height)
      var reader = new FileReader()
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')

      return new Promise(resolve => {
        reader.onload = event => {
          var image = new Image()
          image.onload = () => {
            const scaleRatio = Math.min(...boundBox) / Math.max(props.width, props.height)
            const w = props.width * scaleRatio
            const h = props.height * scaleRatio
            canvas.width = w
            canvas.height = h
            ctx.drawImage(image, 0, 0, w, h)
            dataUrl.value = canvas.toDataURL(file.type)
            resolve(canvas.toDataURL(file.type))
          }
          image.src = event.target.result
        }
        reader.readAsDataURL(file)
      })
    }

    watch(
      () => props.file,
      async file => {
        if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
          source.value = URL.createObjectURL(file)
          dataUrl.value = await generateThumbnail(file)
        }
      }
    )

    return {
      dataUrl,
      source,
      thumbnail,
    }
  },
})
</script>
