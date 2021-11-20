<template>
  <div>
    <transition name="vuwi-fade">
      <div v-if="modelValue" class="vuwi-overlay"></div>
    </transition>

    <transition :name="transitionName">
      <div v-if="modelValue" ref="content" :class="positionClass">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ref, nextTick } from 'vue-demi'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: 'center',
    },
    modal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const content = ref()
    let off: any

    const transitionName = computed(() => {
      return `vuwi-${props.position}`
    })

    const positionClass = computed(() => {
      return `vuwi-overlay-${props.position}`
    })

    watch(
      () => props.modelValue,
      (val: Boolean) => {
        if (val) {
          document.body.style.overflow = 'hidden'
          nextTick(() => {
            off = onClickOutside(content.value, () => {
              if (!props.modal) emit('update:modelValue', false)
            })
          })
        }
        else {
          if (off) off()
          document.body.style.overflow = 'auto'
        }
      },
    )

    onMounted(() => {
      onClickOutside(content.value, () => {
        if (!props.modal) emit('update:modelValue', false)
      })
    })

    onBeforeUnmount(() => {
      if (off) off()
    })

    return {
      content,
      positionClass,
      transitionName,
    }
  },
})
</script>
