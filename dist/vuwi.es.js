import { openBlock, createElementBlock, normalizeClass, createElementVNode, toDisplayString } from "vue";
var Button_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  for (const [key, val] of props) {
    sfc[key] = val;
  }
  return sfc;
};
const _sfc_main = {
  name: "Button",
  props: {
    label: {
      type: String,
      required: false,
      default: void 0
    },
    title: {
      type: String,
      required: false,
      default: void 0
    },
    type: {
      type: String,
      required: false,
      default: "default",
      validator(type) {
        return ["default", "outlined", "text"].includes(type);
      }
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ["click"],
  computed: {
    buttonClassObject() {
      return {
        "is-default": this.type === "default",
        "is-outlined": this.type === "outlined",
        "is-text": this.type === "text"
      };
    }
  },
  methods: {
    onClick(event) {
      this.$emit("click", event);
    }
  }
};
const _hoisted_1 = ["title", "aria-label", "disabled"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("button", {
    class: normalizeClass($options.buttonClassObject),
    type: "button",
    title: $props.title,
    "aria-label": $props.title,
    disabled: $props.disabled,
    onClick: _cache[0] || (_cache[0] = ($event) => $options.onClick($event))
  }, [
    createElementVNode("span", null, toDisplayString($props.label), 1)
  ], 10, _hoisted_1);
}
var Button = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5d4ae5d9"]]);
export { Button };
