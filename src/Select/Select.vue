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
      pr-2
      py-1
    "
    :class="customClass"
  >
    <slot name="prepend"> </slot>
    <div class="flex-grow">
      <div class="absolute top-1 pointer-events-none px-3">
        <label
          v-if="errorLabel"
          :for="name"
          class="block font-medium mb-1 text-red-600 text-sm"
        >
          {{ label }} {{ errorLabel }}
        </label>
        <label
          v-else
          :for="name"
          class="block font-medium mb-1 text-gray-500 text-sm"
        >
          {{ label }}
        </label>
      </div>
      <select
        v-model="value"
        :name="name"
        :required="required"
        :autocomplete="autocomplete"
        class="focus:outline-none w-full pt-4 px-2 text-black"
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
      <div class="spinner w-5 h-5 text-gray-300" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <CheckIcon
      v-else-if="rules && meta.valid"
      class="text-green-500"
    ></CheckIcon>
    <span v-else-if="required" class="text-2xl -mb-2">*</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'
import { useField } from 'vee-validate'
import CheckIcon from '../Textfield/icons/CheckIcon.vue'

type Option = { label: string; value: string | number }

export default defineComponent({
  components: { CheckIcon },
  props: {
    name: {
      type: String,
      required: true,
      default: '',
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
    loading: Boolean,
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
  setup(props) {
    const { value, errorMessage, handleBlur, handleChange, meta } = useField(
      props.name,
      props.rules,
      {
        initialValue: props.modelValue,
      }
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
    // const handleChange = (evt: Event) => {
    //   const target = evt.target as HTMLSelectElement
    //   emit('update:modelValue', target.value)
    // }
    return {
      handleChange,
      handleBlur,
      errorLabel,
      value,
      meta,
      customClass,
    }
  },
})
</script>
