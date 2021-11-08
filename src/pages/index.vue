<script lang="ts" setup>
import { isDark } from '~/composables'

const showWindow = ref(false)
const showToast = ref(false)
const showDrawer = ref(false)
const text = ref('This is a test')
const photo
  = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
const selectedValue = ref('yes')
const selectOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Maybe', value: 'maybe' },
]
const overlayOptions = [
  { label: 'Center', value: 'center' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Bottom', value: 'bottom' },
]
const overlayPosition = ref('center')
const dialogClass = computed(() => {
  switch (overlayPosition.value) {
    case 'bottom':
      return 'w-full'
    case 'left':
    case 'right':
      return 'w-96 h-full'
    default:
      return 'vuwi-dialog w-full max-w-xl'
  }
})

const expA = ref(true)
const expB = ref(false)
const expC = ref(false)
const currentPage = ref(1)
const code = ref('123456')

const tooltipOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Bottom', value: 'bottom' },
]
const tooltipPlacement = ref('right')
</script>

<template>
  <div class="flex p-4">
    <button class="vuwi-btn md:hidden" @click="showDrawer = !showDrawer">
      <tabler-menu-2 />
    </button>
    <div class="flex-grow"></div>
    <Switch v-model="isDark">
      <span class="ml-2">Dark</span>
    </Switch>
  </div>
  <div class="p-4">
    <div class="vuwi-card flex gap-4 p-4 overflow-x-auto">
      <span>Test</span>
    </div>
  </div>
  <div class="vuwi-window mx-4">
    <Line />
    <div class="vuwi-content p-3 space-y-4">
      <button>Hello, world!</button>

      <div class="vuwi-row">
        <CodeInput v-model="code" />
        {{ code }}
      </div>

      <Pagination v-model="currentPage" :visible="7" :length="20" />

      <div class="vuwi-card flex items-center gap-4 p-4 rounded-lg">
        <div class="font-bold">
          <span>Tooltip:</span>
        </div>
        <Tooltip :placement="tooltipPlacement">
          <template #tooltip>
            <div class="px-4 py-3 flex gap-4 items-center">
              <Avatar
                name="Alex Lifeson"
                :photo="photo"
                class="vuwi-avatar-sm rounded-full overflow-hidden"
              />
              Hello, world!
            </div>
          </template>
          <Avatar
            name="Alex Lifeson"
            :photo="photo"
            class="vuwi-avatar-sm rounded-full overflow-hidden"
          />
        </Tooltip>
        <Dropdown
          v-model="tooltipPlacement"
          :options="tooltipOptions"
        ></Dropdown>
      </div>

      <div class="vuwi-card rounded-lg flex gap-4 p-4 overflow-x-auto">
        <div
          class="
            vuwi-spinner
            w-8
            h-8
            min-w-8 min-h-8
            border-4 border-purple-600 border-r-transparent
          "
          role="status"
        >
          <span class="sr-only">Loading...</span>
        </div>
        <Avatar
          name="Alex Lifeson"
          :photo="photo"
          class="vuwi-avatar-sm rounded-full overflow-hidden"
        />
        <Avatar name="Rob Taylor" :photo="photo" />
        <Avatar
          name="Bryan Adams"
          :photo="photo"
          class="vuwi-avatar-lg rounded-full overflow-hidden"
        />
        <Avatar name="Rob Taylor" :photo="photo" class="vuwi-avatar-xl" />
        <Avatar name="Geddy Lee" class="vuwi-avatar-sm bg-primary text-white" />
        <Avatar name="Steve Vai" class="rounded-full bg-primary text-white" />
        <Avatar
          name="Neil Peart"
          class="vuwi-avatar-lg bg-primary text-white"
        />
        <Avatar
          name="Eddie Van Halen"
          class="vuwi-avatar-xl rounded-full bg-primary text-white"
        />
      </div>

      <div>
        <Collapse v-for="i in 3" :key="i">
          <template #header>
            <div class="text-lg font-bold">
              <span>Collapse title</span>
            </div>
          </template>
          <div class="vuwi-collapse-content p-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </Collapse>

        <div class="h-5"></div>
        <div class="bg-white" :class="{ 'm-4 shadow-lg': expA }">
          <Collapse v-model="expA" group="a">
            <template #header>
              <div class="flex items-center gap-4 text-lg font-bold">
                <tabler-message />
                <span>Accordion title</span>
              </div>
            </template>
            <div class="vuwi-card p-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </Collapse>
        </div>
        <div class="bg-white" :class="{ 'm-4 shadow-lg': expB }">
          <Collapse v-model="expB" group="a">
            <template #header>
              <div class="flex items-center gap-4 text-lg font-bold">
                <!-- <ToastIcon class="w-6 h-6" /> -->
                ToastIcon
                <span>Accordion title</span>
              </div>
            </template>
            <div class="vuwi-card p-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </Collapse>
        </div>
        <div class="bg-white" :class="{ 'm-4 shadow-lg': expC }">
          <Collapse v-model="expC" group="a">
            <template #header>
              <div class="flex items-center gap-4 text-lg font-bold">
                <!-- <ToastIcon class="w-6 h-6" /> -->
                ToastIcon
                <span>Accordion title</span>
              </div>
            </template>
            <div class="vuwi-card p-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </Collapse>
        </div>
      </div>

      <div class="vuwi-card shadow flex gap-4 p-4 filter">
        <div class="w-32">
          <Dropdown
            v-model="overlayPosition"
            :options="overlayOptions"
          ></Dropdown>
        </div>
        <Switch v-model="showWindow">
          <span class="ml-2">Show Overlay</span>
        </Switch>
        <Switch v-model="showToast">
          <span class="ml-2">Show Toast</span>
        </Switch>
      </div>
      <div class="pt-4 pl-2 text-lg font-bold">
        <span>Form Inputs</span>
      </div>
      <Textfield
        v-model="text"
        label="First name"
        required
        valid
        loading
        error="is required"
      ></Textfield>
      <Textfield v-model="text" label="Last name" required loading></Textfield>
      <Textarea
        v-model="text"
        label="Description"
        required
        valid
        loading
        error="is required"
      ></Textarea>
      <Dropdown
        v-model="selectedValue"
        name="agree"
        label="Do you agree?"
        :options="selectOptions"
        class="w-60"
      />
      <Switch v-model="showWindow">
        <span class="ml-2">Show Overlay</span>
      </Switch>
    </div>
    <div class="vuwi-card p-4 mt-4">
      <FormSection
        v-for="i in 3"
        :key="i"
        title="Profile"
        desc="Public profile available for all to see."
        :line="i !== 1"
      >
        <div class="space-y-4">
          <Textfield v-model="text" label="Name" required></Textfield>
          <Textfield v-model="text" label="Email"></Textfield>
        </div>
      </FormSection>
    </div>
  </div>

  <Overlay
    v-model="showDrawer"
    class="md:hidden"
    @click="showDrawer = false"
  ></Overlay>
  <Drawer v-model="showDrawer" class="overflow-y-auto overflow-x-hidden">
    <Collapse v-for="i in 3" :key="i" theme="vuwi-menu">
      <template #header>
        <div class="flex gap-4">
          <tabler-box />
          <span>Section {{ i }}</span>
        </div>
      </template>
      <div class="overflow-y-auto">
        <div v-for="n in 8" :key="n" class="vuwi-menu-item">
          Menu Item {{ n }}
        </div>
      </div>
    </Collapse>
  </Drawer>

  <Overlay v-model="showWindow" :position="overlayPosition">
    <Dialog
      v-model="showWindow"
      title="Hello, world!!!"
      class="vuwi-card"
      :class="dialogClass"
      :modal="false"
    >
      <div class="p-4 text-left">
        <span>This is a test.</span>
      </div>
      <div class="vuwi-row justify-end p-2">
        <button
          class="vuwi-btn vuwi-btn-primary px-6 py-2 text-lg"
          @click="showWindow = false"
        >
          Submit
        </button>
      </div>
    </Dialog>
  </Overlay>

  <Toast
    v-model="showToast"
    text="You've been mentionned in a note in Michael Jordan's chart."
    current="1"
    total="3"
    cancel="Dismiss"
    confirm="Ok"
    @click:cancel="showToast = false"
    @click:confirm="showToast = false"
  >
    <template #icon>
      ToastIcon
    </template>
  </Toast>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fefefe;
}
</style>
