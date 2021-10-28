<template>
  <div>
    <div
      v-if="modelValue"
      @click="$emit('update:modelValue', false)"
      class="fixed flex flex-col items-center top-0 left-0 w-screen h-screen bg-black bg-opacity-20 z-10 overflow-y-auto"
    >
      <div @click.stop class="x-dialog x-card rounded-t-none p-0 shadow-xl max-w-xl">
        <div class="x-row border-b justify-between py-2 pl-4 pr-2">
          <div class="font-medium">{{ title }}</div>
          <button class="btn btn-icon" @click="$emit('update:modelValue', false)">
            <tablar-x />
          </button>
        </div>
        <div class="x-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"

export default defineComponent({
  emits: ['update:modelValue', 'submit'],
  props: {
    title: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
