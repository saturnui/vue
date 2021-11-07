<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue-demi'
export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const formInput1 = ref('')
    const formInput2 = ref('')
    const formInput3 = ref('')
    const formInput4 = ref('')
    const formInput5 = ref('')
    const formInput6 = ref('')

    const val1 = ref('')
    const val2 = ref('')
    const val3 = ref('')
    const val4 = ref('')
    const val5 = ref('')
    const val6 = ref('')

    const handleKeyDown = (
      code: string,
      prevInput: HTMLInputElement,
      nextInput: HTMLInputElement
    ) => {
      if (['Backspace'].filter(v => new RegExp(v, 'i').test(code)).length > 0) {
        if (prevInput) {
          setTimeout(() => {
            prevInput.focus()
          })
        }
      } else if (
        ['Key', 'Digit'].filter(v => new RegExp(v, 'i').test(code)).length > 0
      ) {
        if (nextInput) {
          setTimeout(() => {
            nextInput.focus()
          })
        }
      }
    }

    const focusHandler = evt => {
      evt.target.select()
    }

    watch(
      () => props.modelValue,
      val => {
        val1.value = val[0] || ''
        val2.value = val[1] || ''
        val3.value = val[2] || ''
        val4.value = val[3] || ''
        val5.value = val[4] || ''
        val6.value = val[5] || ''
      }
    )

    const value = computed(() => {
      return (
        val1.value +
        val2.value +
        val3.value +
        val4.value +
        val5.value +
        val6.value
      )
    })

    watch(value, newVal => {
      emit('update:modelValue', newVal)
    })

    return {
      focusHandler,
      handleKeyDown,
      value,
      val1,
      val2,
      val3,
      val4,
      val5,
      val6,
      formInput1,
      formInput2,
      formInput3,
      formInput4,
      formInput5,
      formInput6,
    }
  },
})
</script>

<template>
  <div class="vuwi-code-input">
    <input
      ref="formInput1"
      v-model="val1"
      type="text"
      :maxlength="1"
      @focus="focusHandler($event)"
      @keydown="handleKeyDown(val1, null, formInput2)"
    />
    <input
      ref="formInput2"
      v-model="val2"
      type="text"
      :maxlength="1"
      @focus="focusHandler($event)"
      @keydown="handleKeyDown(val2, formInput1, formInput3)"
    />
    <input
      ref="formInput3"
      v-model="val3"
      type="text"
      :maxlength="1"
      @focus="focusHandler($event)"
      @keydown="handleKeyDown(val3, formInput2, formInput4)"
    />
    <span class="vuwi-code-input-break"></span>
    <input
      ref="formInput4"
      v-model="val4"
      type="text"
      :maxlength="1"
      @focus="focusHandler($event)"
      @keydown="handleKeyDown(val4, formInput3, formInput5)"
    />
    <input
      ref="formInput5"
      v-model="val5"
      type="text"
      :maxlength="1"
      @focus="focusHandler($event)"
      @keydown="handleKeyDown(val5, formInput4, formInput6)"
    />
    <input
      ref="formInput6"
      v-model="val6"
      type="text"
      :maxlength="1"
      @focus="focusHandler($event)"
      @keydown="handleKeyDown(val6, formInput5, null)"
    />
  </div>
</template>
