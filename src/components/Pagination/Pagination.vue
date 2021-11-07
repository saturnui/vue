<script lang="ts">
import { computed, defineComponent } from 'vue-demi'
import ChevronIcon from './icons/ChevronIcon.vue'
export default defineComponent({
  components: { ChevronIcon },
  props: {
    visible: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    length: {
      type: Number,
      default: 0,
    },
    more: {
      type: String,
      default: '...',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const MINIMAL_PAGE_ITEM_COUNT = 7
    /**
     * Generate numeric page items around current page.
     *   - Always include first and last page
     *   - Add ellipsis if needed
     */
    function generatePageItems(total: number, current: number, width: number) {
      if (width < MINIMAL_PAGE_ITEM_COUNT) {
        throw new Error(
          `Must allow at least ${MINIMAL_PAGE_ITEM_COUNT} page items`
        )
      }
      if (width % 2 === 0) {
        throw new Error(`Must allow odd number of page items`)
      }
      if (total < width) {
        return [...new Array(total).keys()]
      }
      const left = Math.max(
        0,
        Math.min(total - width, current - Math.floor(width / 2))
      )
      const items = new Array(width)
      for (let i = 0; i < width; i += 1) {
        items[i] = i + left
      }
      // replace non-ending items with placeholders
      if (items[0] > 0) {
        items[0] = 0
        items[1] = props.more // prev-more
      }
      if (items[items.length - 1] < total - 1) {
        items[items.length - 1] = total - 1
        items[items.length - 2] = props.more //next-more
      }
      return items
    }
    const values = computed(() => {
      return generatePageItems(props.length, props.modelValue, props.visible)
    })
    const prev = () => {
      if (props.modelValue) {
        emit('update:modelValue', props.modelValue - 1)
      }
    }
    const next = () => {
      if (props.modelValue < props.length - 1) {
        emit('update:modelValue', props.modelValue + 1)
      }
    }
    const value = (val: number) => emit('update:modelValue', val)
    return {
      values,
      next,
      prev,
      value,
    }
    // length / visible
    // range := ceil(15/7) = 3
    // if modelValue < range
    // [1],2,3,...,13,14,15
    // 1,2,[3],4,5,..,15
    // 1,...,4,[5],6,..,15
    // 1,...,11,[12],13,14,15
  },
})
</script>

<template>
  <nav
    class="vuwi-pagination vuwi-pagination-sm"
    role="navigation"
    aria-label="pagination"
  >
    <button
      class="vuwi-pagination-nav-link left"
      aria-label="Goto previous page"
      @click="prev"
    >
      <ChevronIcon class="icon"></ChevronIcon>
    </button>
    <span v-for="(i, index) in values" :key="index">
      <button v-if="i === '...'" disabled class="vuwi-pagination-link">
        {{ i }}
      </button>
      <button
        v-else
        class="vuwi-pagination-link w-10"
        :class="{ 'vuwi-pagination-link-active': i === modelValue }"
        @click="value(i)"
      >
        {{ i + 1 }}
      </button>
    </span>
    <button class="vuwi-pagination-nav-link right" @click="next">
      <ChevronIcon class="icon"></ChevronIcon>
    </button>
  </nav>
</template>
