<template>
  <!-- https://codepen.io/lhermann/pen/EBGZRZ -->
  <label :for="id" class="vuwi-switch" :class="{ disabled: disabled }">
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
    <div class="vuwi-switch-label">
      <slot></slot>
    </div>
  </label>
</template>

<script lang="ts">
export default defineComponent({
  props: {
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
    const handleInput = (evt: Event) => {
      const target = evt.target as HTMLInputElement
      emit('update:modelValue', target.checked)
    }
    return {
      handleInput,
    }
  },
})
</script>
