<template>
  <div
    ref="vuwiDateRangePicker"
    v-vuwi.away
    class="relative w-full"
    :class="{ 'vuwi-datepicker-overlay': overlay, 'open': isShow && overlay }"
  >
    <slot
      :value="pickerValue"
      :placeholder="givenPlaceholder"
      :clear="clearPicker"
    >
      <label class="relative block">
        <input
          ref="pickerInputRef"
          v-model="pickerValue"
          type="text"
          class="relative block w-full pl-3 pr-12 py-2 rounded-md overflow-hidden text-sm text-gray-700 placeholder-gray-400 transition-colors bg-white border border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-500 focus:ring-opacity-10 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:ring-opacity-20"
          v-bind="$attrs"
          :placeholder="givenPlaceholder"
          @keyup="keyUp"
        />
        <span
          class="absolute inset-y-0 right-0 inline-flex items-center rounded-md overflow-hidden"
        >
          <button
            type="button"
            class="px-2 py-1 mr-1 focus:outline-none text-gray-400 dark:text-opacity-70 rounded-md"
            @click="pickerValue ? clearPicker() : pickerInputRef.focus()"
          >
            <tabler-x v-if="pickerValue" />
            <tabler-calendar v-else />
          </button>
        </span>
      </label>
    </slot>
    <transition
      enter-from-class="opacity-0 translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      enter-active-class="transform transition ease-out duration-200"
      leave-active-class="transform transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-3"
    >
      <div
        v-show="isShow"
        ref="pickerRef"
        class="absolute z-50 top-full sm:mt-2.5"
        :class="placement ? 'left-0 right-auto' : 'left-auto right-0'"
      >
        <div
          class="fixed inset-0 z-50 overflow-y-auto sm:overflow-visible sm:static sm:z-auto bg-white dark:bg-gray-800 sm:rounded-lg shadow-sm"
        >
          <div
            class="vuwi-datepicker static sm:relative w-full bg-white sm:rounded-lg sm:shadow-sm border-0 sm:border border-black border-opacity-10 px-3 py-3 sm:px-1 sm:py-1.5 dark:bg-gray-800 dark:border-gray-700 dark:border-opacity-100"
            :class="placement ? 'place-left' : 'place-right'"
          >
            <div class="flex flex-wrap lg:flex-nowrap">
              <picker-shortcut
                v-if="shortcuts"
                :shortcuts="shortcuts"
                :as-range="asRange()"
                :as-single="asSingle"
                :i18n="options.shortcuts"
              ></picker-shortcut>
              <!--          Calendar-->
              <div class="relative flex flex-wrap sm:flex-nowrap p-1">
                <div
                  v-if="asRange() && !asSingle"
                  class="hidden absolute inset-0 sm:flex justify-center items-center"
                >
                  <div
                    class="w-8 sm:w-1 h-1 sm:h-8 bg-blue-500 rounded-xl shadow-inner"
                  ></div>
                </div>
                <div
                  class="relative w-full sm:w-80"
                  :class="{ 'mb-3 sm:mb-0 sm:mr-2': asRange() && !asSingle }"
                >
                  <picker-header
                    :panel="panel.previous"
                    :calendar="calendar.previous"
                  ></picker-header>
                  <div class="px-0.5 sm:px-2">
                    <picker-month
                      v-show="panel.previous.month"
                      :months="months"
                      @update:month="calendar.previous.setMount"
                    ></picker-month>
                    <picker-year
                      v-show="panel.previous.year"
                      :years="calendar.previous.years()"
                      @update:year="calendar.previous.setYear"
                    ></picker-year>
                    <!--                Calendar-->
                    <div v-show="panel.previous.calendar">
                      <picker-week :weeks="weeks"></picker-week>
                      <picker-calendar
                        :calendar="calendar.previous"
                        :weeks="weeks"
                        :as-range="asRange()"
                        @update:date="setDate"
                      ></picker-calendar>
                    </div>
                  </div>
                </div>

                <!--          If use range-->
                <div
                  v-if="asRange() && !asSingle"
                  class="relative w-full sm:w-80 overflow-hidden mt-3 sm:mt-0 sm:ml-2"
                >
                  <picker-header
                    as-prev-or-next
                    :panel="panel.next"
                    :calendar="calendar.next"
                  ></picker-header>
                  <div class="px-0.5 sm:px-2">
                    <picker-month
                      v-show="panel.next.month"
                      :months="months"
                      @update:month="calendar.next.setMount"
                    ></picker-month>
                    <picker-year
                      v-show="panel.next.year"
                      as-prev-or-next
                      :years="calendar.next.years()"
                      @update:year="calendar.next.setYear"
                    ></picker-year>
                    <!--                Calendar-->
                    <div v-show="panel.next.calendar">
                      <picker-week :weeks="weeks"></picker-week>
                      <picker-calendar
                        as-prev-or-next
                        :calendar="calendar.next"
                        :weeks="weeks"
                        :as-range="asRange()"
                        @update:date="setDate"
                      ></picker-calendar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--          Footer-->
            <div v-if="!autoApply">
              <div
                class="mt-2 mx-2 py-1.5 border-t border-black border-opacity-10 dark:border-gray-700 dark:border-opacity-100"
              >
                <div class="mt-1.5 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    class="away-apply-picker w-full transition ease-out duration-300 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm dark:ring-offset-gray-800 disabled:cursor-not-allowed"
                    :disabled="
                      asSingle ? applyValue.length < 1 : applyValue.length < 2
                    "
                    @click="applyDate"
                    v-text="options.footer.apply"
                  ></button>
                  <button
                    type="button"
                    class="mt-3 away-cancel-picker w-full transition ease-out duration-300 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:ring-offset-gray-800"
                    v-text="options.footer.cancel"
                  ></button>
                </div>
              </div>
            </div>
            <div v-else class="sm:hidden">
              <div
                class="mt-2 mx-2 py-1.5 border-t border-black border-opacity-10 dark:border-gray-700 dark:border-opacity-100"
              >
                <div class="mt-1.5 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    class="away-cancel-picker w-full transition ease-out duration-300 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:ring-offset-gray-800"
                    v-text="options.footer.cancel"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isToday from 'dayjs/plugin/isToday'
