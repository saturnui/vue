<script lang="ts">
import { defineComponent } from 'vue-demi'

export default defineComponent({})
</script>

<template>
  <div class="flex space-x-4">
    <div class="rounded-full wi-highlight-stronger h-10 w-10" />
    <div class="flex-1 space-y-6 py-1">
      <div class="h-2 wi-highlight-stronger rounded" />
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-2 wi-highlight-stronger rounded col-span-2" />
          <div class="h-2 wi-highlight-stronger rounded col-span-1" />
        </div>
        <div class="h-2 wi-highlight-stronger rounded" />
      </div>
    </div>
  </div>
</template>
