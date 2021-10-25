<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30"></div>
  </transition>

  <transition name="slide-fade">
    <div
      v-if="modelValue"
      class="fixed top-0 left-0 w-screen h-screen flex sm:items-center justify-center overflow-auto"
    >
      <!-- 
      @click="$emit('update:modelValue', false)"
     -->
      <div @click.stop>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
 
<style>
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

<script src="./Overlay.js"></script>
