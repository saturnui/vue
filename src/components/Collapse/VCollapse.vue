<template>
  <div :class="className">
    <div class="relative" role="button" @click="toggle">
      <slot name="header" :open="open"></slot>
    </div>
    <transition
      :name="className"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div v-show="open" class="relative">
        <div :class="position">
          <slot :open="open"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {  defineComponent, onUnmounted, ref, watch } from 'vue-demi'
import { useGroupEmitter } from '../../composables/emitter'
import { useUuid } from '../../composables/uuid'

export default defineComponent({
  props: {
    className: {
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
      if (props.slide === 'down') 
        position.value = 'absolute bottom-0 w-full'
    }

    const end = (element: Element) => {
      const el = element as HTMLElement
      el.style.height = ''
      position.value = ''
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
