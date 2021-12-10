<template>
  <transition :name="`${theme}-toast`">
    <div v-if="modelValue" :class="`${theme}-toast`">
      <slot />
      <slot name="action" />
    </div>
  </transition>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
