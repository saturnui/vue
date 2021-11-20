import { useEmitter } from './emitter'

export type Message = { text: string }

const emitter = useEmitter()
const ADD_MESSAGE = 'snackbar:add_message'

type MessageHandler = (data: Message) => void

const onAddMessage = (handler: MessageHandler) => {
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
