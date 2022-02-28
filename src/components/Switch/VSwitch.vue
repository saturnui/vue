<template>
  <!-- https://codepen.io/lhermann/pen/EBGZRZ -->
  <label :for="id" :class="computedClass">
    <slot name="left" />
    <div class="relative">
      <input
        :id="id"
        type="checkbox"
        class="sr-only"
        :checked="modelValue"
        :disabled="disabled"
        @input="handleInput($event)"
      >
      <div class="pill" :class="modelValue ? trueClass : falseClass" />
      <div class="dot" :class="dot" />
    </div>
    <slot />
    <!-- <div class="sa-switch-label">
      <slot></slot>
    </div>-->
  </label>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'switch',
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
    dot: {
      type: String,
      default: 'bg-white',
    },
    falseClass: {
      type: String,
      default: 'bg-base-200',
    },
    trueClass: {
      type: String,
      default: 'bg-neutral',
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
