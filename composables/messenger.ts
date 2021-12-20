import { useEmitter } from './emitter'

export type Message = { type?: string; text: string; icon?: string }

const emitter = useEmitter()
const ADD_MESSAGE = 'snackbar:add_message'

type MessageHandler = (data: Message) => void

const onAddMessage = (handler: MessageHandler) => {
  emitter.on(ADD_MESSAGE, handler as any)
  return () => {
    emitter.off(ADD_MESSAGE, handler as any)
  }
}

const addMessage = (message: Message) => {
  emitter.emit(ADD_MESSAGE, message)
}

export const useMessenger = () => {
  return {
    onAddMessage,
    addMessage,
  }
}
