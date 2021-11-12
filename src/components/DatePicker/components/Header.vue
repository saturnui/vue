<template>
  <div
    v-if="panel"
    class="flex justify-between items-center px-2 py-1.5 rounded-md border border-black border-opacity-10 dark:border-gray-700 dark:border-opacity-100"
  >
    <div class="flex-shrink-0">
      <span
        v-show="panel.calendar || panel.year"
        class="inline-flex rounded-full"
      >
        <button
          type="button"
          class="p-1.5 rounded-full bg-white text-gray-600 transition-colors border border-transparent hover:bg-gray-100 hover:text-gray-900 focus:bg-blue-50 focus:text-gray-900 focus:border-blue-300 focus:ring focus:ring-blue-500 focus:ring-opacity-10 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-600 dark:focus:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-opacity-25 dark:focus:bg-opacity-50"
          @click="
            panel?.calendar ? calendar?.onPrevious() : calendar?.onPreviousYear()
          "
        >
          <tabler-chevron-left />
        </button>
      </span>
    </div>
    <div v-if="calendar" class="px-1.5 space-x-1.5 flex flex-1">
      <span class="flex-1 flex rounded-md">
        <button
          type="button"
          class="px-3 py-1.5 block w-full leading-relaxed rounded-md bg-white text-xs 2xl:text-sm tracking-wide text-gray-600 font-semibold sm:font-medium transition-colors border border-transparent hover:bg-gray-100 hover:text-gray-900 focus:bg-blue-50 focus:text-gray-900 focus:border-blue-300 focus:ring focus:ring-blue-500 focus:ring-opacity-10 focus:outline-none uppercase dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-600 dark:focus:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-opacity-25 dark:focus:bg-opacity-50"
          @click="calendar?.openMonth()"
          v-text="calendar.month"
        ></button>
      </span>
      <span class="flex-1 flex rounded-md">
        <button
          type="button"
          class="px-3 py-1.5 block w-full leading-relaxed rounded-md bg-white text-xs 2xl:text-sm tracking-wide text-gray-600 font-semibold sm:font-medium transition-colors border border-transparent hover:bg-gray-100 hover:text-gray-900 focus:bg-blue-50 focus:text-gray-900 focus:border-blue-300 focus:ring focus:ring-blue-500 focus:ring-opacity-10 focus:outline-none uppercase dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-600 dark:focus:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-opacity-25 dark:focus:bg-opacity-50"
          @click="calendar?.openYear()"
          v-text="calendar.year"
        ></button>
      </span>
    </div>
    <div v-if="panel" class="flex-shrink-0">
      <span
        v-show="panel.calendar || panel.year"
        class="inline-flex rounded-full"
      >
        <button
          type="button"
          class="p-1.5 rounded-full bg-white text-gray-600 transition-colors border border-transparent hover:bg-gray-100 hover:text-gray-900 focus:bg-blue-50 focus:text-gray-900 focus:border-blue-300 focus:ring focus:ring-blue-500 focus:ring-opacity-10 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:bg-gray-600 dark:focus:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-opacity-25 dark:focus:bg-opacity-50"
          @click="panel?.calendar ? calendar?.onNext() : calendar?.onNextYear()"
        >
          <tabler-chevron-right />
        </button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    asPrevOrNext: Boolean,
    panel: Object,
    calendar: Object,
  },
})
</script>
