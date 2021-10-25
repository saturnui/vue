<template>
  <!-- https://codepen.io/lhermann/pen/EBGZRZ -->
  <label :for="id" class="flex items-center cursor-pointer">
    <slot name="left"></slot>
    <div class="relative">
      <input
        :id="id"
        type="checkbox"
        class="sr-only"
        :checked="modelValue"
        @input="$emit('update:modelValue', $event.target.checked)"
      />
      <div class="block bg-gray-400 w-10 h-6 rounded-full"></div>
      <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
    </div>
    <slot></slot>
  </label>
</template>

<style scoped>
input:checked ~ .dot {
  transform: translateX(100%);
}
input:checked ~ .block {
  /* transition: background-color 0.5s ease; */
  background-color: #48bb78;
}
</style>

<script src="./Switch.js"></script>