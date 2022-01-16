<template>
  <div :class="className">
    <div :class="`${className}-titlebar`">
      <slot name="title" />
      <div class="flex-grow"></div>
      <VButton class="wi-btn-icon" @click="$emit('close')">
        <tabler-x :class="`${className}-close-icon`" />
      </VButton>
    </div>
    <slot />
    <div :class="`${className}-actions`">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts">
import VButton from '../Button/VButton.vue'
import {  defineComponent } from 'vue-demi'

export default defineComponent({
    props: {
        className: {
            type: String,
            default: "wi-dialog",
        },
    },
    emits: ["close"],
    components: { VButton }
})
</script>
