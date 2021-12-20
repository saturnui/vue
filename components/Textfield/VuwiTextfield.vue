<template>
  <div :class="customClass">
    <slot name="prepend" v-bind="{ valid: rules && meta.valid && meta.validated }"></slot>
    <div class="flex-grow">
      <label v-if="inputLabel" :for="name" :class="`${theme}-textfield-label`">{{ inputLabel }}</label>
      <input
        v-maska="mask"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        :value="inputValue"
        :disabled="disabled"
        @input="handleInput"
        @blur="handleBlur"
      />
    </div>
    <slot name="append" v-bind="{ valid: rules && meta.valid && meta.validated }"></slot>
  </div>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { useUuid } from '../../composables'

export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi',
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    disabled: Boolean,
    error: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    mask: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: () => '',
    },
    name: {
      type: String,
      default: () => useUuid(),
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: Boolean,
    rules: {
      type: Function,
      default: null,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(props.name, props.rules, {
      initialValue: props.modelValue,
    })
    watch(
      () => props.modelValue,
      (val: string | number) => (inputValue.value = val),
    )
    const hasError = computed(() => {
      return props.error || errorMessage.value
    })
    const customClass = computed(() => {
      let cls = `${props.theme}-textfield`
      if (meta.valid || !meta.validated) cls = `${props.theme}-textfield`
      if (props.disabled) cls += ' disabled'
      else if (hasError.value) cls += ` ${props.theme}-textfield-error`
      return cls
    })
    const inputLabel = computed(() => {
      let val = props.label
      if (hasError.value) val += ` ${props.error || errorMessage.value}`
      return val
    })
    const handleInput = (evt: Event) => {
      const target = evt.target as HTMLInputElement
      emit('update:modelValue', target.value)
    }
    return {
      customClass,
      inputLabel,
      hasError,
      handleChange,
      handleBlur,
      handleInput,
      inputValue,
      meta,
    }
  },
})
</script>
