<template>
  <div :class="`${className}`">
    <img v-if="photo" :src="photo" :alt="name" />
    <div v-else-if="name">
      {{ initial }}
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    className: {
      type: String,
      default: 'wi-avatar',
    },
    photo: {
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
