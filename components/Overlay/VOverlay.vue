<template>
  <div ref="root">
    <transition :name="className">
      <div v-if="blocking && modelValue" :class="className">
        <slot name="backdrop" v-bind="{ position, modal }"></slot>
      </div>
    </transition>

    <transition :name="transitionName">
      <div v-if="modelValue" ref="content" :class="positionClass">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { onClickOutside } from '@vueuse/core'
import {  computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue-demi'

export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-overlay',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: 'center',
    },
    modal: {
      type: Boolean,
      default: false,
    },
    blocking: {
      type: Boolean,
      default: true,
    },
    disableScrollTarget: {
      type: String,
      default: 'body',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const root = ref()
    const content = ref()
    const overlay = ref()
    let scrollTarget: HTMLElement | undefined
    let off: any

    const transitionName = computed(() => {
      return `${props.className}-${props.position}`
    })

    const positionClass = computed(() => {
      return `${props.className}-${props.position}`
    })

    const enableScroll = () => {
      if (scrollTarget) scrollTarget.style.overflow = 'auto'
    }

    const disableScroll = () => {
      scrollTarget = undefined
      if (props.disableScrollTarget === 'parent') scrollTarget = root.value as HTMLElement
      else if (props.disableScrollTarget) scrollTarget = document.querySelector(props.disableScrollTarget) as HTMLElement
      if (scrollTarget) scrollTarget.style.overflow = 'hidden'
    }

    watch(
      () => props.modelValue,
      (val: Boolean) => {
        if (val) {
          disableScroll()

          nextTick(() => {
            if (content.value.firstElementChild) {
              off = onClickOutside(content.value.firstElementChild, () => {
                if (!props.modal) emit('update:modelValue', false)
              })
            }
          })
        }
        else {
          if (off) off()
          enableScroll()
        }
      },
    )

    watch(() => props.disableScrollTarget, (newVal: string, oldVal: string) => {
      if (props.modelValue) {
        enableScroll()
        disableScroll()
      }
    })

    onMounted(() => {
      if (content.value) {
        onClickOutside(content.value, () => {
          if (!props.modal) emit('update:modelValue', false)
        })
      }
    })

    onBeforeUnmount(() => {
      if (off) off()
    })

    return {
      content,
      overlay,
      positionClass,
      root,
      transitionName,
    }
  },
})
</script>
