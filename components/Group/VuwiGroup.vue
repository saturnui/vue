<template>
  <slot v-bind="{ activeEl, setActive }"></slot>

  <!-- <VuwiGroup v-bind="{active, setActive }" v-model="selectedIndex">
    <button class="{active}" @click="setActive"></button>
    <button class="{active}" @click="setActive"></button>
    <button class="{active}" @click="setActive"></button>
  </VuwiGroup>-->
</template>

<script lang="ts">
export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const activeEl: HTMLElement | undefined = undefined

    const setActive = ($el) => {
      emit('update:modelValue', 1)
    }

    return {
      activeEl,
      setActive,
    }
  },
})
</script>
