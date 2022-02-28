<template>
  <div :class="component">
    <div class="md:col-span-1">
      <div class="p-4 sm:px-0">
        <div name="title">
          <span :class="`${component}-title`">{{ title }}</span>
        </div>
        <div name="desc">
          <span name="desc">{{ desc }}</span>
        </div>
      </div>
    </div>
    <div class="mt-5 md:mt-0 md:col-span-2">
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-6 sm:col-span-4">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'formsection',
    },
    title: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
  },
})
</script>
