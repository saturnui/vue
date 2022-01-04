<template>
  <div
    class="grid grid-cols-7 py-2 mt-0.5 border-b border-black border-opacity-10 dark:border-gray-700 dark:border-opacity-100"
  >
    <div
      v-for="(day, keyDay) in weeks"
      :key="keyDay"
      class="text-gray-500 text-xs 2xl:text-sm tracking-wide font-medium text-center cursor-default dark:text-gray-400"
    >
      <span v-text="day"> </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    weeks: Array,
  },
})
</script>
