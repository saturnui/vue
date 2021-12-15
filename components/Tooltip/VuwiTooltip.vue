<script lang="ts">
import { createPopper, Placement } from '@popperjs/core'

export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi',
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    delayShow: {
      type: Number,
      default: 300,
    },
    delayHide: {
      type: Number,
      default: 2000,
    },
    tooltipClass: {
      type: String,
      default: 'vuwi-tooltip-card',
    },
    show: {
      type: [String, Boolean],
      validator: (val: 'auto' | true) => {
        return ['auto', true].includes(val)
      },
      default: 'auto',
    },
  },
  setup(props) {
    const component = ref()
    const showingTooltip = ref(false)
    let timer: any

    let popper: { destroy: any } | null

    const hideTooltip = () => {
      if (props.show !== true) {
        if (popper) {
          popper.destroy()
          popper = null
        }
        showingTooltip.value = false
        clearTimeout(timer)
        document.removeEventListener('mousedown', hideTooltip)
      }
    }

    const _showTooltip = () => {
      showingTooltip.value = true
      nextTick(() => {
        const tooltipEl = component.value.querySelector('[name="tooltip"]')
        popper = createPopper(component.value, tooltipEl, {
          placement: props.placement as Placement,
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
          ],
        })
      })
      setTimeout(() => {
        document.addEventListener('mousedown', hideTooltip)
      })
      timer = setTimeout(hideTooltip, props.delayHide)
    }

    const showTooltip = () => {
      timer = setTimeout(_showTooltip, props.delayShow)
    }

    watch(() => props.show, (val) => {
      if (val === true)
        _showTooltip()

      else
        hideTooltip()
    }, { immediate: true })

    onBeforeUnmount(hideTooltip)

    return {
      component,
      hideTooltip,
      showTooltip,
      showingTooltip,
    }
  },
})
</script>

<template>
  <div ref="component" :class="`${theme}-tooltip-target`" aria-describedby="tooltip">
    <span @mouseenter="showTooltip" @mouseleave="hideTooltip">
      <slot></slot>
    </span>
    <div
      v-if="showingTooltip"
      name="tooltip"
      role="tooltip"
      :class="`${theme}-tooltip ${tooltipClass}`"
    >
      <slot name="tooltip"></slot>
      <div :class="`${theme}-tooltip-arrow`" data-popper-arrow></div>
    </div>
  </div>
</template>
