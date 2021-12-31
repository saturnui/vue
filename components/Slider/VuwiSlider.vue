<script lang="ts">
export default defineComponent({
  props: {
    rootClass: {
      type: String,
      default: 'vuwi-slider',
    },
    min: { // RANGE MIN
      type: Number,
      default: 0,
    },
    max: { // RANGE MAX
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    modelValue: {
      type: [Number, Array],
      default: (): number[] => [100],
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isArray = props.modelValue instanceof Array
    const range = isArray && props.modelValue.length === 2
    const minThumb = ref(0)
    const maxThumb = ref(0)
    const rangeVal0 = ref(0)
    const rangeVal1 = ref(100)
    const minVal = ref(props.min)
    const maxVal = ref(props.max)

    if (range) {
      rangeVal0.value = Math.max(isArray ? props.modelValue[0] as number : Number(props.modelValue), props.min)
      rangeVal1.value = Math.min(isArray ? props.modelValue[1] as number : Number(props.modelValue), props.max)
    } else {
      rangeVal1.value = Math.min(isArray ? props.modelValue[0] as number : Number(props.modelValue), props.max)
    }

    const handleMinInput = () => {
      if (range) {
        rangeVal0.value = Math.min(rangeVal0.value, maxVal.value, rangeVal1.value)
        minThumb.value = ((rangeVal0.value - minVal.value) / (maxVal.value - minVal.value)) * 100
        if (isArray) emit('update:modelValue', [rangeVal0.value, rangeVal1.value])
        else emit('update:modelValue', rangeVal1.value)
      }
    }

    const handleMaxInput = () => {
      rangeVal1.value = Math.max(rangeVal1.value, minVal.value, rangeVal0.value)
      maxThumb.value = ((rangeVal1.value - minVal.value) / (maxVal.value - minVal.value)) * 100
      if (range) emit('update:modelValue', [rangeVal0.value, rangeVal1.value])
      else if (isArray) emit('update:modelValue', [rangeVal1.value])
      else emit('update:modelValue', rangeVal1.value)
    }

    const thumbLeft = ref<HTMLElement>()
    const thumbRight = ref<HTMLElement>()
    const thumbLeftStyle = ref()
    const thumbRightStyle = ref()

    watch(() => props.modelValue, (newVal: any, oldVal: any) => {
      if (`${newVal}` !== `${oldVal}`) {
        if (range) {
          rangeVal0.value = Math.max(isArray ? newVal[0] as number : Number(props.modelValue), props.min)
          rangeVal1.value = Math.min(isArray ? newVal[1] as number : Number(props.modelValue), props.max)
        } else {
          rangeVal1.value = Math.min(isArray ? newVal[0] as number : Number(props.modelValue), props.max)
        }
        handleMinInput()
        handleMaxInput()
      }
    }, { deep: true })

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
      rangeVal1,
      rangeVal0,
      range,
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
        v-model="rangeVal0"
        type="range"
        :step="step"
        :min="min"
        :max="max"
        @input="handleMinInput"
      />

      <input
        v-model="rangeVal1"
        type="range"
        :step="step"
        :min="min"
        :max="max"
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
