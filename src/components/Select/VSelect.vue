<template>
  <div :class="customClass">
    <slot name="prepend" v-bind="{ valid: rules && meta.valid && meta.validated }"></slot>
    <div class="flex flex-col h-full w-full">
      <label v-if="inputLabel" :for="name" :class="`${className}-label`">{{ inputLabel }}</label>
      <select
        :name="name"
        :required="required"
        :value="inputValue"
        :disabled="disabled"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
      >
        <option v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
    </div>
    <slot name="append" v-bind="{ valid: rules && meta.valid && meta.validated }"></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue-demi'
import { useField } from 'vee-validate'

type Option = { label: string; value: string | number }

export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-select',
    },
    name: {
      type: String,
      required: true,
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
    modelValue: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: null,
      default: (): Option[] => [],
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: String,
      default: '',
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
      (val: any) => (inputValue.value = val),
    )
    const hasError = computed(() => {
      return props.error || errorMessage.value
    })
    const customClass = computed(() => {
      let cls = props.className
      if (meta.valid || !meta.validated) cls = props.className
      if (props.disabled) cls += ` ${props.className}-disabled`
      else if (hasError.value) cls += ` ${props.className}-error`
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
