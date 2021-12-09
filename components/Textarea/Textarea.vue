<template>
  <div class="vuwi-textarea" :class="customClass">
    <slot name="prepend"></slot>
    <div class="flex-grow">
      <div class="absolute top-1 pointer-events-none">
        <label
          v-if="errorLabel"
          :for="name"
          class="vuwi-textarea-error"
        >{{ label }} {{ errorLabel }}</label>
        <label v-else :for="name" class="block text-sm font-medium mb-1 text-gray-400">{{ label }}</label>
      </div>
      <textarea
        v-model="inputValue"
        v-maska="mask"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        @input="handleChange"
        @blur="handleBlur"
      />
    </div>
    <slot></slot>
    <tabler-check
      v-if="valid || (rules && meta.valid && meta.validated)"
      class="vuwi-textarea-check"
    />
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

export default defineComponent({
  props: {
    autocomplete: {
      type: String,
      default: '',
    },
    disabled: Boolean,
    loading: {
      type: Boolean,
      default: false,
    },
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
    name: {
      type: String,
      default: () => Math.floor(Math.random() * Date.now()).toString(),
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: String,
      default: '',
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
  setup(props) {
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
      val => (inputValue.value = val),
    )
    const textareaClass = computed(() => {
      if (meta.valid || !meta.validated)
        return 'focus-within:border-primary text-primary'

      return 'border-red-600 text-red-600'
    })
    const errorLabel = computed(() => {
      return props.error || errorMessage.value
    })

    const customClass = computed(() => {
      let cls = 'border-red-600 text-red-600'
      if (meta.valid || !meta.validated) cls = 'focus-within:border-primary focus-within:!border-opacity-100 text-primary'
      if (props.disabled) cls += ' disabled'

      return cls
    })

    return {
      customClass,
      errorLabel,
      handleChange,
      handleBlur,
      inputValue,
      meta,
      textareaClass,
    }
  },
})
</script>
