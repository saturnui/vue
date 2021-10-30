<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="
        fixed
        flex flex-col
        items-center
        top-0
        left-0
        w-screen
        h-screen
        bg-black bg-opacity-30
        overflow-y-auto
        z-10
      "
    ></div>
  </transition>

  <transition name="slide-fade">
    <div
      v-if="modelValue"
      class="
        fixed
        top-0
        left-0
        w-screen
        h-screen
        flex
        sm:items-center
        justify-center
        overflow-auto
        z-10
      "
      @click="handleClick"
    >
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue-demi'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const handleClick = () => {
      if (!props.modal) {
        emit('update:modelValue', false)
      }
    }
    watch(
      () => props.modelValue,
      val => {
        if (val) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = 'auto'
        }
      }
    )
    return {
      handleClick,
    }
  },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
