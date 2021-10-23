<template>
  <div class="relative flex gap-2 items-center border border-gray-200 bg-white rounded pr-2 py-1" :class="customClass">
    <slot name="prepend"> </slot>
    <div class="flex-grow">
      <div class="absolute top-1 pointer-events-none px-3">
        <label v-if="errorLabel" :for="name" class="block font-medium mb-1 text-red-600" style="font-size: 11px">
          {{ label }} {{ errorLabel }}
        </label>
        <label v-else :for="name" class="block font-medium mb-1 text-gray-500" style="font-size: 11px">
          {{ label }}
        </label>
      </div>
      <select
        :name="name"
        :required="required"
        :autocomplete="autocomplete"
        class="focus:outline-none w-full pt-4 px-2 text-black"
        v-model="value"
        @change="$emit('update:modelValue', $event.target.value)"
        @blur="handleBlur"
      >
        <option v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
    </div>
    <slot></slot>
    <div v-if="loading">
      <div class="spinner w-5 h-5 text-gray-300" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <check-icon v-else-if="rules && meta.valid" class="text-green-500"></check-icon>
    <span v-else-if="required" class="text-2xl -mb-2">*</span>
  </div>
</template>


<script>
import { computed } from 'vue'
import { useField } from 'vee-validate'

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    autocomplete: String,
    error: String,
    label: String,
    loading: Boolean,
    mask: String,
    modelValue: String,
    options: {
      type: Array,
      default: [],
    },
    // placeholder: String,
    required: Boolean,
    // type: {
    //   type: String,
    //   default: 'text',
    // },
    rules: Function,
  },
  emits: ['update:modelValue'],
  setup(props) {
    const { value, errorMessage, handleBlur, handleChange, meta } = useField(props.name, props.rules, {
      initialValue: props.modelValue,
    })
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
      value,
      meta,
      customClass,
    }
  },
}
</script>