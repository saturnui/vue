<script>
import Switch from './components/Switch/Switch.vue'
export default {
  components: { Switch },
  setup() {},
}
</script>

<template>
  <Switch>
    <span class="pl-2">Toggle me</span>
  </Switch>
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
