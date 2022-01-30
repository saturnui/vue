<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'wi-dropdown',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const root = ref()
    const toggle = () => {
      emit('update:modelValue', !props.modelValue)
    }

    onMounted(() => {
      if (root.value) {
        onClickOutside(root.value, () => {
          emit('update:modelValue', false)
        })
      }
    })
    return {
      root,
      toggle,
    }
  },
})
</script>

<template>
  <div ref="root" :class="component">
    <slot name="activator" v-bind="{ toggle }" />
    <transition :name="component">
      <div v-if="modelValue">
        <slot />
      </div>
    </transition>
  </div>
</template>
