<template>
  <div class="vuwi-avatar">
    <img v-if="photo" :src="photo" :alt="name" />
    <div
      v-else-if="name"
      class="w-full h-full flex justify-center items-center"
    >
      {{ initial }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'

export default defineComponent({
  props: {
    photo: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'md',
    },
  },
  setup(props) {
    const initial = computed(() => {
      if (props.name) {
        return props.name[0]
      }
    })

    return {
      initial,
    }
  },
})
</script>
