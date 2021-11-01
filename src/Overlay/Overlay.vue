<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="
        fixed
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

  <transition :name="transitionName">
    <div v-if="modelValue" :class="computedContentClass">
      <slot></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue-demi'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: 'center',
    },
    contentClass: {
      type: String,
      default: '',
    }
  },
  emits: ['update:modelValue'],
  setup(props) {
    const transitionName = computed(() => {
      switch (props.position) {
        case 'left':
          return 'slide-left'
        case 'right':
          return 'slide-right'
        case 'bottom':
          return 'slide-bottom'
        default:
          return 'slide-fade'
      }
    })

    const computedContentClass = computed(() => {
      let returnClass = props.contentClass
      switch (props.position) {
        case 'left':
          return `${returnClass} fixed top-0 left-0 h-full z-10`
        case 'right':
          return `${returnClass} fixed top-0 right-0 h-full z-10`
        case 'bottom':
          return `${returnClass} fixed bottom-0 left-0 w-full z-10`
        default:
          return `${returnClass} fixed top-0 left-0 w-screen h-screen flex sm:items-center justify-center overflow-auto z-10`
      }
    })

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
      computedContentClass,
      transitionName,
    }
  },
})
</script>

<style scoped>
/* Overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Center */
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

/* Slide Left */
.slide-left-enter-active {
  transition: all 0.2s ease-out;
}

.slide-left-leave-active {
  transition: all 0.2s ease-in;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

/* Slide Right */
.slide-right-enter-active {
  transition: all 0.2s ease-out;
}

.slide-right-leave-active {
  transition: all 0.2s ease-in;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* Slide Bottom */
.slide-bottom-enter-active {
  transition: all 0.2s ease-out;
}

.slide-bottom-leave-active {
  transition: all 0.2s ease-in;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
