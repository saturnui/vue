import { computed, watch } from 'vue'
import { useField } from 'vee-validate'

export default {
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
  setup(props: any) {
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
