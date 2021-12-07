<template>
  <transition name="vuwi-toast">
    <div v-if="modelValue" class="vuwi-toast">
      <slot />
      <slot name="action" />
    </div>
  </transition>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
