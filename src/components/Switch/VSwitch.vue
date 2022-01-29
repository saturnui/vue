<template>
  <!-- https://codepen.io/lhermann/pen/EBGZRZ -->
  <label :for="id" :class="computedClass">
    <slot name="left"></slot>
    <div class="relative">
      <input
        :id="id"
        type="checkbox"
        class="sr-only"
        :checked="modelValue"
        :disabled="disabled"
        @input="handleInput($event)"
      />
      <div class="pill"></div>
      <div class="dot"></div>
    </div>
    <slot></slot>
    <!-- <div class="wi-switch-label">
      <slot></slot>
    </div> -->
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'wi-switch',
    },
    id: {
      type: String,
      default: () => Math.floor(Math.random() * Date.now()).toString(),
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const computedClass = computed(() => {
      let c = props.component
      if (props.disabled) c += ' disabled'
      return c
    })
    const handleInput = (evt: Event) => {
      const target = evt.target as HTMLInputElement
      emit('update:modelValue', target.checked)
    }
    return {
      computedClass,
      handleInput,
    }
  },
})
</script>
