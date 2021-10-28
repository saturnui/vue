<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import Switch from './Switch/Switch.vue'
import Textfield from './Textfield/Textfield.vue';
const checked = ref(false)
const text = ref('hi')
</script>

<template>
  <div class="x-window">
    <div class="x-content p-3">
      <Switch v-model="checked">On / Off</Switch>
      {{ checked }}
      <Textfield name="a" v-model="text"></Textfield>
      <Textfield name="b" v-model="text"></Textfield>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 20px;
}
</style>
