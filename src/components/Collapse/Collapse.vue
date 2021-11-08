<template>
  <div :class="theme">
    <div class="collapse-header" role="button" @click="toggle">
      <div>
        <slot name="header"></slot>
      </div>
      <tabler-chevron-up
        class="transition duration-150 transform"
        :class="{ 'rotate-180': show }"
      />
    </div>
    <transition
      name="vuwi-collapse"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div v-show="show">
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
    const show = ref(false)

    if (props.group) {
      const handler = (data: { id: string; show: boolean }) => {
        if (data.show) {
          show.value = id === data.id
          emit('update:modelValue', show.value)
        }
      }

      onGroup(handler)

      onUnmounted(() => {
        offGroup(handler)
      })
    }

    const invalidate = (val: boolean) => {
      if (show.value !== val) {
        show.value = val
        emit('update:modelValue', val)
        emitGroup(id, val)
      }
    }

    const toggle = () => {
      invalidate(!show.value)
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
      show,
      start,
      toggle,
    }
  },
})
</script>
