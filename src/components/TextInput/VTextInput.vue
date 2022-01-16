<template>
  <div :class="customClass">
    <slot name="prepend" v-bind="{ valid: rules && meta.valid && meta.validated }"></slot>
    <div class="flex flex-col h-full w-full">
      <label v-if="inputLabel" :for="name" :class="`${className}-label`">{{ inputLabel }}</label>
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
      />
    </div>
    <slot name="append" v-bind="{ valid: rules && meta.valid && meta.validated }"></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue-demi'
import { useField } from 'vee-validate'

export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-textinput',
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
      default: '',
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
    },
    max: {
      type: [Number, String],
    },
    step: {
      type: [Number, String],
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
      (val: any) => (inputValue.value = `${val}`),
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
      customClass,
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
