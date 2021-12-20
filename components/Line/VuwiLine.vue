<template>
  <div class="flex items-center justify-center">
    <div :class="`${theme}-line`"></div>
    <span v-if="label" class="px-2">{{ label }}</span>
    <div v-if="label" :class="`${theme}-line`"></div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi',
    },
    label: {
      type: String,
      default: '',
    },
  },
})
</script>
