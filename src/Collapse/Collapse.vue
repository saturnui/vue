<template>
  <div class="vuwi-collapse">
    <div class="vuwi-collapse-header" role="button" @click="toggle">
      <div>
        <slot name="header"></slot>
      </div>
      <CollapseIcon class="transition duration-150 transform" :class="{ 'rotate-180': show }" />
    </div>
    <transition name="vuwi-collapse" @enter="start" @after-enter="end" @before-leave="start" @after-leave="end">
      <div v-show="show" class="vuwi-collapse-content">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, onUnmounted, ref } from 'vue-demi'
import { useGroup } from './group'
import CollapseIcon from './icons/CollapseIcon.vue'
import { uuid } from './uuid'

const _id = uuid()

const props = defineProps({
  group: {
    type: String,
    default: '',
  },
})
const { emit, on, off } = useGroup(props.group)

if (props.group) {
  const handler = (id: string) => {
    show.value = _id === id
  }

  on(handler)

  onUnmounted(() => {
    off(handler)
  })
}

const show = ref(false)

const toggle = () => {
  show.value = !show.value
  emit(_id)
}

const start = (element: Element) => {
  const el = element as HTMLElement
  el.style.height = el.scrollHeight + 'px'
}

const end = (element: Element) => {
  const el = element as HTMLElement
  el.style.height = ''
}
</script>
