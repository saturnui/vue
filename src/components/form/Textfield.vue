<template>
  <div class="relative flex gap-2 items-center border border-gray-200 bg-white rounded px-3 py-1" :class="customClass">
    <slot name="prepend"> </slot>
    <div class="flex-grow">
      <div class="absolute top-1 pointer-events-none">
        <label v-if="errorLabel" :for="name" class="block font-medium mb-1 text-red-600" style="font-size: 11px">
          {{ label }} {{ errorLabel }}
        </label>
        <label v-else :for="name" class="block font-medium mb-1 text-gray-400" style="font-size: 11px">
          {{ label }}
        </label>
      </div>
      <input
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        class="bg-transparent focus:outline-none w-full pt-5 pb-1 text-black"
        style="font-size: 15px"
        v-maska="mask"
        :value="inputValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="handleBlur"
      />
    </div>
    <slot></slot>
    <div v-if="loading" class="spinner" role="status">
      <span class="sr-only">Busy...</span>
    </div>
    <check-icon v-else-if="rules && meta.valid && meta.validated" class="text-green-500"></check-icon>
    <span v-else-if="required" class="text-2xl -mb-2">*</span>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useField } from 'vee-validate'

export default {
  props: {
    autocomplete: String,
    loading: Boolean,
    error: String,
    label: String,
    mask: String,
    modelValue: {
      type: [String, Number],
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    placeholder: String,
    required: Boolean,
    rules: Function,
    type: {
      type: String,
      default: 'text',
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
      val => (inputValue.value = val)
    )

    const customClass = computed(() => {
      if (meta.valid || !meta.validated) {
        return 'focus-within:border-primary text-primary'
      }
      return 'border-red-600 text-red-600'
    })

    const errorLabel = computed(() => {
      return props.error || errorMessage.value
    })

    return {
      handleChange,
      handleBlur,
      errorLabel,
      inputValue,
      meta,
      customClass,
    }
  },
}
</script>
