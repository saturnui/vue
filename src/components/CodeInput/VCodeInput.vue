<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue-demi'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'wi-codeinput',
    },
    modelValue: {
      type: String,
      default: '',
    },
    pattern: {
      type: String,
      default: 'XXX-XXX',
    },
    inputClass: {
      type: String,
      default: '',
    },
    allowPaste: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const values = ref<string[]>([])
    const root = ref()

    const value = computed(() => {
      return values.value.join('')
    })

    const patternList = computed(() => {
      return props.pattern.split('')
    })

    const handleKeyDown = (evt: KeyboardEvent) => {
      const formInputs = root.value.querySelectorAll('input')
      formInputs.forEach((item: any, index: number) => {
        if (item === evt.target) {
          if (evt.code === 'Backspace') {
            const prevItem = formInputs.item(index - 1) as HTMLInputElement
            if (prevItem) {
              setTimeout(() => {
                prevItem.focus()
              })
            }
          } else if (evt.code.includes('Key') || evt.code.includes('Digit')) {
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

    watch(value, (newVal) => {
      emit('update:modelValue', newVal)
    })

    document.onpaste = (evt: ClipboardEvent) => {
      const formInputs = root.value.querySelectorAll('input')
      if (props.allowPaste && formInputs) {
        const data = evt.clipboardData
        if (data) {
          const text = data.getData('text')
          emit('update:modelValue', text.substring(0, formInputs.length))
        }
      }
    }

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
  <div ref="root" :class="component">
    <div v-for="(k, i) in patternList" :key="i">
      <div v-if="k === '-'" name="separator" />
      <input
        v-else
        v-model="values[i]"
        type="text"
        :maxlength="1"
        :class="inputClass"
        @focus="focusHandler"
        @keydown="handleKeyDown"
      >
    </div>
  </div>
</template>
