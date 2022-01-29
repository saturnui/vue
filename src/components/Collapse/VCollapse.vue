<template>
  <div :class="component" data-transition="wi-collapse-enter-active wi-collapse-leave-active wi-collapse-enter-from wi-collapse-leave-to">
    <div class="relative" role="button" @click="toggle">
      <slot name="header" :open="open" />
    </div>
    <transition
      :name="component"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div v-show="open" class="relative">
        <div :class="position">
          <slot :open="open" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref, watch } from 'vue-demi'
import { useGroupEmitter } from '../../composables/emitter'
import { useUuid } from '../../composables/uuid'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'wi-collapse',
    },
    group: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    slide: {
      type: String,
      default: 'down',
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
    const position = ref('')

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
      position.value = props.slide
    }

    const end = (element: Element) => {
      const el = element as HTMLElement
      el.style.height = ''
      position.value = 'up'
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
      position,
      start,
      toggle,
    }
  },
})
</script>
