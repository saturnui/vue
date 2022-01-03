<template>
  <div class="flex flex-wrap mt-1.5">
    <div v-for="(month, key) in months" :key="key" class="w-1/2 px-0.5">
      <span class="flex rounded-md mt-1.5">
        <button
          type="button"
          class="wi-text border wi-border px-3 py-2 block w-full leading-6 rounded-md text-xs 2xl:text-sm tracking-wide font-medium transition-colors
          hover:bg-gray-100 focus:bg-blue-50 focus:text-gray-900 focus:border-blue-300 focus:ring focus:ring-blue-500 focus:ring-opacity-10 focus:outline-none uppercase
          dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-gray-100 dark:focus:bg-gray-700"
          @click="$emit('update:month', key)"
          v-text="month"
        ></button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    months: Array,
  },
  emits: ['update:month'],
})
</script>
