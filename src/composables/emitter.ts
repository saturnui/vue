import mitt from 'mitt'
const emitter = mitt()

export const useEmitter = () => {
  return emitter
}

export const useGroupEmitter = (name: string) => {
  const emit = (id: string, active = false) => {
    emitter.emit(name, { id, active })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const on = (handler: any) => {
    emitter.on(name, handler)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const off = (handler: any) => {
    emitter.off(name, handler)
  }

  return { emit, on, off }
}
