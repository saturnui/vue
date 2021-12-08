<template>
  <div :class="theme">
    <div role="button" @click="toggle">
      <slot name="header" :open="open"></slot>
    </div>
    <transition
      :name="theme"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div v-show="open">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { useGroupEmitter, useUuid } from '~/composables'

export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi-collapse',
    },
    group: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const {
      emit: emitGroup,
      on: onGroup,
      off: offGroup,
    } = useGroupEmitter(props.group)

    const id = useUuid()
    const open = ref(false)

    if (props.group) {
      const handler = (data: { id: string; active: boolean }) => {
        if (data.active) {
          open.value = id === data.id
          emit('update:modelValue', open.value)
        }
      }

      onGroup(handler)

      onUnmounted(() => {
        offGroup(handler)
      })
    }

    const invalidate = (val: boolean) => {
      if (open.value !== val) {
        open.value = val
        emit('update:modelValue', val)
        emitGroup(id, val)
      }
    }

    const toggle = () => {
      invalidate(!open.value)
    }

    const start = (element: Element) => {
      const el = element as HTMLElement
      el.style.height = `${el.scrollHeight}px`
    }

    const end = (element: Element) => {
      const el = element as HTMLElement
      el.style.height = ''
    }

    watch(
      () => props.modelValue,
      (val) => {
        invalidate(val)
      },
      { immediate: true },
    )

    return {
      end,
      open,
      start,
      toggle,
    }
  },
})
</script>
