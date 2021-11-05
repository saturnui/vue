<template>
  <VuwiLine v-if="line"></VuwiLine>

  <div class="md:grid lg:grid-cols-3 md:gap-6">
    <div class="md:col-span-1">
      <div class="px-4 sm:px-0">
        <h3 class="text-lg font-medium leading-6 text-gray-900">{{ title }}</h3>
        <p class="mt-1 text-gray-600">{{ desc }}</p>
      </div>
    </div>
    <div class="mt-5 md:mt-0 md:col-span-2">
      <div class="shadow sm:rounded-md sm:overflow-hidden">
        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-6 sm:col-span-4">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import VuwiLine from '../Line/Line.vue'

export default defineComponent({
  components: { VuwiLine },
  props: {
    line: {
      type: Boolean,
      default: true,
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
