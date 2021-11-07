<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue-demi'
export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    pattern: {
      type: String,
      default: 'XXX-XXX',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const values = ref<string[]>([])
    const root = ref()
    let formInputs: NodeList

    const handleKeyDown = (evt: KeyboardEvent) => {
      console.log(
        'evt:',
        evt,
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
            } else if (
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
      )
    }

    const focusHandler = (evt: FocusEvent) => {
      let el = evt.target as HTMLInputElement
      if (el) {
        el.select()
      }
    }

    watch(
      () => props.modelValue,
      (val = '') => {
        const vals = val.split('')
        props.pattern.split('').map((k: string, i) => {
          if (k.toUpperCase() === 'X') {
            console.log(i, k)
            values.value[i] = vals.shift() || ''
          }
        })
      },
      { immediate: true }
    )

    const value = computed(() => {
      return values.value.join('')
    })

    const patternList = computed(() => {
      return props.pattern.split('')
    })

    watch(value, newVal => {
      emit('update:modelValue', newVal)
    })

    onMounted(() => {
      formInputs = root.value.querySelectorAll('input')
    })

    return {
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
  <div ref="root" class="vuwi-code-input">
    <div v-for="(k, i) in patternList" :key="i">
      <div v-if="k === '-'" class="vuwi-code-input-break"></div>
      <input
        v-else
        v-model="values[i]"
        type="text"
        :maxlength="1"
        @focus="focusHandler"
        @keydown="handleKeyDown"
      />
    </div>
  </div>
</template>
