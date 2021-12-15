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
      default: 'right',
    },
    delayShow: {
      type: Number,
      default: 300,
    },
    delayHide: {
      type: Number,
      default: 2000,
    },
  },
  setup(props) {
    const component = ref()
    const showingTooltip = ref(false)
    let timer: any

    let popper: { destroy: any } | null

    const hideTooltip = () => {
      if (popper) {
        popper.destroy()
        popper = null
      }
      showingTooltip.value = false
      clearTimeout(timer)
      document.removeEventListener('mousedown', hideTooltip)
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
  <div
    ref="component"
    :class="`${theme}-tooltip-target`"
    aria-describedby="tooltip"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot></slot>
    <div v-if="showingTooltip" name="tooltip" role="tooltip" :class="`${theme}-tooltip`">
      <slot name="tooltip"></slot>
      <div :class="`${theme}-tooltip-arrow`" data-popper-arrow></div>
    </div>
  </div>
</template>
