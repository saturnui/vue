<script setup lang="ts">
import { default as XSwitch } from './components/switch/Switch.vue'
</script>

<template>
  <XSwitch>
    <span class="pl-2">Toggle me</span>
  </XSwitch>
  <div class="x-window">Hello</div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
