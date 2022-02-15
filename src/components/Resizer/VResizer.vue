<script lang="ts">
import { defineComponent, ref } from 'vue-demi'
import VResizeIcon from '../Icon/VResizeIcon.vue'
import VResizeHorizontalIcon from '../Icon/VResizeHorizontalIcon.vue'
import VResizeVerticalIcon from '../Icon/VResizeVerticalIcon.vue'

export default defineComponent({
  components: { VResizeIcon, VResizeHorizontalIcon, VResizeVerticalIcon },
  props: {
    component: {
      type: String,
      default: 'sa-resizer',
    },
    resize: {
      type: String,
      default: 'width',
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const root = ref()
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
      root,
      startDrag,
    }
  },
})
</script>

<template>
  <div ref="root" :class="`${component} ${resize}`">
    <slot />
    <slot name="handle" v-bind="{ startDrag, resize }">
      <div class="resizer-handle" @mousedown="startDrag">
        <VResizeIcon v-if="resize === 'both'" />
        <VResizeHorizontalIcon v-else-if="resize === 'height'" />
        <VResizeVerticalIcon v-else-if="resize === 'width'" />
      </div>
    </slot>
  </div>
</template>
