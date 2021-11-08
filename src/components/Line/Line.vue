<template>
  <div class="flex items-center justify-center">
    <div class="border-t flex-grow border-gray-200 dark:border-dark-800"></div>
    <div v-if="label" class="px-2 text-sm">{{ label }}</div>
    <div
      v-if="label"
      class="border-t flex-grow border-gray-200 dark:border-dark-800"
    ></div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    label: {
      type: String,
      default: '',
    },
  },
})
</script>
