<template>
  <div :class="className">
    <div class="md:col-span-1">
      <div class="p-4 sm:px-0">
        <div :class="`${className}-title`">
          <span :class="`${className}-title`">{{ title }}</span>
        </div>
        <div :class="`${className}-desc`">
          <span :class="`${className}-desc`">{{ desc }}</span>
        </div>
      </div>
    </div>
    <div class="mt-5 md:mt-0 md:col-span-2">
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-6 sm:col-span-4">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-formsection',
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
