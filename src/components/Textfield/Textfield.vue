<template>
  <div
    class="
      relative
      flex
      gap-2
      items-center
      border border-gray-200
      bg-white
      rounded
      px-3
      py-1
    "
    :class="customClass"
  >
    <slot name="prepend"></slot>
    <div class="flex-grow">
      <div class="absolute top-1 pointer-events-none">
        <label
          v-if="errorLabel"
          :for="name"
          class="block text-sm font-medium mb-1 text-red-600"
          >{{ label }} {{ errorLabel }}</label
        >
        <label
          v-else
          :for="name"
          class="block text-sm font-medium mb-1 text-gray-400"
          >{{ label }}</label
        >
      </div>
      <input
        v-maska="mask"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        class="bg-transparent focus:outline-none w-full mt-5 text-black"
        :value="inputValue"
        @input="handleInput"
        @blur="handleBlur"
      />
    </div>
    <slot></slot>
    <CheckIcon
      v-if="valid || (rules && meta.valid && meta.validated)"
      class="h-5 w-5 fill-current text-green-600"
    />
    <div v-else-if="loading" class="spinner" role="status">
      <span class="sr-only">Busy...</span>
    </div>
    <span v-else-if="required" class="text-2xl -mb-2">*</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue-demi'
import { useField } from 'vee-validate'

import CheckIcon from './icons/CheckIcon.vue'

export default defineComponent({
  components: { CheckIcon },
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
      default: () => Math.floor(Math.random() * Date.now()).toString(),
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
      val => (inputValue.value = val)
    )
    const customClass = computed(() => {
      let cls = 'border-red-600 text-red-600'
      if (meta.valid || !meta.validated) {
        cls = 'focus-within:border-primary text-primary'
      }
      if (!props.disabled) {
        cls += ' border'
      }
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
