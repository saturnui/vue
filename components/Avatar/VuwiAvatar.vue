<template>
  <div :class="`${theme}-avatar`">
    <img v-if="photo" :src="photo" :alt="name" />
    <div v-else-if="name">
      {{ initial }}
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    theme: {
      type: String,
      default: 'vuwi',
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
