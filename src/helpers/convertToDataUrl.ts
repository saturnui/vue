export const convertToDataUrl = (file: File, width = 48, height = 48) => {
  const boundBox = [width, height]
  const fileReader = new FileReader()
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  return new Promise(resolve => {
    fileReader.onload = () => {
      const image = new Image()
      image.onload = () => {
        const scaleRatio = Math.min(...boundBox) / Math.max(width, height)
        const w = width * scaleRatio
        const h = height * scaleRatio
        canvas.width = w
        canvas.height = h
        if (ctx) {
          ctx.drawImage(image, 0, 0, w, h)
        }
        resolve(canvas.toDataURL(file.type))
      }
      image.src = fileReader.result as string
    }
    fileReader.readAsDataURL(file)
  })
}
