<template>
  <div
    v-if="asRange && !asSingle"
    class="relative w-full border-t border-b-0 sm:border-t-0 sm:border-b lg:border-b-0 lg:border-r border-black border-opacity-10 order-last sm:order-none dark:border-gray-700 dark:border-opacity-100 sm:mt-1 lg:mr-1 sm:mb-1 lg:mb-0 sm:mx-1 lg:mx-0"
  >
    <ol
      v-if="withShortcut()"
      class="grid grid-cols-2 sm:grid-cols-3 gap-1 lg:block w-full pr-0 sm:pr-1 mt-1.5 sm:mt-0 sm:mb-1.5 lg:mb-0"
    >
      <li v-for="(item, i) in withShortcut()" :key="i">
        <a
          href="#"
          class="vuwi-shortcuts block text-sm lg:text-xs px-2 py-2 sm:leading-4 whitespace-nowrap font-medium rounded text-blue-600 hover:text-blue-700 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300 dark:text-blue-400 dark:focus:bg-gray-700 dark:focus:text-blue-300"
          @click.prevent="setToCustomShortcut(item)"
          v-text="item.label"
        >
        </a>
      </li>
    </ol>
    <ol
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 gap-1 lg:block w-full pr-0 sm:pr-1 mt-1.5 sm:mt-0 sm:mb-1.5 lg:mb-0"
    >
      <li>
        <a
          href="#"
          class="vuwi-shortcuts block text-sm lg:text-xs px-2 py-2 sm:leading-4 whitespace-nowrap font-medium rounded text-blue-600 hover:text-blue-700 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300 dark:text-blue-400 dark:focus:bg-gray-700 dark:focus:text-blue-300"
          @click.prevent="setToToday"
        >
          {{ i18n?.today }}
        </a>
      </li>
      <li>
        <a
          href="#"
          class="vuwi-shortcuts block text-sm lg:text-xs px-2 py-2 sm:leading-4 whitespace-nowrap font-medium rounded text-blue-600 hover:text-blue-700 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300 dark:text-blue-400 dark:focus:bg-gray-700 dark:focus:text-blue-300"
          @click.prevent="setToYesterday"
        >
          {{ i18n?.yesterday }}
        </a>
      </li>
      <li>
        <a
          href="#"
          class="vuwi-shortcuts block text-sm lg:text-xs px-2 py-2 sm:leading-4 whitespace-nowrap font-medium rounded text-blue-600 hover:text-blue-700 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300 dark:text-blue-400 dark:focus:bg-gray-700 dark:focus:text-blue-300"
          @click.prevent="setToLastDay(7)"
        >
          {{ i18n?.past(7) }}
        </a>
      </li>
      <li>
        <a
          href="#"
          class="vuwi-shortcuts block text-sm lg:text-xs px-2 py-2 sm:leading-4 whitespace-nowrap font-medium rounded text-blue-600 hover:text-blue-700 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300 dark:text-blue-400 dark:focus:bg-gray-700 dark:focus:text-blue-300"
          @click.prevent="setToLastDay(30)"
        >
          {{ i18n?.past(30) }}
        </a>
      </li>
      <li>
        <a
          href="#"
          class="vuwi-shortcuts block text-sm lg:text-xs px-2 py-2 sm:leading-4 whitespace-nowrap font-medium rounded text-blue-600 hover:text-blue-700 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300 dark:text-blue-400 dark:focus:bg-gray-700 dark:focus:text-blue-300"
          @click.prevent="setToThisMonth"
        >
          {{ i18n?.currentMonth }}
        </a>
      </li>
      <li>
        <a
          href="#"
          class="vuwi-shortcuts block text-sm lg:text-xs px-2 py-2 sm:leading-4 whitespace-nowrap font-medium rounded text-blue-600 hover:text-blue-700 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-300 dark:text-blue-400 dark:focus:bg-gray-700 dark:focus:text-blue-300"
          @click.prevent="setToLastMonth"
        >
          {{ i18n?.pastMonth }}
        </a>
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  props: {
    shortcuts: [Boolean, Function],
    asRange: Boolean,
    asSingle: Boolean,
    i18n: Object,
  },
  setup(props) {
    const setToToday: any = inject('setToToday')
    const setToYesterday: any = inject('setToYesterday')
    const setToLastDay: any = inject('setToLastDay')
    const setToThisMonth: any = inject('setToThisMonth')
    const setToLastMonth: any = inject('setToLastMonth')
    const setToCustomShortcut: any = inject('setToCustomShortcut')
    const withShortcut = () => {
      if (typeof props.shortcuts === 'function')
        return props.shortcuts()

      else
        return false
    }

    return {
      setToToday,
      setToYesterday,
      setToLastDay,
      setToThisMonth,
      setToLastMonth,
      setToCustomShortcut,
      withShortcut,
    }
  },
})
</script>
