<template>
  <div
    class="relative flex gap-2 items-center border border-gray-200 bg-white rounded px-3 py-1"
    :class="customClass"
  >
    <slot name="prepend"></slot>
    <div class="flex-grow">
      <div class="absolute top-1 pointer-events-none">
        <label
          v-if="errorLabel"
          :for="name"
          class="block font-medium mb-1 text-red-600"
          style="font-size: 11px"
        >{{ label }} {{ errorLabel }}</label>
        <label
          v-else
          :for="name"
          class="block font-medium mb-1 text-gray-400"
          style="font-size: 11px"
        >{{ label }}</label>
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
        @input="handleInput"
        @blur="handleBlur"
      />
    </div>
    <slot></slot>
    <div v-if="loading" class="spinner" role="status">
      <span class="sr-only">Busy...</span>
    </div>
    <!-- <tabuler-check v-else-if="rules && meta.valid && meta.validated" class="text-green-500"></tabuler-check> -->
    <span v-else-if="required" class="text-2xl -mb-2">*</span>
  </div>
</template>

<script lang="ts">
import { computed, watch } from 'vue'
import { useField } from 'vee-validate'

import { defineComponent } from "@vue/runtime-core"

export default defineComponent({
  props: {
    autocomplete: String,
    loading: Boolean,
    disabled: Boolean,
    error: String,
    label: String,
    mask: String,
    modelValue: {
      type: [String, Number],
      default: () => '',
    },
    name: {
      type: String,
      required: true,
      default: '',
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
  setup(props: any, { emit }) {
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
      handleChange,
      handleBlur,
      handleInput,
      errorLabel,
      inputValue,
      meta,
      customClass,
    }
  },
})
</script>
