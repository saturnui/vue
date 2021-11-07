<template>
  <VuwiLine v-if="line" class="py-4"></VuwiLine>

  <div class="vuwi-form-section md:grid lg:grid-cols-3 md:gap-6">
    <div class="md:col-span-1">
      <div class="px-4 sm:px-0">
        <h3 class="vuwi-form-section-title">{{ title }}</h3>
        <p class="vuwi-form-section-desc">{{ desc }}</p>
      </div>
    </div>
    <div class="mt-5 md:mt-0 md:col-span-2">
      <div class="shadow sm:rounded-md sm:overflow-hidden">
        <div class="vuwi-form-section-card-content">
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
