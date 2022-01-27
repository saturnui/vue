<script lang="ts">
import { computed, defineComponent } from 'vue-demi'
import ChevronLeftIcon from '../Icon/ChevronLeftIcon.vue'
import ChevronRightIcon from '../Icon/ChevronRightIcon.vue';

export default defineComponent({
    props: {
        className: {
            type: String,
            default: "wi-pagination",
        },
        totalVisible: {
            type: Number,
            default: 0,
        },
        modelValue: {
            type: Number,
            default: 0,
        },
        length: {
            type: Number,
            default: 0,
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        function generatePageItems(length: number, current: number, totalVisible: number) {
            if (!totalVisible)
                totalVisible = length;
            if (length < totalVisible) {
                const vals = [];
                for (let i = 0; i < length; i++)
                    vals[i] = { val: i };
                return vals;
            }
            if (totalVisible === 1)
                return [{ val: current }];
            if (totalVisible === 2)
                return [{ val: Math.min(current, length - 2) }, { val: Math.min(current + 1, length - 1) }];
            const left = Math.max(0, Math.min(length - totalVisible, current - Math.round(totalVisible / 2)));
            const items = new Array(totalVisible);
            for (let i = 0; i < totalVisible; i += 1)
                items[i] = { val: i + left };
            if (items[0].val > 0) {
                items[0] = { val: 0 };
                items[1] = {
                    more: true,
                    type: "prev",
                    range: { start: 1, end: items[2].val },
                };
            }
            if (items[items.length - 1].val < length - 1) {
                const start = items[items.length - 1].val - 1;
                items[items.length - 1] = {
                    val: length - 1,
                };
                items[items.length - 2] = {
                    more: true,
                    type: "next",
                    range: { start, end: length - 1 },
                };
            }
            return items;
        }
        const values = computed(() => {
            return generatePageItems(props.length, props.modelValue, props.totalVisible);
        });
        const prev = () => {
            if (props.modelValue)
                emit("update:modelValue", props.modelValue - 1);
        };
        const next = () => {
            if (props.modelValue < props.length - 1)
                emit("update:modelValue", props.modelValue + 1);
        };
        const value = (val: number) => emit("update:modelValue", val);
        const isMoreActive = (item: any, modelValue: number) => {
            return modelValue >= item.range.start && modelValue < item.range.end;
        };
        const isActive = (item: any, modelValue: number) => {
            return item.val === modelValue;
        };
        const disableNavButtons = computed(() => {
            return props.length === 1;
        });
        return {
            isActive,
            disableNavButtons,
            isMoreActive,
            next,
            prev,
            value,
            values,
        };
    },
    components: { ChevronLeftIcon, ChevronRightIcon }
})
</script>

<template>
  <nav :class="className" role="navigation">
    <button left :disabled="disableNavButtons" @click="prev">
      <slot name="prev-icon">
        <ChevronLeftIcon />
      </slot>
    </button>
    <span v-for="(item, index) in values" :key="index">
      <slot
        v-if="item.more"
        name="more-icon"
        v-bind="{ page: modelValue + 1, active: isMoreActive(item, modelValue) }"
      >
        <div name="more" :active="isMoreActive(item, modelValue)">
          <span name="page">{{ modelValue + 1 }}</span>
          <span name="dots">...</span>
        </div>
      </slot>
      <button
        v-else
        link
        :active="isActive(item, modelValue)"
        @click="value(item.val)"
      >{{ item.val + 1 }}</button>
    </span>
    <button right :disabled="disableNavButtons" @click="next">
      <slot name="next-icon">
        <ChevronRightIcon />
      </slot>
    </button>
  </nav>
</template>
