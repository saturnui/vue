<template>
  <div :class="computedClass">
    <slot name="prepend" v-bind="{ valid: rules && meta.valid && meta.validated }" />
    <div class="flex flex-col h-full w-full">
      <label v-if="inputLabel" :for="name">{{ inputLabel }}</label>
      <textarea
        v-if="multiline"
        v-maska="mask"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        :value="stringify(inputValue)"
        :disabled="disabled"
        @input="handleEvent"
        @blur="handleEvent"
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
        :min="min"
        :max="max"
        :step="step"
        @input="handleEvent"
        @blur="handleEvent"
      >
    </div>
    <slot name="append" v-bind="{ valid: rules && meta.valid && meta.validated }" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue-demi'
import { useField } from 'vee-validate'

const randomInt = (min = 0, max = 99999) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'sa-textinput',
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
      type: [String, Boolean, Number],
      default: '',
    },
    multiline: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: () => `input_${randomInt()}`,
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: Boolean,
    rules: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    min: {
      type: [Number, String],
      default: 1,
    },
    max: {
      type: [Number, String],
      default: 100,
    },
    step: {
      type: [Number, String],
      default: 1,
    },
  },
  emits: ['update:modelValue', 'input', 'blur'],
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
      (val: any) => inputValue.value = `${val}`,
    )
    const hasError = computed(() => {
      return props.error || errorMessage.value
    })
    const computedClass = computed(() => {
      return (!props.disabled && hasError.value) ? `${props.component} has-error` : props.component
    })
    const inputLabel = computed(() => {
      let val = props.label
      // if (hasError.value) val += ` ${props.error || errorMessage.value}`
      if (hasError.value) val = `${props.error || errorMessage.value}`
      return val
    })
    const handleInput = (evt: Event) => {
      const target = evt.target as HTMLInputElement | HTMLTextAreaElement
      emit('update:modelValue', target.value)
    }

    const stringify = (val: any) => {
      return `${val}`
    }

    const handleEvent = (v: any) => {
      switch (v.type) {
        case 'input':
          handleInput(v)
          break
        case 'blur':
          handleBlur(v)
          break
      }
      emit(v.type, v)
    }
    return {
      computedClass,
      stringify,
      hasError,
      handleEvent,
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
