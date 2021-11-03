import mitt from '../directives/mitt'

const bus = mitt()

export const useGroup = (name: string) => {
  const emit = (id: string, show = false) => {
    bus.emit(name, {id, show})
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const on = (handler: any) => {
    bus.on(name, handler)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const off = (handler: any) => {
    bus.off(name, handler)
  }

  return { emit, on, off }
}
