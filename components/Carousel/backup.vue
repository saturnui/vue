<script setup lang="ts">
const slideIndex = ref(0)
const slides = [
  'bg-yellow-600 h-50',
  'bg-teal-600 h-50',
  'bg-blue-600 h-50',
  'bg-red-600 h-50',
  'bg-gray-600 h-50',
]
</script>

<template>
  <div class="relative">
    <VuwiCarousel v-model="slideIndex">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="flex items-center justify-center w-full text-4xl text-white vuwi-carousel-item"
        :class="slide"
      >{{ index + 1 }}</div>
      <!-- <template #overlay="{ prevSlide, nextSlide }">
        <div class="absolute bottom-2 w-full flex justify-center px-2 gap-4">
          <button class="vuwi-btn vuwi-btn-xs border-2 text-white" @click="prevSlide">Prev</button>
          <div class="flex items-center text-lg text-white">{{ slideIndex + 1 }}</div>
          <button class="vuwi-btn vuwi-btn-xs border-2 text-white" @click="nextSlide">Next</button>
        </div>
      </template> -->
    </VuwiCarousel>
  </div>
</template>


<script lang="ts">
export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi',
    },
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const slider = ref<HTMLElement>()

    const nextSlide = () => {
      if (slider.value) {
        const newIndex = props.modelValue + 1
        if (newIndex < slider.value.childElementCount)
          emit('update:modelValue', newIndex)
      }
    }

    const prevSlide = () => {
      if (slider.value) {
        const newIndex = props.modelValue - 1
        if (newIndex >= 0)
          emit('update:modelValue', newIndex)
      }
    }

    const handleScroll = () => {
      if (slider.value) {
        const scrollPos = slider.value.scrollLeft + slider.value.clientWidth
        const currentIndex = Math.floor(scrollPos / slider.value.clientWidth) - 1
        console.log('scrolling', currentIndex)
        // if (currentIndex !== props.modelValue)
        //   emit('update:modelValue', currentIndex)
      }
    }

    watch(
      () => props.modelValue,
      (val) => {
        if (slider.value) {
          const scrollPos = slider.value.clientWidth * val
          slider.value.scrollLeft = scrollPos
        }
      },
      { immediate: true },
    )

    return {
      slider,
      nextSlide,
      prevSlide,
      handleScroll,
    }
  },
})
</script>

<template>
  <div class="relative">
    <div ref="slider" class="relative vuwi-carousel" @scroll="handleScroll">
      <slot></slot>
    </div>
    <slot name="overlay" v-bind="{ nextSlide, prevSlide }"></slot>
  </div>
</template>

