<template>
  <div>
    <transition :name="`${theme}-overlay`">
      <div v-if="modelValue" :class="`${theme}-overlay`"></div>
    </transition>

    <transition :name="transitionName">
      <div v-if="modelValue" ref="content" :class="positionClass">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { SwipeDirection } from '@vueuse/core'
import { ref, nextTick } from 'vue-demi'

export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi',
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
  },
  emits: ['update:modelValue', 'swipe:start', 'swipe', 'swipe:end'],
  setup(props, { emit }) {
    const content = ref()
    const overlay = ref()
    let off: any

    const transitionName = computed(() => {
      return `${props.theme}-overlay-${props.position}`
    })

    const positionClass = computed(() => {
      return `${props.theme}-overlay-${props.position}`
    })

    watch(
      () => props.modelValue,
      (val: Boolean) => {
        if (val) {
          document.body.style.overflow = 'hidden'
          nextTick(() => {
            if (content.value.firstElementChild) {
              off = onClickOutside(content.value.firstElementChild, () => {
                if (!props.modal) emit('update:modelValue', false)
              })
            }

            useSwipe(content.value, {
              passive: true,
              onSwipeStart(e: TouchEvent) {
                emit('swipe:start', { event: e })
              },
              onSwipe(e: TouchEvent) {
                emit('swipe', { event: e })
              },
              onSwipeEnd(e: TouchEvent, direction: SwipeDirection) {
                emit('swipe:end', { event: e, direction })
              },
            })
          })
        }
        else {
          if (off) off()
          document.body.style.overflow = 'auto'
        }
      },
    )

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
      transitionName,
    }
  },
})
</script>
