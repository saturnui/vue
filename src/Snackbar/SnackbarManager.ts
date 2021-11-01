let snackbars: Snackbar[] = []
let counter = 1
let pauseTimer: number
export let currentSnackbar: Snackbar | null = null

class Snackbar {
  id: number

  constructor(private text: string, private icon?: string) {
    this.id = counter++
  }
}

export const addSnackbar = (text: string, icon?: string) => {
  snackbars.push(new Snackbar(text, icon))
  if (snackbars.length === 0) {
    currentSnackbar = snackbars[0]
  }
}

export const dismissAllSnackbars = () => {
  snackbars.length = 0
  counter = 0
  return
}

export const dismissSnackbar = (id: number) => {
  snackbars = snackbars.filter(snackbar => snackbar.id !== id)
  return
}

export const pauseSnackbar = (duration = 0) => {
  console.log(duration)
  // pauseTimer = setTimeout(() => {

  // }, duration)
  return
}

export const resumeSnackbar = () => {
  clearTimeout(pauseTimer)
  return
}
