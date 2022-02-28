<script lang="ts">
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue-demi'
import { createPopper, Placement } from '@popperjs/core'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'sa-tooltip',
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    show: {
      type: [String, Boolean],
      validator: (val: 'hover' | true) => {
        return ['hover', 'focus', true, false].includes(val)
      },
      default: 'hover',
    },
    target: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const root = ref()
    const container = ref()
    const showingTooltip = ref(false)
    let cancel = false
    let timer: any

    let popper: { destroy: any } | null

    const getValue = (className: string, defaulValue: number) => {
      const regExp = new RegExp(`${className}-(\\d+)`, 'gi')
      const classes = root.value.classList.toString()
      const result = classes.match(regExp)
      return result ? Number(result[0].replace(`${className}-`, '')) : defaulValue
    }

    const _showTooltip = () => {
      if (!showingTooltip.value) {
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
      }
    }

    const _hideTooltip = () => {
      try {
        if (cancel) {
          if (props.show === 'focus') {
            if (props.target) 
              container.value.querySelector(props.target).focus()
            else 
              container.value.firstElementChild.focus()
          }
        } else {
          clearTimeout(timer)
          if (popper) {
            popper.destroy()
            popper = null
          }
          showingTooltip.value = false
        }
      } catch (e: any) {
        console.warning(e.message)
      }
    }

    const _handleMouseEnter = () => {
      if (props.show === 'hover') {
        _showTooltip()
        const duration = getValue('duration', 2000)
        timer = setTimeout(_hideTooltip, duration)
      }
    }

    const handleMouseDown = () => {
      if (props.show === 'focus') {
        cancel = true
        setTimeout(() => cancel = false)
      }
    }

    const handleMouseEnter = () => {
      document.addEventListener('mousedown', _hideTooltip)
      const delay = getValue('delay', 1000)
      timer = setTimeout(_handleMouseEnter, delay)
    }

    const handleMouseLeave = () => {
      if (props.show === 'hover' || props.show === false) _hideTooltip()
    }

    const handleFocus = () => {
      console.log('handleFocus: show tooltip')
      _showTooltip()
    }

    const handleBlur = () => {
      _hideTooltip()
    }

    watch(() => props.show, (val) => {
      if (val === true)
        _showTooltip()

      else
        _hideTooltip()
    }, { immediate: true })

    onBeforeUnmount(_hideTooltip)

    onMounted(() => {
      try {
        if (props.show === 'focus') {
          if (props.target) {
            const targets = container.value.querySelectorAll(props.target)
            if (targets) [...targets].forEach((el: any) => el.addEventListener('focus', handleFocus))
            if (targets) [...targets].forEach((el: any) => el.addEventListener('blur', handleBlur))
          } else {
            container.value.firstElementChild.addEventListener('focus', handleFocus)
            container.value.firstElementChild.addEventListener('blur', handleBlur)
          }
        }
      } catch (e) {
        console.log('Tooltip error: target does not exist')
      }
    })

    onBeforeUnmount(() => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', _hideTooltip)
      container.value.firstElementChild.removeEventListener('focus', handleFocus)
      container.value.firstElementChild.removeEventListener('blur', handleBlur)
    })

    return {
      container,
      root,
      handleBlur,
      handleFocus,
      handleMouseDown,
      handleMouseEnter,
      handleMouseLeave,
      showingTooltip,
    }
  },
})
</script>

<template>
  <div ref="root" :class="component" aria-describedby="tooltip">
    <span ref="container" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <slot />
    </span>
    <div v-if="showingTooltip" name="tooltip" role="tooltip" @mousedown="handleMouseDown">
      <slot name="tooltip" />
      <div name="arrow" data-popper-arrow />
    </div>
  </div>
</template>
