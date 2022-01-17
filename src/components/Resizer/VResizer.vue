<script lang="ts">
import { defineComponent, ref } from 'vue-demi'

export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-resizer',
    },
    resize: {
      type: String,
      default: 'width',
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const root = ref()
    const handle = ref()
    let startX = 0
    let startY = 0
    let startWidth = 0
    let startHeight = 0

    const drag = (e: any) => {
      if (props.resize === 'width' || props.resize === 'both')
        root.value.style.width = `${startWidth + e.clientX - startX}px`
      if (props.resize === 'height' || props.resize === 'both')
        root.value.style.height = `${startHeight + e.clientY - startY}px`
      emit('change', { width: root.value.style.width, height: root.value.style.height })
    }

    const stopDrag = (e: any) => {
      root.value.classList.remove('pointer-events-none')
      document.body.classList.remove('select-none')
      document.documentElement.removeEventListener('mousemove', drag, false)
      document.documentElement.removeEventListener('mouseup', stopDrag, false)
    }

    const startDrag = (e: MouseEvent) => {
      root.value.classList.add('pointer-events-none')
      document.body.classList.add('select-none')
      startX = e.clientX
      startY = e.clientY
      startWidth = parseInt(globalThis.getComputedStyle(root.value).width, 10)
      startHeight = parseInt(globalThis.getComputedStyle(root.value).height, 10)
      document.documentElement.addEventListener('mousemove', drag, false)
      document.documentElement.addEventListener('mouseup', stopDrag, false)
    }

    return {
      handle,
      root,
      startDrag,
    }
  },
})
</script>

<template>
  <div ref="root" :class="`${className} ${resize}`">
    <slot />
    <slot name="handle" v-bind="{ startDrag, resize }">
      <div ref="handle" class="wi-resize-handle" :class="resize" @mousedown="startDrag">
        <!-- tabler-chevron-down-right  -->
        <svg
          v-if="resize === 'both'"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M16 8v8h-8" />
        </svg>
        <!-- tabler-grip-horizontal  -->
        <svg
          v-else-if="resize === 'height'"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="5" cy="9" r="1" />
          <circle cx="5" cy="15" r="1" />
          <circle cx="12" cy="9" r="1" />
          <circle cx="12" cy="15" r="1" />
          <circle cx="19" cy="9" r="1" />
          <circle cx="19" cy="15" r="1" />
        </svg>
        <!-- tabler-grip-vertical -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
    </slot>
  </div>
</template>
