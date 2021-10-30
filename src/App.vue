<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import Switch from './Switch/Switch.vue'
import Textfield from './Textfield/Textfield.vue'
import Snackbar from './Snackbar/Snackbar.vue'
import SnackbarIcon from './app/icons/SnackbarIcon.vue'
const checked = ref(false)
const text = ref('This is a test')
</script>

<template>
  <div class="x-window">
    <div class="x-content p-3">
      <Switch v-model="checked">On / Off</Switch>
      {{ checked }}
      <Textfield v-model="text" name="a"></Textfield>
      <Textfield v-model="text" name="b"></Textfield>
    </div>
  </div>
  <Snackbar
    text="You've been mentionned in a note in Michael Jordan's chart."
    current="1"
    total="3"
    cancel="Dismiss"
    confirm="Ok"
  >
    <template #icon>
      <SnackbarIcon class="h-8 w-8" />
    </template>
  </Snackbar>
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