import isBetween from 'dayjs/plugin/isBetween'
import duration from 'dayjs/plugin/duration'
import { Ref } from '@vue/reactivity'
import {
  useCurrentDate,
  useDisableDate,
  useBetweenRange,
  useNextDate,
  usePreviousDate,
  useToValueFromArray,
  useToValueFromString,
  useDirective,
  useVisibleViewport,
} from './helpers/fn'

import PickerHeader from './components/Header.vue'
import PickerMonth from './components/Month.vue'
import PickerWeek from './components/Week.vue'
import PickerYear from './components/Year.vue'
import PickerCalendar from './components/Calendar.vue'
import PickerShortcut from './components/Shortcut.vue'

dayjs.extend(localeData)
dayjs.extend(localizedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(isToday)
dayjs.extend(isBetween)
dayjs.extend(duration)

export default /* #__PURE__ */ defineComponent({
  components: {
    PickerHeader,
    PickerMonth,
    PickerWeek,
    PickerYear,
    PickerCalendar,
    PickerShortcut,
  },
  directives: {
    vuwi: {
      mounted: (el, binding) => {
        useDirective(binding)
      },
      updated: (el, binding) => {
        useDirective(binding)
      },
    },
  },
  props: {
    overlay: Boolean,
    asSingle: Boolean,
    useRange: Boolean,
    placeholder: {
      type: String,
      default: '',
    },
    i18n: {
      type: String,
      default: 'en',
    },
    disableDate: {
      type: [Boolean, Array, Function],
      default: false,
    },
    disableInRange: {
      type: Boolean,
      default: true,
    },
    autoApply: {
      type: Boolean,
      default: true,
    },
    shortcuts: {
      type: [Boolean, Function],
      default: true,
    },
    separator: {
      type: String,
      default: ' to ',
    },
    formatter: {
      type: Object,
      default: () => ({
        date: 'YYYY-MM-DD HH:mm:ss',
        month: 'MMM',
      }),
    },
    modelValue: {
      type: [Array, String],
      default: '',
    },
    startFrom: {
      default: () => new Date(),
    },
    options: {
      type: Object,
      default: () => ({
        shortcuts: {
          today: 'Today',
          yesterday: 'Yesterday',
          past: (period: any) => `Last ${period} Days`,
          currentMonth: 'Month to Date',
          pastMonth: 'Last Month',
        },
        footer: {
          apply: 'Apply',
          cancel: 'Cancel',
        },
      }),
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const vuwiDateRangePicker = ref()
    const pickerRef = ref()
    const pickerInputRef = ref()
    const isShow = ref(false)
    const placement = ref(true)
    const givenPlaceholder: Ref<string> = ref('')
    const selection: Ref<string | Dayjs> = ref('')
    const pickerValue: Ref<string | Dayjs> = ref('')
    const hoverValue: Ref<string[]> = ref([])
    const applyValue: Ref<Dayjs[]> = ref([])
    const previous: Ref<string | Dayjs> = ref('')
    const next = ref()
    const panel = reactive({
      previous: {
        calendar: true,
        month: false,
        year: false,
      },
      next: {
        calendar: true,
        month: false,
        year: false,
      },
    })
    const datepicker = ref({
      previous: dayjs(),
      next: dayjs().add(1, 'month'),
      year: {
        previous: dayjs().year(),
        next: dayjs().year(),
      },
      weeks: dayjs.weekdaysShort(),
      months:
        props.formatter.month === 'MMM' ? dayjs.monthsShort() : dayjs.months(),
    })
    const weeks = computed(() => datepicker.value.weeks)
    const months = computed(() => datepicker.value.months)
    const useArray = () => Array.isArray(props.modelValue)

    const asRange = () => {
      if (!props.useRange && !props.asSingle)
        return true

      else if (!props.useRange && props.asSingle)
        return false

      else if (props.useRange && !props.asSingle)
        return true

      else return !!(props.useRange && props.asSingle)
    }

    const show = () => {
      isShow.value = true
    }

    const hide = () => {
      isShow.value = false
    }

    const force = () => {
      previous.value = ''
      next.value = null
      hoverValue.value = []
      selection.value = ''
    }

    const clearPicker = () => {
      pickerValue.value = ''
      if (useArray())
        emit('update:modelValue', [])
      else
        emit('update:modelValue', '')

      applyValue.value = []
      pickerInputRef.value && pickerInputRef.value.focus()
    }

    const inRangeDate = (date: any) => {
      if (props.disableInRange) return false
      if (pickerValue.value === '') return false
      let s, e
      if (useArray()) {
        const [start, end] = props.modelValue as string[]
        s = start
        e = end
      }
      else {
        const tempVal = props.modelValue as string
        const [start, end] = tempVal.split(props.separator)
        s = start
        e = end
      }

      return date.isBetween(
        dayjs(s, props.formatter.date, true),
        dayjs(e, props.formatter.date, true),
        'date',
        '[]',
      )
    }
    const calendar = computed(() => {
      const { previous, next, year } = unref(datepicker)
      return {
        previous: {
          date: () => {
            return usePreviousDate(previous)
              .concat(useCurrentDate(previous))
              .concat(useNextDate(previous))
              .map((v) => {
                v.today = v.isToday()
                v.active = previous.month() === v.month()
                v.off = previous.month() !== v.month()
                v.sunday = v.day() === 0
                v.disabled
                  = useDisableDate(v, props) && !inRangeDate(v)
                v.inRange = () => {
                  if (props.asSingle && !props.useRange)
                    return previous.month() !== v.month()
                }
                v.hovered = () => {
                  if (!asRange()) return false
                  if (hoverValue.value.length > 1) {
                    return (
                      (v.isBetween(
                        hoverValue.value[0],
                        hoverValue.value[1],
                        'date',
                        '()',
                      )
                        || v.isBetween(
                          hoverValue.value[1],
                          hoverValue.value[0],
                          'date',
                          '()',
                        ))
                      && previous.month() === v.month()
                    )
                  }
                  return false
                }
                v.duration = () => {
                  return false
                }
                return v
              })
          },
          month: previous && previous.format(props.formatter.month),
          year: previous && previous.year(),
          years: () => {
            return Array.from(
              {
                length: 12,
              },
              (v, k) => year.previous + k,
            )
          },
          onPrevious: () => {
            datepicker.value.previous = previous.subtract(1, 'month')
          },
          onNext: () => {
            datepicker.value.previous = previous.add(1, 'month')
            if (previous.diff(next, 'month') === -1)
              datepicker.value.next = next.add(1, 'month')
          },
          onPreviousYear: () => {
            datepicker.value.year.previous
              = datepicker.value.year.previous - 12
          },
          onNextYear: () => {
            datepicker.value.year.previous
              = datepicker.value.year.previous + 12
          },
          openMonth: () => {
            panel.previous.month = !panel.previous.month
            panel.previous.year = false
            panel.previous.calendar = !panel.previous.month
          },
          setMount: ($event: any) => {
            datepicker.value.previous = previous.month($event)
            panel.previous.month = !panel.previous.month
            panel.previous.year = false
            panel.previous.calendar = !panel.previous.month
            nextTick(() => {
              if (
                datepicker.value.next.isSame(
                  datepicker.value.previous,
                  'month',
                )
                || datepicker.value.next.isBefore(datepicker.value.previous)
              ) {
                datepicker.value.next = datepicker.value.previous.add(
                  1,
                  'month',
                )
              }
              datepicker.value.year.next = datepicker.value.next.year()
            })
          },
          openYear: () => {
            panel.previous.year = !panel.previous.year
            panel.previous.month = false
            panel.previous.calendar = !panel.previous.year
          },
          setYear: ($event: number, asNext: any) => {
            if (!asNext) {
              datepicker.value.previous = previous.year($event)
              panel.previous.year = !panel.previous.year
              panel.previous.calendar = !panel.previous.year
              nextTick(() => {
                if (
                  datepicker.value.next.isSame(
                    datepicker.value.previous,
                    'month',
                  )
                  || datepicker.value.next.isBefore(datepicker.value.previous)
                ) {
                  datepicker.value.next = datepicker.value.previous.add(
                    1,
                    'month',
                  )
                }
                datepicker.value.year.previous = datepicker.value.previous.year()
                datepicker.value.year.next = datepicker.value.next.year()
              })
            }
          },
        },
        next: {
          date: () => {
            return usePreviousDate(next)
              .concat(useCurrentDate(next))
              .concat(useNextDate(next))
              .map((v) => {
                v.today = v.isToday()
                v.active = next.month() === v.month()
                v.off = next.month() !== v.month()
                v.sunday = v.day() === 0
                v.disabled
                  = useDisableDate(v, props) && !inRangeDate(v)
                v.inRange = () => {
                  if (props.asSingle && !props.useRange)
                    return next.month() !== v.month()
                }
                v.hovered = () => {
                  if (hoverValue.value.length > 1) {
                    return (
                      (v.isBetween(
                        hoverValue.value[0],
                        hoverValue.value[1],
                        'date',
                        '()',
                      )
                        || v.isBetween(
                          hoverValue.value[1],
                          hoverValue.value[0],
                          'date',
                          '()',
                        ))
                      && next.month() === v.month()
                    )
                  }
                  return false
                }
                v.duration = () => {
                  return false
                }
                return v
              })
          },
          month: next && next.format(props.formatter.month),
          year: next && next.year(),
          years: () => {
            return Array.from(
              {
                length: 12,
              },
              (v, k) => year.next + k,
            )
          },
          onPrevious: () => {
            datepicker.value.next = next.subtract(1, 'month')
            if (next.diff(previous, 'month') === 1)
              datepicker.value.previous = previous.subtract(1, 'month')
          },
          onNext: () => {
            datepicker.value.next = next.add(1, 'month')
          },
          onPreviousYear: () => {
            datepicker.value.year.next = datepicker.value.year.next - 12
          },
          onNextYear: () => {
            datepicker.value.year.next = datepicker.value.year.next + 12
          },
          openMonth: () => {
            panel.next.month = !panel.next.month
            panel.next.year = false
            panel.next.calendar = !panel.next.month
          },
          setMount: ($event: number) => {
            datepicker.value.next = next.month($event)
            panel.next.month = !panel.next.month
            panel.next.year = false
            panel.next.calendar = !panel.next.month
            nextTick(() => {
              if (
                datepicker.value.previous.isSame(
                  datepicker.value.next,
                  'month',
                )
                || datepicker.value.previous.isAfter(datepicker.value.next)
              ) {
                datepicker.value.previous = datepicker.value.next.subtract(
                  1,
                  'month',
                )
              }
              datepicker.value.year.previous = datepicker.value.previous.year()
            })
          },
          openYear: () => {
            panel.next.year = !panel.next.year
            panel.next.month = false
            panel.next.calendar = !panel.next.year
          },
          setYear: ($event: number, asNext: any) => {
            if (asNext) {
              datepicker.value.next = next.year($event)
              panel.next.year = !panel.next.year
              panel.next.month = false
              panel.next.calendar = !panel.next.year
              nextTick(() => {
                if (
                  datepicker.value.previous.isSame(
                    datepicker.value.next,
                    'month',
                  )
                  || datepicker.value.previous.isAfter(datepicker.value.next)
                ) {
                  datepicker.value.previous = datepicker.value.next.subtract(
                    1,
                    'month',
                  )
                }
                datepicker.value.year.previous = datepicker.value.previous.year()
                datepicker.value.year.next = datepicker.value.next.year()
              })
            }
          },
        },
      }
    })
    const setDate = (date: any, asNext: any) => {
      if (asRange()) {
        if (previous.value) {
          next.value = date
          if (props.autoApply) {
            if (date.isBefore(previous.value)) {
              pickerValue.value = useToValueFromArray(
                {
                  previous: date,
                  next: previous.value,
                },
                props,
              )
            }
            else {
              pickerValue.value = useToValueFromArray(
                {
                  previous: previous.value,
                  next: date,
                },
                props,
              )
            }
            const [s, e] = pickerValue.value.split(props.separator)

            if (useArray()) {
              emit('update:modelValue', [
                dayjs(s, props.formatter.date, true).format(
                  props.formatter.date,
                ),
                dayjs(e, props.formatter.date, true).format(
                  props.formatter.date,
                ),
              ])
            }
            else {
              emit(
                'update:modelValue',
                useToValueFromArray(
                  {
                    previous: dayjs(s, props.formatter.date, true),
                    next: dayjs(e, props.formatter.date, true),
                  },
                  props,
                ),
              )
            }
            isShow.value = false
            applyValue.value = []
            if (
              !dayjs(s, props.formatter.date, true).isSame(
                dayjs(e, props.formatter.date, true),
                'month',
              )
            ) {
              datepicker.value.previous = dayjs(s, props.formatter.date, true)
              datepicker.value.next = dayjs(e, props.formatter.date, true)
            }
            force()
          }
          else {
            if (dayjs(previous.value).isAfter(date, 'month'))
              applyValue.value = [date, previous.value]

            else
              applyValue.value = [previous.value, date]

            const [s, e] = applyValue.value

            if (!dayjs(s).isSame(e, 'month')) {
              datepicker.value.previous = s
              datepicker.value.next = e
            }
            force()
          }
        }
        else {
          applyValue.value = []
          previous.value = date
          selection.value = date
          hoverValue.value.push(date)
          applyValue.value.push(date)

          if (asNext) {
            datepicker.value.next = date
            if (datepicker.value.previous.isSame(date, 'month'))
              datepicker.value.next = date.add(1, 'month')
          }
          else {
            datepicker.value.previous = date
            if (datepicker.value.next.isSame(date, 'month')) {
              datepicker.value.previous = datepicker.value.next
              datepicker.value.next = date.add(1, 'month')
            }
          }
        }
      }
      else {
        if (props.autoApply) {
          pickerValue.value = useToValueFromString(date, props)
          if (useArray())
            emit('update:modelValue', [pickerValue.value])
          else
            emit('update:modelValue', pickerValue.value)

          isShow.value = false
          applyValue.value = []
          force()
        }
        else {
          applyValue.value = [date]
          force()
        }
      }
    }
    /**
     * keyUp event
     * @since v1.0.5
     */
    const keyUp = () => {
      if (asRange()) {
        const [s, e] = pickerValue.value.toString().split(props.separator)
        const [sd, ed] = [
          dayjs(s, props.formatter.date, true),
          dayjs(e, props.formatter.date, true),
        ]
        if (sd.isValid() && ed.isValid()) {
          setDate(sd, null)
          setDate(ed, null)
          if (useArray()) {
            emit('update:modelValue', [s, e])
          }
          else {
            emit(
              'update:modelValue',
              useToValueFromArray(
                {
                  previous: sd,
                  next: ed,
                },
                props,
              ),
            )
          }
        }
      }
      else {
        const d = dayjs(pickerValue.value, props.formatter.date, true)
        if (d.isValid()) {
          setDate(d, null)
          if (useArray())
            emit('update:modelValue', [pickerValue.value])
          else
            emit('update:modelValue', pickerValue.value)
        }
      }
    }

    // TODO: Working with date time
    const setHours = (asNext = false) => {}

    const setMinutes = (asNext = false) => {}

    const setSeconds = (asNext = false) => {}

    const applyDate = () => {
      if (applyValue.value.length < 1) return false
      let date
      if (asRange()) {
        const [s, e] = applyValue.value
        if (dayjs(e).isBefore(s)) {
          date = useToValueFromArray(
            {
              previous: e,
              next: s,
            },
            props,
          )
        }
        else {
          date = useToValueFromArray(
            {
              previous: s,
              next: e,
            },
            props,
          )
        }
      }
      else {
        const [s] = applyValue.value
        date = s
      }
      if (asRange()) {
        const [s, e] = date.toString().split(props.separator)

        if (useArray()) {
          emit('update:modelValue', [
            dayjs(s, props.formatter.date, true).format(props.formatter.date),
            dayjs(e, props.formatter.date, true).format(props.formatter.date),
          ])
        }
        else {
          emit(
            'update:modelValue',
            useToValueFromArray(
              {
                previous: dayjs(s, props.formatter.date, true),
                next: dayjs(e, props.formatter.date, true),
              },
              props,
            ),
          )
        }
        pickerValue.value = date
      }
      else {
        pickerValue.value = dayjs(date).format(props.formatter.date)
        if (useArray())
          emit('update:modelValue', [pickerValue.value])
        else
          emit('update:modelValue', pickerValue.value)
      }
    }

    const atMouseOver = (date: any) => {
      if (!asRange()) return false
      if (previous.value) {
        hoverValue.value = [previous.value, date]
      }
      else {
        hoverValue.value = []
        return false
      }
    }

    const isBetweenRange = (date: any) => {
      if (previous.value && props.autoApply) return false
      let s, e
      if (hoverValue.value.length > 1) {
        const [start, end] = hoverValue.value
        s = dayjs(start, props.formatter.date, true)
        e = dayjs(end, props.formatter.date, true)
      }
      else {
        if (useArray()) {
          if (props.autoApply) {
            const [start, end] = props.modelValue as string[]
            s = start && dayjs(start, props.formatter.date, true)
            e = end && dayjs(end, props.formatter.date, true)
          }
          else {
            const [start, end] = applyValue.value
            s = dayjs(start, props.formatter.date, true)
            e = dayjs(end, props.formatter.date, true)
          }
        }
        else {
          if (props.autoApply) {
            const tempVal = props.modelValue as string
            const [start, end] = tempVal
              ? tempVal.split(props.separator)
              : [false, false]
            s = start && dayjs(start.toString(), props.formatter.date, true)
            e = end && dayjs(end.toString(), props.formatter.date, true)
          }
          else {
            const [start, end] = applyValue.value
            s = dayjs(start, props.formatter.date, true)
            e = dayjs(end, props.formatter.date, true)
          }
        }
      }
      if (s && e) {
        return useBetweenRange(date, {
          previous: s,
          next: e,
        })
      }
      return false
    }

    const datepickerClasses = (date: any) => {
      const { today, active, off, disabled } = date
      let classes: any, s: any, e: any
      if (asRange()) {
        if (useArray()) {
          if (selection.value) {
            const [start, end] = hoverValue.value
            s = start && dayjs(start, props.formatter.date, true)
            e = end && dayjs(end, props.formatter.date, true)
          }
          else {
            if (props.autoApply) {
              const [start, end] = props.modelValue as string[]
              s = start && dayjs(start, props.formatter.date, true)
              e = end && dayjs(end, props.formatter.date, true)
            }
            else {
              const [start, end] = applyValue.value
              s = start && dayjs(start, props.formatter.date, true)
              e = end && dayjs(end, props.formatter.date, true)
            }
          }
        }
        else {
          if (selection.value) {
            const [start, end] = hoverValue.value
            s = start && dayjs(start, props.formatter.date, true)
            e = end && dayjs(end, props.formatter.date, true)
          }
          else {
            if (props.autoApply) {
              const [start, end] = props.modelValue
                ? props.modelValue.toString().split(props.separator)
                : [false, false]
              s = start && dayjs(start.toString(), props.formatter.date, true)
              e = end && dayjs(end.toString(), props.formatter.date, true)
            }
            else {
              const [start, end] = applyValue.value
              s = start && dayjs(start, props.formatter.date, true)
              e = end && dayjs(end, props.formatter.date, true)
            }
          }
        }
      }
      else {
        if (useArray()) {
          if (props.autoApply) {
            if (props.modelValue.length > 0) {
              const [start] = props.modelValue as string[]
              s = dayjs(start, props.formatter.date, true)
            }
          }
          else {
            const [start] = applyValue.value
            s = start && dayjs(start, props.formatter.date, true)
          }
        }
        else {
          if (props.autoApply) {
            if (props.modelValue) {
              const [start] = props.modelValue.toString().split(props.separator)
              s = dayjs(start, props.formatter.date, true)
            }
          }
          else {
            const [start] = applyValue.value
            s = start && dayjs(start, props.formatter.date, true)
          }
        }
      }
      if (active) {
        classes = today
          ? 'text-blue-500 font-semibold dark:text-blue-400 rounded-full'
          : disabled
            ? 'text-gray-600 font-normal disabled:text-gray-500 disabled:cursor-not-allowed rounded-full'
            : date.isBetween(s, e, 'date', '()')
              ? 'text-gray-700 font-medium dark:text-gray-100 rounded-full'
              : 'text-gray-600 font-medium dark:text-gray-200 rounded-full'
      }
      if (off)
        classes = 'text-gray-400 font-light disabled:cursor-not-allowed'

      if (s && e && !off) {
        if (date.isSame(s, 'date')) {
          classes = e.isAfter(s, 'date')
            ? 'bg-blue-500 text-white font-bold rounded-l-full disabled:cursor-not-allowed'
            : 'bg-blue-500 text-white font-bold rounded-r-full disabled:cursor-not-allowed'
          if (dayjs(s).isSame(e, 'date'))
            classes = 'bg-blue-500 text-white font-bold rounded-full disabled:cursor-not-allowed'
        }
        if (date.isSame(e, 'date')) {
          classes = dayjs(e).isAfter(s, 'date')
            ? 'bg-blue-500 text-white font-bold rounded-r-full disabled:cursor-not-allowed'
            : 'bg-blue-500 text-white font-bold rounded-l-full disabled:cursor-not-allowed'
          if (dayjs(s).isSame(e, 'date'))
            classes = 'bg-blue-500 text-white font-bold rounded-full disabled:cursor-not-allowed'
        }
      }
      else if (s) {
        if (date.isSame(s, 'date') && !off)
          classes = 'bg-blue-500 text-white font-bold rounded-full disabled:cursor-not-allowed'
      }

      return classes
    }

    const betweenRangeClasses = (date: any) => {
      let classes, s, e
      classes = ''
      if (!asRange()) return classes
      if (useArray()) {
        if (hoverValue.value.length > 1) {
          const [start, end] = hoverValue.value
          s = start && dayjs(start, props.formatter.date, true)
          e = end && dayjs(end, props.formatter.date, true)
        }
        else {
          if (props.autoApply) {
            const [start, end] = props.modelValue as string[]
            s = start && dayjs(start, props.formatter.date, true)
            e = end && dayjs(end, props.formatter.date, true)
          }
          else {
            const [start, end] = applyValue.value
            s = start && dayjs(start, props.formatter.date, true)
            e = end && dayjs(end, props.formatter.date, true)
          }
        }
      }
      else {
        if (hoverValue.value.length > 1) {
          const [start, end] = hoverValue.value
          s = start && dayjs(start, props.formatter.date, true)
          e = end && dayjs(end, props.formatter.date, true)
        }
        else {
          if (props.autoApply) {
            const [start, end] = props.modelValue
              ? props.modelValue.toString().split(props.separator)
              : [false, false]
            s = start && dayjs(start.toString(), props.formatter.date, true)
            e = end && dayjs(end.toString(), props.formatter.date, true)
          }
          else {
            const [start, end] = applyValue.value
            s = start && dayjs(start, props.formatter.date, true)
            e = end && dayjs(end, props.formatter.date, true)
          }
        }
      }

      if (s && e) {
        if (date.isSame(s, 'date')) {
          if (e.isBefore(s))
            classes += ' rounded-r-full inset-0'

          if (s.isBefore(e))
            classes += ' rounded-l-full inset-0'
        }
        else if (date.isSame(e, 'date')) {
          if (e.isBefore(s))
            classes += ' rounded-l-full inset-0'

          if (s.isBefore(e))
            classes += ' rounded-r-full inset-0'
        }
        else {
          classes += ' inset-0'
        }
      }
      return classes
    }

    const emitShortcut = (s: any, e: any) => {
      if (asRange()) {
        if (props.autoApply) {
          if (useArray()) {
            emit('update:modelValue', [s, e])
          }
          else {
            emit(
              'update:modelValue',
              useToValueFromArray(
                {
                  previous: s,
                  next: e,
                },
                props,
              ),
            )
          }
          pickerValue.value = `${s}${props.separator}${e}`
        }
        else {
          applyValue.value = [
            dayjs(s, props.formatter.date, true),
            dayjs(e, props.formatter.date, true),
          ]
        }
      }
      else {
        if (props.autoApply) {
          if (useArray())
            emit('update:modelValue', [s])
          else
            emit('update:modelValue', s)

          pickerValue.value = s
        }
        else {
          applyValue.value = [
            dayjs(s, props.formatter.date, true),
            dayjs(e, props.formatter.date, true),
          ]
        }
      }
      emit('update:modelValue', [s, e])
    }

    const setToToday = () => {
      const s = dayjs().format(props.formatter.date)
      const e = dayjs().format(props.formatter.date)

      emitShortcut(s, e)
    }

    const setToYesterday = () => {
      const s = dayjs()
        .subtract(1, 'day')
        .format(props.formatter.date)
      const e = dayjs()
        .subtract(1, 'day')
        .format(props.formatter.date)

      emitShortcut(s, e)
    }

    const setToLastDay = (day: number) => {
      const s = dayjs()
        .subtract(day - 1, 'day')
        .format(props.formatter.date)
      const e = dayjs().format(props.formatter.date)

      emitShortcut(s, e)
    }

    const setToThisMonth = () => {
      const s = dayjs()
        .date(1)
        .format(props.formatter.date)
      const e = dayjs().endOf('day').format(props.formatter.date)

      emitShortcut(s, e)
    }

    const setToLastMonth = () => {
      const s = dayjs()
        .date(1)
        .subtract(1, 'month')
        .format(props.formatter.date)
      const e = dayjs()
        .date(0)
        .format(props.formatter.date)

      emitShortcut(s, e)
    }

    const setToCustomShortcut = (item: { atClick: () => [any, any] }) => {
      const [d, dd] = item.atClick()
      const s = dayjs(d).format(props.formatter.date)
      const e = dayjs(dd).format(props.formatter.date)

      emitShortcut(s, e)
    }

    watch(
      () => isShow.value,
      () => {
        nextTick(() => {
          placement.value = useVisibleViewport(pickerRef.value)
        })
      },
    )

    watch(
      () => applyValue.value,
      (newValue) => {
        if (newValue.length > 0) {
          panel.previous.calendar = true
          panel.previous.month = false
          panel.previous.year = false

          panel.next.calendar = true
          panel.next.month = false
          panel.next.year = false
        }
      },
    )

    watchEffect(() => {
      if (!props.placeholder) {
        if (asRange())
          givenPlaceholder.value = `${props.formatter.date}${props.separator}${props.formatter.date}`

        else
          givenPlaceholder.value = props.formatter.date
      }
      else {
        givenPlaceholder.value = props.placeholder
      }
    })

    watchEffect(() => {
      const locale = props.i18n
      nextTick(() => {
        import(`./locale/${locale}.js`)
          .then(() => {
            dayjs.locale(locale)
            let s, e
            if (asRange()) {
              if (useArray()) {
                if (props.modelValue.length > 0) {
                  const [start, end] = props.modelValue as string[]
                  s = dayjs(start, props.formatter.date, true)
                  e = dayjs(end, props.formatter.date, true)
                }
              }
              else {
                if (props.modelValue) {
                  const [start, end] = props.modelValue.toString().split(props.separator)
                  s = dayjs(start, props.formatter.date, true)
                  e = dayjs(end, props.formatter.date, true)
                }
              }

              if (s && e) {
                pickerValue.value = useToValueFromArray(
                  {
                    previous: s,
                    next: e,
                  },
                  props,
                )
                if (e.isBefore(s, 'month')) {
                  datepicker.value.previous = e
                  datepicker.value.next = s
                  datepicker.value.year.previous = e.year()
                  datepicker.value.year.next = s.year()
                }
                else if (e.isSame(s, 'month')) {
                  datepicker.value.previous = s
                  datepicker.value.next = e.add(1, 'month')
                  datepicker.value.year.previous = s.year()
                  datepicker.value.year.next = s.add(1, 'year').year()
                }
                else {
                  datepicker.value.previous = s
                  datepicker.value.next = e
                  datepicker.value.year.previous = s.year()
                  datepicker.value.year.next = e.year()
                }
                if (!props.autoApply)
                  applyValue.value = [s, e]
              }
              else {
                datepicker.value.previous = dayjs(props.startFrom)
                datepicker.value.next = dayjs(props.startFrom).add(1, 'month')
                datepicker.value.year.previous = datepicker.value.previous.year()
                datepicker.value.year.next = datepicker.value.next.year()
              }
            }
            else {
              if (useArray()) {
                if (props.modelValue.length > 0) {
                  const [start] = props.modelValue as string[]
                  s = dayjs(start, props.formatter.date, true)
                }
              }
              else {
                if (props.modelValue.length) {
                  const [start] = props.modelValue.toString().split(props.separator)
                  s = dayjs(start, props.formatter.date, true)
                }
              }

              if (s && s.isValid()) {
                pickerValue.value = useToValueFromString(s, props)
                datepicker.value.previous = s
                datepicker.value.next = s.add(1, 'month')
                datepicker.value.year.previous = s.year()
                datepicker.value.year.next = s.add(1, 'year').year()
                if (!props.autoApply)
                  applyValue.value = [s]
              }
              else {
                datepicker.value.previous = dayjs(props.startFrom)
                datepicker.value.next = dayjs(props.startFrom).add(1, 'month')
                datepicker.value.year.previous = datepicker.value.previous.year()
                datepicker.value.year.next = datepicker.value.next.year()
              }
            }
            datepicker.value.weeks = dayjs.weekdaysShort()
            datepicker.value.months
              = props.formatter.month === 'MMM'
                ? dayjs.monthsShort()
                : dayjs.months()
          })
          .catch(() => {
            console.warn(
              '[Vuwi Datepicker]: List of supported locales https://github.com/iamkun/dayjs/tree/dev/src/locale',
            )
          })
      })
    })

    provide('isBetweenRange', isBetweenRange)
    provide('betweenRangeClasses', betweenRangeClasses)
    provide('datepickerClasses', datepickerClasses)
    provide('atMouseOver', atMouseOver)
    provide('setToToday', setToToday)
    provide('setToYesterday', setToYesterday)
    provide('setToLastDay', setToLastDay)
    provide('setToThisMonth', setToThisMonth)
    provide('setToLastMonth', setToLastMonth)
    provide('setToCustomShortcut', setToCustomShortcut)

    return {
      vuwiDateRangePicker,
      pickerRef,
      pickerInputRef,
      isShow,
      placement,
      givenPlaceholder,
      previous,
      next,
      panel,
      pickerValue,
      hoverValue,
      applyValue,
      datepicker,
      calendar,
      weeks,
      months,
      asRange,
      show,
      hide,
      keyUp,
      setDate,
      setHours,
      setMinutes,
      setSeconds,
      applyDate,
      clearPicker,
    }
  },
})
</script>
