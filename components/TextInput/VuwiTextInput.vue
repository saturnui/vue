<template>
  <div :class="customClass">
    <slot name="prepend" v-bind="{ valid: rules && meta.valid && meta.validated }"></slot>
    <div class="flex flex-col h-full w-full">
      <label v-if="inputLabel" :for="name" :class="`${theme}-textinput-label`">{{ inputLabel }}</label>
      <textarea
        v-if="multiline"
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
      <input
        v-else
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
      type: String,
      default: '',
    },
    multiline: {
      type: Boolean,
      default: false,
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
      (val: string) => (inputValue.value = val),
    )
    const hasError = computed(() => {
      return props.error || errorMessage.value
    })
    const customClass = computed(() => {
      let cls = `${props.theme}-textinput`
      if (meta.valid || !meta.validated) cls = `${props.theme}-textinput`
      if (props.disabled) cls += ` ${props.theme}-textinput-disabled`
      else if (hasError.value) cls += ` ${props.theme}-textinput-error`
      return cls
    })
    const inputLabel = computed(() => {
      let val = props.label
      if (hasError.value) val += ` ${props.error || errorMessage.value}`
      return val
    })
    const handleInput = (evt: Event) => {
      const target = evt.target as HTMLInputElement | HTMLTextAreaElement
      emit('update:modelValue', target.value)
    }
    return {
      customClass,
      hasError,
      handleChange,
      handleBlur,
      handleInput,
      inputLabel,
      inputValue,
      meta,
    }
  },
})
</script>
