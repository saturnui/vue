<template>
  <div :class="computedClass">
    <slot name="prepend" v-bind="{ valid: rules && meta.valid && meta.validated }" />
    <div class="flex flex-col h-full w-full">
      <label v-if="inputLabel" :for="name" :class="`${component}-label`">{{ inputLabel }}</label>
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
    <slot name="append" v-bind="{ valid: rules && meta.valid && meta.validated }" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue-demi'
import { useField } from 'vee-validate'

type Option = { label: string; value: string | number }

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'wi-select',
    },
    name: {
      type: String,
      default: '',
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
    const computedClass = computed(() => {
      let cls = props.component
      if (meta.valid || !meta.validated) cls = props.component
      if (props.disabled) cls += ` ${props.component}-disabled`
      else if (hasError.value) cls += ` ${props.component}-error`
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
      computedClass,
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
