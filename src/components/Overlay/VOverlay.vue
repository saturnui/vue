<template>
  <div
    ref="root"
    data-css="wi-overlay-shade"
    data-transitions="wi-overlay-enter-active wi-overlay-leave-active wi-overlay-enter-from wi-overlay-leave-to"
    data-transitions-center="wi-overlay-center wi-overlay-center-enter-active wi-overlay-center-leave-active wi-overlay-center-enter-from wi-overlay-center-leave-to"
    data-transitions-top="wi-overlay-top wi-overlay-top-enter-active wi-overlay-top-leave-active wi-overlay-top-enter-from wi-overlay-top-leave-to"
    data-transitions-bottom="wi-overlay-bottom wi-overlay-bottom-enter-active wi-overlay-bottom-leave-active wi-overlay-bottom-enter-from wi-overlay-bottom-leave-to"
    data-transitions-left="wi-overlay-left wi-overlay-left-enter-active wi-overlay-left-leave-active wi-overlay-left-enter-from wi-overlay-left-leave-to"
    data-transitions-right="wi-overlay-right wi-overlay-right-enter-active wi-overlay-right-leave-active wi-overlay-right-enter-from wi-overlay-right-leave-to"
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
