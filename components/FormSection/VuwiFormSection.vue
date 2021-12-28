<template>
  <div :class="`${theme}-form-section`">
    <div class="md:col-span-1">
      <div class="px-4 sm:px-0">
        <div class="form-section-title">
          <span class="form-section-title">{{ title }}</span>
        </div>
        <div class="form-section-desc">
          <span class="form-section-desc">{{ desc }}</span>
        </div>
      </div>
    </div>
    <div class="mt-5 md:mt-0 md:col-span-2">
      <div class="vuwi-card">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-6 sm:col-span-4">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi',
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
