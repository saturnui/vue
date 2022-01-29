<script lang="ts">
import { defineComponent, nextTick, onBeforeUnmount, ref, watch } from 'vue-demi'
import { createPopper, Placement } from '@popperjs/core'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'wi-tooltip',
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
    show: {
      type: [String, Boolean],
      validator: (val: 'auto' | true) => {
        return ['auto', true].includes(val)
      },
      default: 'auto',
    },
  },
  setup(props) {
    const root = ref()
    const showingTooltip = ref(false)
    let timer: any

    let popper: { destroy: any } | null

    const hideTooltip = () => {
      clearTimeout(timer)
      if (props.show !== true) {
        if (popper) {
          popper.destroy()
          popper = null
        }
        showingTooltip.value = false
        document.removeEventListener('mousedown', hideTooltip)
      }
    }

    const _showTooltip = () => {
      showingTooltip.value = true
      nextTick(() => {
        const tooltipEl = root.value.querySelector('[name="tooltip"]')
        popper = createPopper(root.value, tooltipEl, {
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
      timer = setTimeout(hideTooltip, props.delayHide)
    }

    const showTooltip = () => {
      document.addEventListener('mousedown', hideTooltip)
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
      root,
      hideTooltip,
      showTooltip,
      showingTooltip,
    }
  },
})
</script>

<template>
  <div ref="root" :class="component" aria-describedby="tooltip">
    <span @mouseenter="showTooltip" @mouseleave="hideTooltip">
      <slot />
    </span>
    <div
      v-if="showingTooltip"
      name="tooltip"
      role="tooltip"
    >
      <slot name="tooltip" />
      <div name="arrow" data-popper-arrow />
    </div>
  </div>
</template>
