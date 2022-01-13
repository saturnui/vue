<template>
  <!-- <div class="wi-text" :class="computedClass"> -->
  <div :class="computedClass">
    <slot name="prepend"></slot>
    <div class="flex-grow" :class="{ label: label || errorLabel }">
      <div class="absolute top-1 pointer-events-none px-3">
        <label
          v-if="errorLabel"
          :for="name"
          class="block font-medium mb-1 text-red-600"
          style="font-size: 11px"
        >{{ label }} {{ errorLabel }}</label>
        <label
          v-else-if="label"
          :for="name"
          class="block font-medium mb-1"
          style="font-size: 11px"
        >{{ label }}</label>
      </div>
      <select
        v-model="value"
        :name="name"
        :required="required"
        :autocomplete="autocomplete"
        :class="{ label: label }"
        @change="handleChange"
        @blur="handleBlur"
      >
        <option v-for="item in options" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </div>
    <slot></slot>
    <div v-if="loading">
      <div class="spinner w-5 h-5" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <tabler-check
      v-else-if="rules && meta.valid && meta.validated"
      class="svg:fill-green-500"
    />
    <span v-else-if="required" class="text-2xl -mb-2">*</span>
  </div>
</template>

<script lang="ts">
import {  computed, defineComponent, watch } from 'vue-demi'
import { useField } from 'vee-validate'
import { useUuid } from '../../composables'

type Option = { label: string; value: string | number }

export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-dropdown',
    },
    name: {
      type: String,
      default: () => useUuid(),
    },
    autocomplete: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    mask: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
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
      value,
      errorMessage,
      handleChange: veeHandleChange,
      handleBlur,
      meta,
    } = useField(props.name, props.rules, {
      initialValue: props.modelValue,
    })
    const computedClass = computed(() => {
      const c = props.className
      // TODO: Move this to .css file
      if (meta.valid || !meta.validated)
        return `${c} focus-within:border-primary`
      // TODO: Move this to .css file
      return `${c} border-red-600 text-red-600`
    })
    const errorLabel = computed(() => {
      return props.error || errorMessage.value
    })
    watch(
      () => props.modelValue,
      (val) => {
        value.value = val
      },
      { immediate: true },
    )
    const handleChange = (evt: Event) => {
      veeHandleChange(evt)
      const target = evt.target as HTMLSelectElement
      emit('update:modelValue', target.value)
    }
    return {
      handleChange,
      handleBlur,
      errorLabel,
      value,
      meta,
      computedClass,
    }
  },
})
</script>
