<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="
          inline-flex
          justify-center
          w-full
          rounded-md
          px-4
          py-2
          bg-white
          text-sm
          font-medium
          text-gray-700
          hover:bg-gray-50
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-offset-gray-100
          focus:ring-indigo-500
        "
      >
        <more-icon></more-icon>
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <menu-items
        class="
          origin-top-right
          absolute
          right-0
          mt-2
          w-44
          rounded-md
          shadow-lg
          bg-white
          ring-1 ring-black ring-opacity-5
          divide-y divide-gray-100
          focus:outline-none
          cursor-pointer
          z-10
        "
      >
        <div v-for="(section, i) in options" :key="i" class="py-1">
          <menu-item v-for="(item, n) in section" :key="n" v-slot="{ active }">
            <div
              :class="[
                active ? item.activeClass || 'text-blue-500' : '',
                'block   px-4 py-2 text-c  enter text-gray  -500',
              ]"
              @click="$emit('click:item', item)"
            >
              {{ item.label }}
            </div>
          </menu-item>
        </div>
      </menu-items>
    </transition>
  </Menu>
</template>

<script lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

type Option = { label: string; value: unknown }

export default defineComponent({
  components: { Menu, MenuButton, MenuItems, MenuItem },
  props: {
    options: {
      type: null,
      default: (): Option[] => [],
    },
  },
  emits: ['click:item'],
})
</script>
