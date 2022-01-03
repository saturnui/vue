
<script lang="ts">
export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'wi',
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    sliderClass: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    let scrollTimer: any
    const slider = ref<HTMLElement>()

    const nextSlide = (skip = 1) => {
      if (slider.value) {
        // clearTimeout(scrollTimer)
        const newIndex = props.modelValue + skip
        emit('update:modelValue', Math.min(newIndex, slider.value.childElementCount - 1))
      }
    }

    const prevSlide = (skip = 1) => {
      if (slider.value) {
        // clearTimeout(scrollTimer)
        const newIndex = props.modelValue - skip
        emit('update:modelValue', Math.max(newIndex, 0))
      }
    }

    const maxPos = 5
    const timeoutInterval = 400
    const handleScroll = () => {
      clearInterval(scrollTimer)
      scrollTimer = setTimeout(() => {
        if (slider.value) {
          const sliderRect = slider.value.getBoundingClientRect()
          for (let index = 0; index < slider.value.children.length; index++) {
            const element = slider.value.children[index]
            if (element) {
              let relativePos
              if (props.vertical) 
                relativePos = element.getBoundingClientRect().y - sliderRect.top
              else 
                relativePos = element.getBoundingClientRect().x - sliderRect.left

              if (relativePos >= -maxPos && relativePos <= maxPos) {
                emit('update:modelValue', index)
                return
              }
            }
          }
          emit('update:modelValue', slider.value.children.length - 1)
        }
      }, timeoutInterval)
    }

    watch(
      () => props.modelValue,
      (val) => {
        if (slider.value) {
          const sliderRect = slider.value.getBoundingClientRect()
          const el = slider.value.children[val]
          if (props.vertical) {
            const scrollTotal = el.getBoundingClientRect().y - sliderRect.top
            slider.value.scrollTop += scrollTotal
          }
          else {
            const scrollTotal = el.getBoundingClientRect().x - sliderRect.left
            slider.value.scrollLeft += scrollTotal
          }
        }
      },
      { immediate: true },
    )

    const sliderDirection = computed(() => {
      if (props.vertical) return `${props.theme}-carousel-vertical`
      return ''
    })

    return {
      slider,
      nextSlide,
      prevSlide,
      handleScroll,
      sliderDirection,
    }
  },
})
</script>

<template>
  <div class="relative">
    <div
      ref="slider"
      class="relative wi-carousel"
      :class="`${sliderDirection} ${sliderClass}`"
      @scroll="handleScroll"
    >
      <slot></slot>
    </div>
    <slot name="overlay" v-bind="{ nextSlide, prevSlide }"></slot>
  </div>
</template>
