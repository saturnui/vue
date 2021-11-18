import { useEmitter } from './emitter'

const emitter = useEmitter()
const ADD_MESSAGE = 'snackbar:add_message'

type messageHandler = (data: { text: string }) => {}

const onAddMessage = (handler: messageHandler) => {
  emitter.on(ADD_MESSAGE, handler as any)
  return () => {
    emitter.off(ADD_MESSAGE, handler as any)
  }
}

const addMessage = (text: string) => {
  emitter.emit(ADD_MESSAGE, { text })
}

export const useMessenger = () => {
  return {
    onAddMessage,
    addMessage,
  }
}
