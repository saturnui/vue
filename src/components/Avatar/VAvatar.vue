<template>
  <div :class="`${component}`">
    <img v-if="image" :src="image" :alt="name">
    <div v-else-if="name">
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
      default: 'sa-avatar',
    },
    image: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const initial = computed(() => {
      if (props.name)
        return props.name[0]
    })

    return {
      initial,
    }
  },
})
</script>
