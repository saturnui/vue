export const convertToDataUrl = (file, width = 48, height = 48) => {
  const boundBox = [width, height]
  const reader = new FileReader()
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  return new Promise(resolve => {
    reader.onload = event => {
      const image = new Image()
      image.onload = () => {
        const scaleRatio = Math.min(...boundBox) / Math.max(width, height)
        const w = width * scaleRatio
        const h = height * scaleRatio
        canvas.width = w
        canvas.height = h
        ctx.drawImage(image, 0, 0, w, h)
        // dataUrl.value = canvas.toDataURL(file.type)
        resolve(canvas.toDataURL(file.type))
      }
      image.src = event.target.result
    }
    reader.readAsDataURL(file)
  })
}
