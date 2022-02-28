<template>
  <div :class="`${component}`">
    <img v-if="src" :src="src" :alt="placeholder">
    <div v-else-if="placeholder">
      {{ initial }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    component: {
      type: String,
      default: 'avatar',
    },
    src: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const initial = computed(() => {
      if (props.placeholder)
        return props.placeholder[0]
    })

    return {
      initial,
    }
  },
})
</script>
