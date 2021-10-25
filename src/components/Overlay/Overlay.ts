import { watch } from '@vue/runtime-core'
export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: Boolean,
  },
  setup(props: any) {
    watch(
      () => props.modelValue,
      val => {
        if (val) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = 'auto'
        }
      }
    )
  },
}
