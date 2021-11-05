<template>
  <transition name="vuwi-fade">
    <div v-if="modelValue" class="vuwi-overlay"></div>
  </transition>

  <transition :name="transitionName">
    <div v-if="modelValue" :class="positionClass">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue-demi'

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
  },
  emits: ['update:modelValue'],
  setup(props) {
    const transitionName = computed(() => {
      return `vuwi-${props.position}`
    })

    const positionClass = computed(() => {
      return `vuwi-overlay-${props.position}`
    })

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
    return {
      positionClass,
      transitionName,
    }
  },
})
</script>
