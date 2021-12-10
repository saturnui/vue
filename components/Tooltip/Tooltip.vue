<script lang="ts">
import { createPopper, Placement } from '@popperjs/core'

export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi',
    },
    target: {
      type: String,
      default: '',
    },
    placement: {
      type: String,
      default: 'right',
    },
  },
  setup(props) {
    const component = ref()
    const showingTooltip = ref(false)

    let popper: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      destroy: any
    } | null

    const showTooltip = () => {
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
    }

    const hideTooltip = () => {
      if (popper) {
        popper.destroy()
        popper = null
      }
      showingTooltip.value = false
    }

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
    <div
      v-if="showingTooltip"
      name="tooltip"
      role="tooltip"
      :class="`${theme}-tooltip`"
    >
      <slot name="tooltip"></slot>
      <div :class="`${theme}-tooltip-arrow`" data-popper-arrow></div>
    </div>
  </div>
</template>
