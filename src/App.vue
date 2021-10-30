<script lang="ts" setup>
import { ref } from 'vue-demi'
import Switch from './Switch/Switch.vue'
import Textfield from './Textfield/Textfield.vue'
import Snackbar from './Snackbar/Snackbar.vue'
import SnackbarIcon from './app/icons/SnackbarIcon.vue'
import Textarea from './Textarea/Textarea.vue'
import Overlay from './Overlay/Overlay.vue'
import Dialog from './Dialog/Dialog.vue'
const checked = ref(false)
const text = ref('This is a test')
</script>

<template>
  <div class="vuwi-window">
    <div class="vuwi-content p-3 space-y-2">
      <Switch v-model="checked">
        <span class="ml-2">On / Off</span>
      </Switch>
      <Textfield
        v-model="text"
        label="First name"
        required
        valid
        loading
        error="is required"
      ></Textfield>
      <Textarea
        v-model="text"
        label="Description"
        required
        valid
        loading
        error="is required"
      ></Textarea>
    </div>
  </div>

  <Overlay v-model="checked" modal>
    <Dialog v-model="checked" title="Hello, world!" class="bg-white">
      <div class="p-4 text-left">This is a test.</div>
      <div class="vuwi-row justify-end p-2">
        <button class="btn btn-primary" @click="checked = false">Submit</button>
      </div>
    </Dialog>
  </Overlay>

  <Snackbar
    v-model="checked"
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
  color: #2c3e50;
  padding: 20px;
}
</style>
