<script lang="ts">
export default defineComponent({
  props: {
    wi: {
      type: String,
      default: 'wi-code-input',
    },
    modelValue: {
      type: String,
      default: '',
    },
    pattern: {
      type: String,
      default: 'XXX-XXX',
    },
    class: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const values = ref<string[]>([])
    const root = ref()
    let formInputs: NodeList

    const handleKeyDown = (evt: KeyboardEvent) => {
      formInputs.forEach((item, index) => {
        if (item === evt.target) {
          if (
            ['Backspace'].filter(v => new RegExp(v, 'i').test(evt.code))
              .length > 0
          ) {
            const prevItem = formInputs.item(index - 1) as HTMLInputElement
            if (prevItem) {
              setTimeout(() => {
                prevItem.focus()
              })
            }
          }
          else if (
            ['Key', 'Digit'].filter(v => new RegExp(v, 'i').test(evt.code))
              .length > 0
          ) {
            const nextItem = formInputs.item(index + 1) as HTMLInputElement
            if (nextItem) {
              setTimeout(() => {
                nextItem.focus()
              })
            }
          }
        }
      })
    }

    const focusHandler = (evt: FocusEvent) => {
      const el = evt.target as HTMLInputElement
      if (el)
        el.select()
    }

    watch(
      () => props.modelValue,
      (val = '') => {
        const vals = val.split('')
        props.pattern.split('').map((k: string, i) => {
          if (k.toUpperCase() === 'X')
            values.value[i] = vals.shift() || ''
          return false
        })
      },
      { immediate: true },
    )

    const value = computed(() => {
      return values.value.join('')
    })

    const patternList = computed(() => {
      return props.pattern.split('')
    })

    watch(value, (newVal) => {
      emit('update:modelValue', newVal)
    })

    const customClass = computed(() => {
      return props.class
    })

    onMounted(() => {
      formInputs = root.value.querySelectorAll('input')
    })

    return {
      customClass,
      root,
      focusHandler,
      handleKeyDown,
      value,
      values,
      patternList,
    }
  },
})
</script>

<template>
  <div ref="root" :class="`${wi}`">
    <div v-for="(k, i) in patternList" :key="i">
      <div v-if="k === '-'" :class="`${wi}-break`"></div>
      <input
        v-else
        v-model="values[i]"
        type="text"
        :maxlength="1"
        :class="customClass"
        @focus="focusHandler"
        @keydown="handleKeyDown"
      />
    </div>
  </div>
</template>
