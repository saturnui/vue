<script lang="ts" setup>
import { computed, ref } from 'vue-demi'
import Avatar from '../components/Avatar/Avatar.vue'
import Switch from '../components/Switch/Switch.vue'
import Textfield from '../components/Textfield/Textfield.vue'
import Toast from '../components/Toast/Toast.vue'
import Textarea from '../components/Textarea/Textarea.vue'
import Overlay from '../components/Overlay/Overlay.vue'
import Dialog from '../components/Dialog/Dialog.vue'
import FormSection from '../components/FormSection/FormSection.vue'
import Collapse from '../components/Collapse/Collapse.vue'
import Drawer from '../components/Drawer/Drawer.vue'
import ToastIcon from './icons/ToastIcon.vue'
import Button from './button/Button.vue'
import MenuIcon from './icons/MenuIcon.vue'
import Line from '../components/Line/Line.vue'
import Dropdown from '../components/Dropdown/Dropdown.vue'
import CodeInput from '../components/CodeInput/CodeInput.vue'
import Pagination from '../components/Pagination/Pagination.vue'
import Tooltip from '../components/Tooltip/Tooltip.vue'

const darkMode = ref(true)
const showWindow = ref(false)
const showToast = ref(false)
const showDrawer = ref(false)
const text = ref('This is a test')
const photo =
  'data:image/png;base64,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'
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
  <div :class="{ dark: darkMode }">
    <div class="vuwi-main">
      <div class="vuwi-container navbar responsive">
        <div class="flex p-4">
          <button class="vuwi-btn md:hidden" @click="showDrawer = !showDrawer">
            <MenuIcon />
          </button>
          <div class="flex-grow"></div>
          <Switch v-model="darkMode">
            <span class="ml-2">Dark</span>
          </Switch>
        </div>
        <div class="p-4">
          <div class="vuwi-card flex gap-4 p-4 overflow-x-auto">Test</div>
        </div>
        <div class="vuwi-window mx-4">
          <Line />
          <div class="vuwi-content p-3 space-y-4">
            <Button>Hello, world!</Button>

            <div class="vuwi-row">
              <CodeInput v-model="code" />
              {{ code }}
            </div>

            <Pagination v-model="currentPage" :visible="7" :length="20" />

            <div class="vuwi-card flex items-center gap-4 p-4 rounded-lg">
              <div class="font-bold">Tooltip:</div>
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
              <Avatar
                name="Geddy Lee"
                class="vuwi-avatar-sm bg-primary text-white"
              />
              <Avatar
                name="Steve Vai"
                class="rounded-full bg-primary text-white"
              />
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
                  <div class="text-lg font-bold">Collapse title</div>
                </template>
                <div class="vuwi-collapse-content">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </div>
              </Collapse>

              <div class="h-5"></div>
              <div class="bg-white" :class="{ 'm-4 shadow-lg': expA }">
                <Collapse v-model="expA" group="a">
                  <template #header>
                    <div class="flex items-center gap-4 text-lg font-bold">
                      <ToastIcon class="w-6 h-6" />
                      <span>Accordion title</span>
                    </div>
                  </template>
                  <div class="vuwi-card p-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </div>
                </Collapse>
              </div>
              <div class="bg-white" :class="{ 'm-4 shadow-lg': expB }">
                <Collapse v-model="expB" group="a">
                  <template #header>
                    <div class="flex items-center gap-4 text-lg font-bold">
                      <ToastIcon class="w-6 h-6" />
                      <span>Accordion title</span>
                    </div>
                  </template>
                  <div class="vuwi-card p-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </div>
                </Collapse>
              </div>
              <div class="bg-white" :class="{ 'm-4 shadow-lg': expC }">
                <Collapse v-model="expC" group="a">
                  <template #header>
                    <div class="flex items-center gap-4 text-lg font-bold">
                      <ToastIcon class="w-6 h-6" />
                      <span>Accordion title</span>
                    </div>
                  </template>
                  <div class="vuwi-card p-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
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
            <div class="pt-4 pl-2 text-lg font-bold">Form Inputs</div>
            <Textfield
              v-model="text"
              label="First name"
              required
              valid
              loading
              error="is required"
            ></Textfield>
            <Textfield
              v-model="text"
              label="Last name"
              required
              loading
            ></Textfield>
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
      </div>

      <Overlay
        v-model="showDrawer"
        class="md:hidden"
        @click="showDrawer = false"
      ></Overlay>
      <Drawer v-model="showDrawer" class="responsive">
        <div v-for="i in 100" :key="i">Test {{ i }}</div>
      </Drawer>

      <Overlay v-model="showWindow" :position="overlayPosition">
        <Dialog
          v-model="showWindow"
          title="Hello, world!!!"
          class="vuwi-card"
          :class="dialogClass"
          :modal="false"
        >
          <div class="p-4 text-left">This is a test.</div>
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
          <ToastIcon class="h-8 w-8" />
        </template>
      </Toast>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fefefe;
}
</style>
