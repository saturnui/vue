<template>
  <transition name="vuwi-toast">
    <div v-if="modelValue" class="vuwi-toast">
      <div class="flex items-center justify-between">
        <div class="flex justify-center items-center gap-4">
          <div v-if="hasIcon">
            <slot name="icon"></slot>
          </div>
          <div
            class="flex h-full text-left justify-center text-gray-300"
            :class="{ 'border-l border-opacity-20 pl-4': hasIcon }"
          >
            {{ text }}
            <slot name="content"></slot>
          </div>
        </div>
      </div>
      <div v-if="showActionBar" class="pt-4 px-2 flex items-center">
        <div v-if="total" class="text-sm">{{ current }} of {{ total }}</div>
        <div class="flex-grow"></div>
        <div v-if="cancel || confirm" class="flex gap-4">
          <button
            v-if="cancel"
            class="vuwi-btn rounded uppercase text-xs font-bold text-white"
            @click="$emit('click:cancel')"
          >
            {{ cancel }}
          </button>
          <button
            v-if="confirm"
            class="
              vuwi-btn
              rounded
              vuwi-btn-primary
              text-xs
              uppercase
              font-bold
              text-white
            "
            @click="$emit('click:confirm')"
          >
            {{ confirm }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    current: {
      type: [String, Number],
      default: 0,
    },
    total: {
      type: [String, Number],
      default: 0,
    },
    text: {
      type: String,
      default: '',
    },
    confirm: {
      type: String,
      default: '',
    },
    cancel: {
      type: String,
      default: '',
    },
  },
  emits: ['click:confirm', 'click:cancel'],
  setup(props, { slots }) {
    const hasIcon = computed(() => {
      return slots.icon && slots.icon().length > 0
    })
    const showActionBar = computed(() => {
      return props.total || props.confirm || props.cancel
    })
    return {
      hasIcon,
      showActionBar,
    }
  },
})
</script>
