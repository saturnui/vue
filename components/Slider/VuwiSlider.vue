<script lang="ts">
export default defineComponent({
  props: {
    rootClass: {
      type: String,
      default: 'vuwi-slider',
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    minVal: {
      type: Number,
      default: 0,
    },
    maxVal: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
  emits: ['update:min', 'update:max'],
  setup(props, { emit }) {
    const minThumb = ref(0)
    const maxThumb = ref(0)
    const minValueInput = ref(props.min)
    const maxValueInput = ref(props.max)
    const minVal = ref(props.minVal)
    const maxVal = ref(props.maxVal)

    const handleMinInput = () => {
      minValueInput.value = Math.min(minValueInput.value, maxValueInput.value)
      minThumb.value = ((minValueInput.value - minVal.value) / (maxVal.value - minVal.value)) * 100
      emit('update:min', minValueInput.value)
    }

    const handleMaxInput = () => {
      maxValueInput.value = Math.max(maxValueInput.value, minValueInput.value)
      maxThumb.value = ((maxValueInput.value - minVal.value) / (maxVal.value - minVal.value)) * 100
      emit('update:max', maxValueInput.value)
    }

    const thumbLeft = ref<HTMLElement>()
    const thumbRight = ref<HTMLElement>()
    const thumbLeftStyle = ref()
    const thumbRightStyle = ref()

    onMounted(() => {
      const thumbLeftWidth = thumbLeft.value?.offsetWidth || 0
      const thumbRightWidth = thumbRight.value?.offsetWidth || 0
      thumbLeftStyle.value = {
        width: `calc(100% - ${thumbLeftWidth}px)`,
      }
      thumbRightStyle.value = {
        width: `calc(100% - ${thumbRightWidth}px)`,
      }

      handleMinInput()
      handleMaxInput()
    })

    return {
      handleMaxInput,
      handleMinInput,
      maxThumb,
      minThumb,
      maxValueInput,
      minValueInput,
      thumbLeft,
      thumbLeftStyle,
      thumbRight,
      thumbRightStyle,
    }
  },
})

</script>

<template>
  <div :class="rootClass">
    <!-- <div class="absolute vuwi-ml w-full bg-red-500"> -->
    <input
      v-model="minValueInput"
      type="range"
      :step="step"
      :min="minVal"
      :max="maxVal"
      @input="handleMinInput"
    />

    <input
      v-model="maxValueInput"
      type="range"
      :step="step"
      :min="minVal"
      :max="maxVal"
      @input="handleMaxInput"
    />

    <!-- Track -->
    <div :class="`${rootClass}-track vuwi-ml`" />

    <!-- Highlight -->
    <div
      :class="`${rootClass}-highlight vuwi-ml`"
      :style="`left: ${minThumb}%; right: calc(100% - ${maxThumb}%)`"
    ></div>

    <!-- Thumb Left -->
    <div class="absolute vuwi-mc" :style="thumbLeftStyle">
      <div class="absolute" :style="`left: ${minThumb}%`">
        <div ref="thumbLeft" :class="`${rootClass}-thumb vuwi-mc`">
          <slot name="thumb-left" />
        </div>
      </div>
    </div>

    <!-- Thumb Right -->
    <div class="absolute vuwi-mc" :style="thumbRightStyle">
      <div class="absolute" :style="`left: ${maxThumb}%`">
        <div ref="thumbRight" :class="`${rootClass}-thumb vuwi-mc`">
          <slot name="thumb-right" />
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>
