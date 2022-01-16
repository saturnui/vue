export const useImageToDataUrl = (file: File, width = 0, height = 0): Promise<string> => {
  const boundBox = [width, height]
  const reader = new FileReader()
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  return new Promise((resolve) => {
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const image = new Image()
      image.onload = () => {
        const scaleRatio = Math.min(...boundBox) / Math.max(image.width, image.height)
        const w = (image.width * scaleRatio)
        const h = (image.height * scaleRatio)
        canvas.width = w
        canvas.height = h
        ctx.drawImage(image, 0, 0, w, h)
        resolve(canvas.toDataURL(file.type))
      }
      if (event.target) image.src = event.target.result as string
    }
    reader.readAsDataURL(file)
  })
}
