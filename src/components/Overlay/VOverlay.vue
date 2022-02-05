<template>
  <div
    ref="root"
    data-css="sa-overlay-shade"
    data-transitions="sa-overlay-enter-active sa-overlay-leave-active sa-overlay-enter-from sa-overlay-leave-to"
    data-transitions-center="sa-overlay-center sa-overlay-center-enter-active sa-overlay-center-leave-active sa-overlay-center-enter-from sa-overlay-center-leave-to"
    data-transitions-top="sa-overlay-top sa-overlay-top-enter-active sa-overlay-top-leave-active sa-overlay-top-enter-from sa-overlay-top-leave-to"
    data-transitions-bottom="sa-overlay-bottom sa-overlay-bottom-enter-active sa-overlay-bottom-leave-active sa-overlay-bottom-enter-from sa-overlay-bottom-leave-to"
    data-transitions-left="sa-overlay-left sa-overlay-left-enter-active sa-overlay-left-leave-active sa-overlay-left-enter-from sa-overlay-left-leave-to"
    data-transitions-right="sa-overlay-right sa-overlay-right-enter-active sa-overlay-right-leave-active sa-overlay-right-enter-from sa-overlay-right-leave-to"
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
      default: 'sa-overlay',
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
