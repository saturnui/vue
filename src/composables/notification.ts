import { useEmitter } from './emitter'
import { useUuid } from './uuid'

const emitter = useEmitter()
const NOTIFICATION_CHANGED = 'notification:changed'

type Message = { id: string; type: string; data: any; created: number; isNew: boolean }
type MessageHandler = (message: Message) => void

export const useNotify = (options = { name: '' }) => {
  const messages: Message[] = []
  let cursor = -1

  const len = (): number => {
    return messages.length
  }

  const push = (data: any) => {
    let msg = { id: useUuid(), type: 'message', data, created: Date.now(), isNew: true }
    if (typeof data === 'object' && data.type === 'message') msg = data
    messages.push(msg)
    emitter.emit(`${NOTIFICATION_CHANGED}:${options.name}`, msg)
  }

  const remove = (message: Message): boolean => {
    const id = message.id
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]
      if (msg.id === id) {
        messages.splice(i, 1)
        if (cursor >= len()) cursor--
        return true
      }
    }
    return false
  }

  const snooze = (message: Message, options = { delay: 0 }) => {
    remove(message)
    message.isNew = false
    if (options.delay) {
      setTimeout(() => {
        push(message)
      }, options.delay)
    } else {
      push(message)
    }
  }

  const get = (index = -1) => {
    if (index < 0) index = cursor
    return messages[index]
  }

  const prev = (): any => {
    const item = get(cursor - 1)
    if (item) cursor--
    return item
  }

  const hasPrev = (): boolean => {
    return !!get(cursor - 1)
  }

  const hasNext = (): boolean => {
    return !!get(cursor + 1)
  }

  const peek = () => {
    return get(cursor + 1)
  }

  const next = (): any => {
    const item = get(cursor + 1)
    if (item) cursor++
    return item
  }

  const list = (): any[] => {
    return JSON.parse(JSON.stringify(messages))
  }

  const clear = () => {
    cursor = -1
    messages.length = 0
  }

  const watch = (handler: MessageHandler) => {
    emitter.on(`${NOTIFICATION_CHANGED}:${options.name}`, handler as any)
    return () => {
      emitter.off(`${NOTIFICATION_CHANGED}:${options.name}`, handler as any)
    }
  }

  return {
    clear,
    delete: remove,
    get,
    hasNext,
    hasPrev,
    push,
    prev,
    peek,
    next,
    len,
    list,
    snooze,
    watch,
  }
}
