<template>
  <div class="vuwi-textfield" :class="customClass">
    <slot name="prepend"></slot>
    <div class="flex-grow">
      <div class="absolute top-1 pointer-events-none">
        <label v-if="errorLabel" :for="name" class="vuwi-textfield-error">{{ label }} {{ errorLabel }}</label>
        <label v-else :for="name" class="block text-sm font-medium mb-1 text-black dark:text-white text-opacity-40 dark:text-opacity-40">{{ label }}</label>
      </div>
      <input
        v-maska="mask"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        :value="inputValue"
        @input="handleInput"
        @blur="handleBlur"
      />
    </div>
    <slot></slot>
    <tabler-check v-if="valid || (rules && meta.valid && meta.validated)" class="vuwi-textfield-check" />
    <div
      v-else-if="loading"
      class="vuwi-spinner w-6 h-6 border-3 dark:border-gray-500 dark:border-r-transparent"
      role="status"
    >
      <span class="sr-only">Busy...</span>
    </div>
    <span v-else-if="required" class="text-2xl">
      <tabler-check class="vuwi-textfield-required" />
    </span>
  </div>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { useUuid } from '~/composables'

export default defineComponent({
  props: {
    autocomplete: {
      type: String,
      default: '',
    },
    loading: Boolean,
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
    valid: {
      type: Boolean,
      default: false,
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
    const customClass = computed(() => {
      let cls = 'border-red-600 text-red-600'
      if (meta.valid || !meta.validated) cls = 'focus-within:border-primary focus-within:!border-opacity-100 text-primary'

      // if (!props.disabled) cls += ' border'

      return cls
    })
    const errorLabel = computed(() => {
      return props.error || errorMessage.value
    })
    const handleInput = (evt: Event) => {
      const target = evt.target as HTMLInputElement
      emit('update:modelValue', target.value)
    }
    return {
      customClass,
      errorLabel,
      handleChange,
      handleBlur,
      handleInput,
      inputValue,
      meta,
    }
  },
})
</script>
