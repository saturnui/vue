<template>
  <div class="vuwi-collapse">
    <div class="vuwi-collapse-header" role="button" @click="toggle">
      <div>
        <slot name="header"></slot>
      </div>
      <CollapseIcon class="transition duration-150 transform" :class="{ 'rotate-180': show }" />
    </div>
    <transition
      name="vuwi-collapse"
      @enter="start"
      @after-enter="end"
      @before-leave="start"
      @after-leave="end"
    >
      <div v-show="show" class="vuwi-collapse-content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "@vue/runtime-core"
import { onUnmounted, ref } from 'vue-demi'
import { useGroup } from './group'
import CollapseIcon from './icons/CollapseIcon.vue'

export default defineComponent({
  components: { CollapseIcon },
  props: {
    group: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const uuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }

    const { emit: emitGroup, on: onGroup, off: offGroup } = useGroup(props.group)


    const id = uuid()

    if (props.group) {
      const handler = (data: { id: string, show: boolean }) => {
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

    const show = ref(false)

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
      el.style.height = el.scrollHeight + 'px'
    }

    const end = (element: Element) => {
      const el = element as HTMLElement
      el.style.height = ''
    }

    watch(() => props.modelValue, (val) => {
      invalidate(val)
    }, { immediate: true })

    return {
      end,
      show,
      start,
      toggle,
    }
  }
})
</script>
