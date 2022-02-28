<template>
  <div
    ref="root"
    data-css="overlay-shade"
    data-transitions="overlay-enter-active overlay-leave-active overlay-enter-from overlay-leave-to"
    data-transitions-center="overlay-center overlay-center-enter-active overlay-center-leave-active overlay-center-enter-from overlay-center-leave-to"
    data-transitions-top="overlay-top overlay-top-enter-active overlay-top-leave-active overlay-top-enter-from overlay-top-leave-to"
    data-transitions-bottom="overlay-bottom overlay-bottom-enter-active overlay-bottom-leave-active overlay-bottom-enter-from overlay-bottom-leave-to"
    data-transitions-left="overlay-left overlay-left-enter-active overlay-left-leave-active overlay-left-enter-from overlay-left-leave-to"
    data-transitions-right="overlay-right overlay-right-enter-active overlay-right-leave-active overlay-right-enter-from overlay-right-leave-to"
  >
    <transition :name="component">
      <div v-if="blocking && modelValue" :class="component">
        <slot name="backdrop" v-bind="{ position, modal }" />
      </div>
    </transition>

    <transition :name="transitionName">
      <div v-if="modelValue" ref="content" :class="positionClass">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'overlay',
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
      return `${props.component}-${props.position}`
    })

    const positionClass = computed(() => {
      return `${props.component}-${props.position}`
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
