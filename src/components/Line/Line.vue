<template>
  <div class="flex items-center justify-center">
    <div class="border-t flex-grow border-black border-opacity-10 dark:border-opacity-20"></div>
    <span v-if="label" class="px-2 text-sm">{{ label }}</span>
    <div
      v-if="label"
      class="border-t flex-grow border-dark-200 dark:border-dark-800"
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
