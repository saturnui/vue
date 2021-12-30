<script lang="ts">
export default defineComponent({
  props: {
    rootClass: {
      type: String,
      default: 'vuwi-slider',
    },
    min: { // CURRENT MIN
      type: Number,
      default: 0,
    },
    max: { // CURRENT MAX
      type: Number,
      default: 100,
    },
    minVal: { // RANGE MIN
      type: Number,
      default: 0,
    },
    maxVal: { // RANGE MAX
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    range: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:min', 'update:max'],
  setup(props, { emit }) {
    const minThumb = ref(0)
    const maxThumb = ref(0)
    const minValueInput = ref(Math.max(props.min, props.minVal))
    const maxValueInput = ref(Math.min(props.max, props.maxVal))
    const minVal = ref(props.minVal)
    const maxVal = ref(props.maxVal)

    const handleMinInput = () => {
      if (props.range) {
        minValueInput.value = Math.min(minValueInput.value, maxVal.value, maxValueInput.value)
        minThumb.value = ((minValueInput.value - minVal.value) / (maxVal.value - minVal.value)) * 100
        emit('update:min', minValueInput.value)
      }
    }

    const handleMaxInput = () => {
      maxValueInput.value = Math.max(maxValueInput.value, minVal.value, minValueInput.value)
      maxThumb.value = ((maxValueInput.value - minVal.value) / (maxVal.value - minVal.value)) * 100
      emit('update:max', maxValueInput.value)
    }

    const thumbLeft = ref<HTMLElement>()
    const thumbRight = ref<HTMLElement>()
    const thumbLeftStyle = ref()
    const thumbRightStyle = ref()

    watch(() => props.min, (val: number) => {
      minValueInput.value = Math.max(val, props.minVal)
      handleMinInput()
    })
    watch(() => props.max, (val: number) => {
      maxValueInput.value = Math.min(val, props.maxVal)
      handleMaxInput()
    })

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
    <div class="absolute vuwi-ml w-full">
      <input
        v-if="range"
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
      <div :class="`${rootClass}-track vuwi-ml`">
        <slot name="track" />
      </div>

      <!-- Highlight -->
      <div
        :class="`${rootClass}-highlight vuwi-ml`"
        :style="`left: ${minThumb}%; right: calc(100% - ${maxThumb}%)`"
      >
        <slot name="highlight" />
      </div>

      <!-- Thumb (Left) -->
      <div v-if="range" class="absolute vuwi-mc" :style="thumbLeftStyle">
        <div class="absolute" :style="`left: ${minThumb}%`">
          <div ref="thumbLeft" :class="`${rootClass}-thumb vuwi-mc`">
            <slot name="thumb-left" />
          </div>
        </div>
      </div>

      <!-- Thumb (Right) -->
      <div class="absolute vuwi-mc" :style="thumbRightStyle">
        <div class="absolute" :style="`left: ${maxThumb}%`">
          <div ref="thumbRight" :class="`${rootClass}-thumb vuwi-mc`">
            <slot name="thumb-right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
