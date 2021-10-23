var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { unref as unref$1, inject, computed, onMounted, provide, isRef as isRef$1, watch as watch$1, onBeforeUnmount, defineComponent as defineComponent$1, toRef, resolveDynamicComponent, h, getCurrentInstance, ref as ref$1, reactive as reactive$1, nextTick as nextTick$1, warn as warn$1, readonly as readonly$1, markRaw as markRaw$1, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createElementVNode, toDisplayString, withDirectives, Fragment, renderList, vModelSelect, createBlock, createCommentVNode, withCtx, createTextVNode, createVNode, Transition, withModifiers, pushScopeId, popScopeId, resolveDirective, vModelText, customRef } from "vue";
import dayjs from "dayjs";
var index = "";
/**
  * vee-validate v4.5.4
  * (c) 2021 Abdelrahman Awad
  * @license MIT
  */
function isCallable(fn) {
  return typeof fn === "function";
}
function isNullOrUndefined(value) {
  return value === null || value === void 0;
}
const isObject$1 = (obj) => obj !== null && !!obj && typeof obj === "object" && !Array.isArray(obj);
function isIndex(value) {
  return Number(value) >= 0;
}
function toNumber(value) {
  const n = parseFloat(value);
  return isNaN(n) ? value : n;
}
const RULES = {};
function resolveRule(id) {
  return RULES[id];
}
const FormContextKey = Symbol("vee-validate-form");
const FieldContextKey = Symbol("vee-validate-field-instance");
const IS_ABSENT = Symbol("Default empty value");
function isLocator(value) {
  return isCallable(value) && !!value.__locatorRef;
}
function isHTMLTag(tag) {
  return ["input", "textarea", "select"].includes(tag);
}
function isFileInputNode(tag, attrs) {
  return isHTMLTag(tag) && attrs.type === "file";
}
function isYupValidator(value) {
  return !!value && isCallable(value.validate);
}
function hasCheckedAttr(type) {
  return type === "checkbox" || type === "radio";
}
function isContainerValue(value) {
  return isObject$1(value) || Array.isArray(value);
}
function isEmptyContainer(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return isObject$1(value) && Object.keys(value).length === 0;
}
function isNotNestedPath(path) {
  return /^\[.+\]$/i.test(path);
}
function isNativeMultiSelect(el) {
  return isNativeSelect(el) && el.multiple;
}
function isNativeSelect(el) {
  return el.tagName === "SELECT";
}
function isNativeMultiSelectNode(tag, attrs) {
  const hasTruthyBindingValue = ![false, null, void 0, 0].includes(attrs.multiple) && !Number.isNaN(attrs.multiple);
  return tag === "select" && "multiple" in attrs && hasTruthyBindingValue;
}
function shouldHaveValueBinding(tag, attrs) {
  return isNativeMultiSelectNode(tag, attrs) || isFileInputNode(tag, attrs);
}
function isFormSubmitEvent(evt) {
  return isEvent(evt) && evt.target && "submit" in evt.target;
}
function isEvent(evt) {
  if (!evt) {
    return false;
  }
  if (typeof Event !== "undefined" && isCallable(Event) && evt instanceof Event) {
    return true;
  }
  if (evt && evt.srcElement) {
    return true;
  }
  return false;
}
function isPropPresent(obj, prop) {
  return prop in obj && obj[prop] !== IS_ABSENT;
}
function cleanupNonNestedPath(path) {
  if (isNotNestedPath(path)) {
    return path.replace(/\[|\]/gi, "");
  }
  return path;
}
function getFromPath(object, path, fallback) {
  if (!object) {
    return fallback;
  }
  if (isNotNestedPath(path)) {
    return object[cleanupNonNestedPath(path)];
  }
  const resolvedValue = (path || "").split(/\.|\[(\d+)\]/).filter(Boolean).reduce((acc, propKey) => {
    if (isContainerValue(acc) && propKey in acc) {
      return acc[propKey];
    }
    return fallback;
  }, object);
  return resolvedValue;
}
function setInPath(object, path, value) {
  if (isNotNestedPath(path)) {
    object[cleanupNonNestedPath(path)] = value;
    return;
  }
  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let acc = object;
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      acc[keys[i]] = value;
      return;
    }
    if (!(keys[i] in acc) || isNullOrUndefined(acc[keys[i]])) {
      acc[keys[i]] = isIndex(keys[i + 1]) ? [] : {};
    }
    acc = acc[keys[i]];
  }
}
function unset(object, key) {
  if (Array.isArray(object) && isIndex(key)) {
    object.splice(Number(key), 1);
    return;
  }
  if (isObject$1(object)) {
    delete object[key];
  }
}
function unsetPath(object, path) {
  if (isNotNestedPath(path)) {
    delete object[cleanupNonNestedPath(path)];
    return;
  }
  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let acc = object;
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      unset(acc, keys[i]);
      break;
    }
    if (!(keys[i] in acc) || isNullOrUndefined(acc[keys[i]])) {
      break;
    }
    acc = acc[keys[i]];
  }
  const pathValues = keys.map((_, idx) => {
    return getFromPath(object, keys.slice(0, idx).join("."));
  });
  for (let i = pathValues.length - 1; i >= 0; i--) {
    if (!isEmptyContainer(pathValues[i])) {
      continue;
    }
    if (i === 0) {
      unset(object, keys[0]);
      continue;
    }
    unset(pathValues[i - 1], keys[i - 1]);
  }
}
function keysOf(record) {
  return Object.keys(record);
}
function injectWithSelf(symbol, def2 = void 0) {
  const vm = getCurrentInstance();
  return (vm === null || vm === void 0 ? void 0 : vm.provides[symbol]) || inject(symbol, def2);
}
function warn(message) {
  warn$1(`[vee-validate]: ${message}`);
}
function resolveNextCheckboxValue(currentValue, checkedValue, uncheckedValue) {
  if (Array.isArray(currentValue)) {
    const newVal = [...currentValue];
    const idx = newVal.indexOf(checkedValue);
    idx >= 0 ? newVal.splice(idx, 1) : newVal.push(checkedValue);
    return newVal;
  }
  return currentValue === checkedValue ? uncheckedValue : checkedValue;
}
function debounceAsync(inner, ms = 0) {
  let timer = null;
  let resolves = [];
  return function(...args) {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      const result = inner(...args);
      resolves.forEach((r) => r(result));
      resolves = [];
    }, ms);
    return new Promise((resolve) => resolves.push(resolve));
  };
}
const normalizeChildren = (tag, context, slotProps) => {
  if (!context.slots.default) {
    return context.slots.default;
  }
  if (typeof tag === "string" || !tag) {
    return context.slots.default(slotProps());
  }
  return {
    default: () => {
      var _a, _b;
      return (_b = (_a = context.slots).default) === null || _b === void 0 ? void 0 : _b.call(_a, slotProps());
    }
  };
};
function getBoundValue(el) {
  if (hasValueBinding(el)) {
    return el._value;
  }
  return void 0;
}
function hasValueBinding(el) {
  return "_value" in el;
}
function normalizeEventValue(value) {
  if (!isEvent(value)) {
    return value;
  }
  const input = value.target;
  if (hasCheckedAttr(input.type) && hasValueBinding(input)) {
    return getBoundValue(input);
  }
  if (input.type === "file" && input.files) {
    return Array.from(input.files);
  }
  if (isNativeMultiSelect(input)) {
    return Array.from(input.options).filter((opt) => opt.selected && !opt.disabled).map(getBoundValue);
  }
  if (isNativeSelect(input)) {
    const selectedOption = Array.from(input.options).find((opt) => opt.selected);
    return selectedOption ? getBoundValue(selectedOption) : input.value;
  }
  return input.value;
}
function normalizeRules(rules) {
  const acc = {};
  Object.defineProperty(acc, "_$$isNormalized", {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false
  });
  if (!rules) {
    return acc;
  }
  if (isObject$1(rules) && rules._$$isNormalized) {
    return rules;
  }
  if (isObject$1(rules)) {
    return Object.keys(rules).reduce((prev, curr) => {
      const params = normalizeParams(rules[curr]);
      if (rules[curr] !== false) {
        prev[curr] = buildParams(params);
      }
      return prev;
    }, acc);
  }
  if (typeof rules !== "string") {
    return acc;
  }
  return rules.split("|").reduce((prev, rule) => {
    const parsedRule = parseRule(rule);
    if (!parsedRule.name) {
      return prev;
    }
    prev[parsedRule.name] = buildParams(parsedRule.params);
    return prev;
  }, acc);
}
function normalizeParams(params) {
  if (params === true) {
    return [];
  }
  if (Array.isArray(params)) {
    return params;
  }
  if (isObject$1(params)) {
    return params;
  }
  return [params];
}
function buildParams(provided) {
  const mapValueToLocator = (value) => {
    if (typeof value === "string" && value[0] === "@") {
      return createLocator(value.slice(1));
    }
    return value;
  };
  if (Array.isArray(provided)) {
    return provided.map(mapValueToLocator);
  }
  if (provided instanceof RegExp) {
    return [provided];
  }
  return Object.keys(provided).reduce((prev, key) => {
    prev[key] = mapValueToLocator(provided[key]);
    return prev;
  }, {});
}
const parseRule = (rule) => {
  let params = [];
  const name = rule.split(":")[0];
  if (rule.includes(":")) {
    params = rule.split(":").slice(1).join(":").split(",");
  }
  return { name, params };
};
function createLocator(value) {
  const locator = (crossTable) => {
    const val = getFromPath(crossTable, value) || crossTable[value];
    return val;
  };
  locator.__locatorRef = value;
  return locator;
}
function extractLocators(params) {
  if (Array.isArray(params)) {
    return params.filter(isLocator);
  }
  return keysOf(params).filter((key) => isLocator(params[key])).map((key) => params[key]);
}
const DEFAULT_CONFIG = {
  generateMessage: ({ field }) => `${field} is not valid.`,
  bails: true,
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true
};
let currentConfig = Object.assign({}, DEFAULT_CONFIG);
const getConfig = () => currentConfig;
async function validate(value, rules, options = {}) {
  const shouldBail = options === null || options === void 0 ? void 0 : options.bails;
  const field = {
    name: (options === null || options === void 0 ? void 0 : options.name) || "{field}",
    rules,
    bails: shouldBail !== null && shouldBail !== void 0 ? shouldBail : true,
    formData: (options === null || options === void 0 ? void 0 : options.values) || {}
  };
  const result = await _validate(field, value);
  const errors = result.errors;
  return {
    errors,
    valid: !errors.length
  };
}
async function _validate(field, value) {
  if (isYupValidator(field.rules)) {
    return validateFieldWithYup(value, field.rules, { bails: field.bails });
  }
  if (isCallable(field.rules)) {
    const ctx = {
      field: field.name,
      form: field.formData,
      value
    };
    const result = await field.rules(value, ctx);
    const isValid = typeof result !== "string" && result;
    const message = typeof result === "string" ? result : _generateFieldError(ctx);
    return {
      errors: !isValid ? [message] : []
    };
  }
  const normalizedContext = Object.assign(Object.assign({}, field), { rules: normalizeRules(field.rules) });
  const errors = [];
  const rulesKeys = Object.keys(normalizedContext.rules);
  const length = rulesKeys.length;
  for (let i = 0; i < length; i++) {
    const rule = rulesKeys[i];
    const result = await _test(normalizedContext, value, {
      name: rule,
      params: normalizedContext.rules[rule]
    });
    if (result.error) {
      errors.push(result.error);
      if (field.bails) {
        return {
          errors
        };
      }
    }
  }
  return {
    errors
  };
}
async function validateFieldWithYup(value, validator, opts) {
  var _a;
  const errors = await validator.validate(value, {
    abortEarly: (_a = opts.bails) !== null && _a !== void 0 ? _a : true
  }).then(() => []).catch((err) => {
    if (err.name === "ValidationError") {
      return err.errors;
    }
    throw err;
  });
  return {
    errors
  };
}
async function _test(field, value, rule) {
  const validator = resolveRule(rule.name);
  if (!validator) {
    throw new Error(`No such validator '${rule.name}' exists.`);
  }
  const params = fillTargetValues(rule.params, field.formData);
  const ctx = {
    field: field.name,
    value,
    form: field.formData,
    rule: Object.assign(Object.assign({}, rule), { params })
  };
  const result = await validator(value, params, ctx);
  if (typeof result === "string") {
    return {
      error: result
    };
  }
  return {
    error: result ? void 0 : _generateFieldError(ctx)
  };
}
function _generateFieldError(fieldCtx) {
  const message = getConfig().generateMessage;
  if (!message) {
    return "Field is invalid";
  }
  return message(fieldCtx);
}
function fillTargetValues(params, crossTable) {
  const normalize = (value) => {
    if (isLocator(value)) {
      return value(crossTable);
    }
    return value;
  };
  if (Array.isArray(params)) {
    return params.map(normalize);
  }
  return Object.keys(params).reduce((acc, param) => {
    acc[param] = normalize(params[param]);
    return acc;
  }, {});
}
async function validateYupSchema(schema, values) {
  const errorObjects = await schema.validate(values, { abortEarly: false }).then(() => []).catch((err) => {
    if (err.name !== "ValidationError") {
      throw err;
    }
    return err.inner || [];
  });
  const results = {};
  const errors = {};
  for (const error of errorObjects) {
    const messages = error.errors;
    results[error.path] = { valid: !messages.length, errors: messages };
    if (messages.length) {
      errors[error.path] = messages[0];
    }
  }
  return {
    valid: !errorObjects.length,
    results,
    errors
  };
}
async function validateObjectSchema(schema, values, opts) {
  const paths = keysOf(schema);
  const validations = paths.map(async (path) => {
    var _a, _b, _c;
    const fieldResult = await validate(getFromPath(values, path), schema[path], {
      name: ((_a = opts === null || opts === void 0 ? void 0 : opts.names) === null || _a === void 0 ? void 0 : _a[path]) || path,
      values,
      bails: (_c = (_b = opts === null || opts === void 0 ? void 0 : opts.bailsMap) === null || _b === void 0 ? void 0 : _b[path]) !== null && _c !== void 0 ? _c : true
    });
    return Object.assign(Object.assign({}, fieldResult), { path });
  });
  let isAllValid = true;
  const validationResults = await Promise.all(validations);
  const results = {};
  const errors = {};
  for (const result of validationResults) {
    results[result.path] = {
      valid: result.valid,
      errors: result.errors
    };
    if (!result.valid) {
      isAllValid = false;
      errors[result.path] = result.errors[0];
    }
  }
  return {
    valid: isAllValid,
    results,
    errors
  };
}
function set$2(obj, key, val) {
  if (typeof val.value === "object")
    val.value = klona(val.value);
  if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === "__proto__") {
    Object.defineProperty(obj, key, val);
  } else
    obj[key] = val.value;
}
function klona(x) {
  if (typeof x !== "object")
    return x;
  var i = 0, k, list, tmp, str = Object.prototype.toString.call(x);
  if (str === "[object Object]") {
    tmp = Object.create(x.__proto__ || null);
  } else if (str === "[object Array]") {
    tmp = Array(x.length);
  } else if (str === "[object Set]") {
    tmp = new Set();
    x.forEach(function(val) {
      tmp.add(klona(val));
    });
  } else if (str === "[object Map]") {
    tmp = new Map();
    x.forEach(function(val, key) {
      tmp.set(klona(key), klona(val));
    });
  } else if (str === "[object Date]") {
    tmp = new Date(+x);
  } else if (str === "[object RegExp]") {
    tmp = new RegExp(x.source, x.flags);
  } else if (str === "[object DataView]") {
    tmp = new x.constructor(klona(x.buffer));
  } else if (str === "[object ArrayBuffer]") {
    tmp = x.slice(0);
  } else if (str.slice(-6) === "Array]") {
    tmp = new x.constructor(x);
  }
  if (tmp) {
    for (list = Object.getOwnPropertySymbols(x); i < list.length; i++) {
      set$2(tmp, list[i], Object.getOwnPropertyDescriptor(x, list[i]));
    }
    for (i = 0, list = Object.getOwnPropertyNames(x); i < list.length; i++) {
      if (Object.hasOwnProperty.call(tmp, k = list[i]) && tmp[k] === x[k])
        continue;
      set$2(tmp, k, Object.getOwnPropertyDescriptor(x, k));
    }
  }
  return tmp || x;
}
var es6 = function equal(a, b) {
  if (a === b)
    return true;
  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor)
      return false;
    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length)
        return false;
      for (i = length; i-- !== 0; )
        if (!equal(a[i], b[i]))
          return false;
      return true;
    }
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size)
        return false;
      for (i of a.entries())
        if (!b.has(i[0]))
          return false;
      for (i of a.entries())
        if (!equal(i[1], b.get(i[0])))
          return false;
      return true;
    }
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size)
        return false;
      for (i of a.entries())
        if (!b.has(i[0]))
          return false;
      return true;
    }
    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length)
        return false;
      for (i = length; i-- !== 0; )
        if (a[i] !== b[i])
          return false;
      return true;
    }
    if (a.constructor === RegExp)
      return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf)
      return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString)
      return a.toString() === b.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length)
      return false;
    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
        return false;
    for (i = length; i-- !== 0; ) {
      var key = keys[i];
      if (!equal(a[key], b[key]))
        return false;
    }
    return true;
  }
  return a !== a && b !== b;
};
let ID_COUNTER = 0;
function useFieldState(path, init) {
  const { value, initialValue, setInitialValue } = _useFieldValue(path, init.modelValue, !init.standalone);
  const { errorMessage, errors, setErrors } = _useFieldErrors(path, !init.standalone);
  const meta = _useFieldMeta(value, initialValue, errors);
  const id = ID_COUNTER >= Number.MAX_SAFE_INTEGER ? 0 : ++ID_COUNTER;
  function setState(state) {
    var _a;
    if ("value" in state) {
      value.value = state.value;
    }
    if ("errors" in state) {
      setErrors(state.errors);
    }
    if ("touched" in state) {
      meta.touched = (_a = state.touched) !== null && _a !== void 0 ? _a : meta.touched;
    }
    if ("initialValue" in state) {
      setInitialValue(state.initialValue);
    }
  }
  return {
    id,
    path,
    value,
    initialValue,
    meta,
    errors,
    errorMessage,
    setState
  };
}
function _useFieldValue(path, modelValue, shouldInjectForm) {
  const form = shouldInjectForm ? injectWithSelf(FormContextKey, void 0) : void 0;
  const modelRef = ref$1(unref$1(modelValue));
  function resolveInitialValue2() {
    if (!form) {
      return unref$1(modelRef);
    }
    return getFromPath(form.meta.value.initialValues, unref$1(path), unref$1(modelRef));
  }
  function setInitialValue(value2) {
    if (!form) {
      modelRef.value = value2;
      return;
    }
    form.setFieldInitialValue(unref$1(path), value2);
  }
  const initialValue = computed(resolveInitialValue2);
  if (!form) {
    const value2 = ref$1(resolveInitialValue2());
    return {
      value: value2,
      initialValue,
      setInitialValue
    };
  }
  const currentValue = modelValue ? unref$1(modelValue) : getFromPath(form.values, unref$1(path), unref$1(initialValue));
  form.stageInitialValue(unref$1(path), currentValue);
  const value = computed({
    get() {
      return getFromPath(form.values, unref$1(path));
    },
    set(newVal) {
      form.setFieldValue(unref$1(path), newVal);
    }
  });
  return {
    value,
    initialValue,
    setInitialValue
  };
}
function _useFieldMeta(currentValue, initialValue, errors) {
  const meta = reactive$1({
    touched: false,
    pending: false,
    valid: true,
    validated: !!unref$1(errors).length,
    initialValue: computed(() => unref$1(initialValue)),
    dirty: computed(() => {
      return !es6(unref$1(currentValue), unref$1(initialValue));
    })
  });
  watch$1(errors, (value) => {
    meta.valid = !value.length;
  }, {
    immediate: true,
    flush: "sync"
  });
  return meta;
}
function _useFieldErrors(path, shouldInjectForm) {
  const form = shouldInjectForm ? injectWithSelf(FormContextKey, void 0) : void 0;
  function normalizeErrors(messages) {
    if (!messages) {
      return [];
    }
    return Array.isArray(messages) ? messages : [messages];
  }
  if (!form) {
    const errors2 = ref$1([]);
    return {
      errors: errors2,
      errorMessage: computed(() => errors2.value[0]),
      setErrors: (messages) => {
        errors2.value = normalizeErrors(messages);
      }
    };
  }
  const errors = computed(() => form.errorBag.value[unref$1(path)] || []);
  return {
    errors,
    errorMessage: computed(() => errors.value[0]),
    setErrors: (messages) => {
      form.setFieldErrorBag(unref$1(path), normalizeErrors(messages));
    }
  };
}
function useField(name, rules, opts) {
  if (hasCheckedAttr(opts === null || opts === void 0 ? void 0 : opts.type)) {
    return useCheckboxField(name, rules, opts);
  }
  return _useField(name, rules, opts);
}
function _useField(name, rules, opts) {
  const { initialValue: modelValue, validateOnMount, bails, type, checkedValue, label, validateOnValueUpdate, uncheckedValue, standalone } = normalizeOptions(unref$1(name), opts);
  const form = !standalone ? injectWithSelf(FormContextKey) : void 0;
  const { id, value, initialValue, meta, setState, errors, errorMessage } = useFieldState(name, {
    modelValue,
    standalone
  });
  const handleBlur = () => {
    meta.touched = true;
  };
  const normalizedRules = computed(() => {
    let rulesValue = unref$1(rules);
    const schema = unref$1(form === null || form === void 0 ? void 0 : form.schema);
    if (schema && !isYupValidator(schema)) {
      rulesValue = extractRuleFromSchema(schema, unref$1(name)) || rulesValue;
    }
    if (isYupValidator(rulesValue) || isCallable(rulesValue)) {
      return rulesValue;
    }
    return normalizeRules(rulesValue);
  });
  async function validateCurrentValue(mode) {
    var _a, _b;
    if (form === null || form === void 0 ? void 0 : form.validateSchema) {
      return (_a = (await form.validateSchema(mode)).results[unref$1(name)]) !== null && _a !== void 0 ? _a : { valid: true, errors: [] };
    }
    return validate(value.value, normalizedRules.value, {
      name: unref$1(label) || unref$1(name),
      values: (_b = form === null || form === void 0 ? void 0 : form.values) !== null && _b !== void 0 ? _b : {},
      bails
    });
  }
  async function validateWithStateMutation() {
    meta.pending = true;
    meta.validated = true;
    const result = await validateCurrentValue("validated-only");
    setState({ errors: result.errors });
    meta.pending = false;
    return result;
  }
  async function validateValidStateOnly() {
    const result = await validateCurrentValue("silent");
    meta.valid = result.valid;
    return result;
  }
  function validate$1(opts2) {
    if (!(opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) || (opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) === "force") {
      return validateWithStateMutation();
    }
    if ((opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) === "validated-only") {
      return validateWithStateMutation();
    }
    return validateValidStateOnly();
  }
  const handleChange = (e, shouldValidate = true) => {
    const newValue = normalizeEventValue(e);
    value.value = newValue;
    if (!validateOnValueUpdate && shouldValidate) {
      validateWithStateMutation();
    }
  };
  onMounted(() => {
    if (validateOnMount) {
      return validateWithStateMutation();
    }
    if (!form || !form.validateSchema) {
      validateValidStateOnly();
    }
  });
  function setTouched(isTouched) {
    meta.touched = isTouched;
  }
  let unwatchValue;
  function watchValue() {
    unwatchValue = watch$1(value, validateOnValueUpdate ? validateWithStateMutation : validateValidStateOnly, {
      deep: true
    });
  }
  watchValue();
  function resetField(state) {
    var _a;
    unwatchValue === null || unwatchValue === void 0 ? void 0 : unwatchValue();
    const newValue = state && "value" in state ? state.value : initialValue.value;
    setState({
      value: klona(newValue),
      initialValue: klona(newValue),
      touched: (_a = state === null || state === void 0 ? void 0 : state.touched) !== null && _a !== void 0 ? _a : false,
      errors: (state === null || state === void 0 ? void 0 : state.errors) || []
    });
    meta.pending = false;
    meta.validated = false;
    validateValidStateOnly();
    nextTick$1(() => {
      watchValue();
    });
  }
  function setValue(newValue) {
    value.value = newValue;
  }
  function setErrors(errors2) {
    setState({ errors: Array.isArray(errors2) ? errors2 : [errors2] });
  }
  const field = {
    id,
    name,
    label,
    value,
    meta,
    errors,
    errorMessage,
    type,
    checkedValue,
    uncheckedValue,
    bails,
    resetField,
    handleReset: () => resetField(),
    validate: validate$1,
    handleChange,
    handleBlur,
    setState,
    setTouched,
    setErrors,
    setValue
  };
  provide(FieldContextKey, field);
  if (isRef$1(rules) && typeof unref$1(rules) !== "function") {
    watch$1(rules, (value2, oldValue) => {
      if (es6(value2, oldValue)) {
        return;
      }
      meta.validated ? validateWithStateMutation() : validateValidStateOnly();
    }, {
      deep: true
    });
  }
  if (!form) {
    return field;
  }
  form.register(field);
  onBeforeUnmount(() => {
    form.unregister(field);
  });
  const dependencies = computed(() => {
    const rulesVal = normalizedRules.value;
    if (!rulesVal || isCallable(rulesVal) || isYupValidator(rulesVal)) {
      return {};
    }
    return Object.keys(rulesVal).reduce((acc, rule) => {
      const deps = extractLocators(rulesVal[rule]).map((dep) => dep.__locatorRef).reduce((depAcc, depName) => {
        const depValue = getFromPath(form.values, depName) || form.values[depName];
        if (depValue !== void 0) {
          depAcc[depName] = depValue;
        }
        return depAcc;
      }, {});
      Object.assign(acc, deps);
      return acc;
    }, {});
  });
  watch$1(dependencies, (deps, oldDeps) => {
    if (!Object.keys(deps).length) {
      return;
    }
    const shouldValidate = !es6(deps, oldDeps);
    if (shouldValidate) {
      meta.validated ? validateWithStateMutation() : validateValidStateOnly();
    }
  });
  return field;
}
function normalizeOptions(name, opts) {
  const defaults = () => ({
    initialValue: void 0,
    validateOnMount: false,
    bails: true,
    rules: "",
    label: name,
    validateOnValueUpdate: true,
    standalone: false
  });
  if (!opts) {
    return defaults();
  }
  const checkedValue = "valueProp" in opts ? opts.valueProp : opts.checkedValue;
  return Object.assign(Object.assign(Object.assign({}, defaults()), opts || {}), { checkedValue });
}
function extractRuleFromSchema(schema, fieldName) {
  if (!schema) {
    return void 0;
  }
  return schema[fieldName];
}
function useCheckboxField(name, rules, opts) {
  const form = !(opts === null || opts === void 0 ? void 0 : opts.standalone) ? injectWithSelf(FormContextKey) : void 0;
  const checkedValue = opts === null || opts === void 0 ? void 0 : opts.checkedValue;
  const uncheckedValue = opts === null || opts === void 0 ? void 0 : opts.uncheckedValue;
  function patchCheckboxApi(field) {
    const handleChange = field.handleChange;
    const checked = computed(() => {
      const currentValue = unref$1(field.value);
      const checkedVal = unref$1(checkedValue);
      return Array.isArray(currentValue) ? currentValue.includes(checkedVal) : checkedVal === currentValue;
    });
    function handleCheckboxChange(e, shouldValidate = true) {
      var _a, _b;
      if (checked.value === ((_b = (_a = e) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.checked)) {
        return;
      }
      let newValue = normalizeEventValue(e);
      if (!form) {
        newValue = resolveNextCheckboxValue(unref$1(field.value), unref$1(checkedValue), unref$1(uncheckedValue));
      }
      handleChange(newValue, shouldValidate);
    }
    onBeforeUnmount(() => {
      if (checked.value) {
        handleCheckboxChange(unref$1(checkedValue), false);
      }
    });
    return Object.assign(Object.assign({}, field), {
      checked,
      checkedValue,
      uncheckedValue,
      handleChange: handleCheckboxChange
    });
  }
  return patchCheckboxApi(_useField(name, rules, opts));
}
defineComponent$1({
  name: "Field",
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object],
      default: void 0
    },
    name: {
      type: String,
      required: true
    },
    rules: {
      type: [Object, String, Function],
      default: void 0
    },
    validateOnMount: {
      type: Boolean,
      default: false
    },
    validateOnBlur: {
      type: Boolean,
      default: void 0
    },
    validateOnChange: {
      type: Boolean,
      default: void 0
    },
    validateOnInput: {
      type: Boolean,
      default: void 0
    },
    validateOnModelUpdate: {
      type: Boolean,
      default: void 0
    },
    bails: {
      type: Boolean,
      default: () => getConfig().bails
    },
    label: {
      type: String,
      default: void 0
    },
    uncheckedValue: {
      type: null,
      default: void 0
    },
    modelValue: {
      type: null,
      default: IS_ABSENT
    },
    modelModifiers: {
      type: null,
      default: () => ({})
    },
    "onUpdate:modelValue": {
      type: null,
      default: void 0
    },
    standalone: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const rules = toRef(props, "rules");
    const name = toRef(props, "name");
    const label = toRef(props, "label");
    const uncheckedValue = toRef(props, "uncheckedValue");
    const hasModelEvents = isPropPresent(props, "onUpdate:modelValue");
    const { errors, value, errorMessage, validate: validateField, handleChange, handleBlur, setTouched, resetField, handleReset, meta, checked, setErrors } = useField(name, rules, {
      validateOnMount: props.validateOnMount,
      bails: props.bails,
      standalone: props.standalone,
      type: ctx.attrs.type,
      initialValue: resolveInitialValue(props, ctx),
      checkedValue: ctx.attrs.value,
      uncheckedValue,
      label,
      validateOnValueUpdate: false
    });
    const onChangeHandler = hasModelEvents ? function handleChangeWithModel(e, shouldValidate = true) {
      handleChange(e, shouldValidate);
      ctx.emit("update:modelValue", value.value);
    } : handleChange;
    const handleInput = (e) => {
      if (!hasCheckedAttr(ctx.attrs.type)) {
        value.value = normalizeEventValue(e);
      }
    };
    const onInputHandler = hasModelEvents ? function handleInputWithModel(e) {
      handleInput(e);
      ctx.emit("update:modelValue", value.value);
    } : handleInput;
    const fieldProps = computed(() => {
      const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = resolveValidationTriggers(props);
      const baseOnBlur = [handleBlur, ctx.attrs.onBlur, validateOnBlur ? validateField : void 0].filter(Boolean);
      const baseOnInput = [(e) => onChangeHandler(e, validateOnInput), ctx.attrs.onInput].filter(Boolean);
      const baseOnChange = [(e) => onChangeHandler(e, validateOnChange), ctx.attrs.onChange].filter(Boolean);
      const attrs = {
        name: props.name,
        onBlur: baseOnBlur,
        onInput: baseOnInput,
        onChange: baseOnChange
      };
      if (validateOnModelUpdate) {
        attrs["onUpdate:modelValue"] = [onChangeHandler];
      }
      if (hasCheckedAttr(ctx.attrs.type) && checked) {
        attrs.checked = checked.value;
      } else {
        attrs.value = value.value;
      }
      const tag = resolveTag(props, ctx);
      if (shouldHaveValueBinding(tag, ctx.attrs)) {
        delete attrs.value;
      }
      return attrs;
    });
    const modelValue = toRef(props, "modelValue");
    watch$1(modelValue, (newModelValue) => {
      if (newModelValue === IS_ABSENT && value.value === void 0) {
        return;
      }
      if (newModelValue !== applyModifiers(value.value, props.modelModifiers)) {
        value.value = newModelValue === IS_ABSENT ? void 0 : newModelValue;
        validateField();
      }
    });
    function slotProps() {
      return {
        field: fieldProps.value,
        value: value.value,
        meta,
        errors: errors.value,
        errorMessage: errorMessage.value,
        validate: validateField,
        resetField,
        handleChange: onChangeHandler,
        handleInput: onInputHandler,
        handleReset,
        handleBlur,
        setTouched,
        setErrors
      };
    }
    ctx.expose({
      setErrors,
      setTouched,
      reset: resetField,
      validate: validateField,
      handleChange
    });
    return () => {
      const tag = resolveDynamicComponent(resolveTag(props, ctx));
      const children = normalizeChildren(tag, ctx, slotProps);
      if (tag) {
        return h(tag, Object.assign(Object.assign({}, ctx.attrs), fieldProps.value), children);
      }
      return children;
    };
  }
});
function resolveTag(props, ctx) {
  let tag = props.as || "";
  if (!props.as && !ctx.slots.default) {
    tag = "input";
  }
  return tag;
}
function resolveValidationTriggers(props) {
  var _a, _b, _c, _d;
  const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = getConfig();
  return {
    validateOnInput: (_a = props.validateOnInput) !== null && _a !== void 0 ? _a : validateOnInput,
    validateOnChange: (_b = props.validateOnChange) !== null && _b !== void 0 ? _b : validateOnChange,
    validateOnBlur: (_c = props.validateOnBlur) !== null && _c !== void 0 ? _c : validateOnBlur,
    validateOnModelUpdate: (_d = props.validateOnModelUpdate) !== null && _d !== void 0 ? _d : validateOnModelUpdate
  };
}
function applyModifiers(value, modifiers) {
  if (modifiers.number) {
    return toNumber(value);
  }
  return value;
}
function resolveInitialValue(props, ctx) {
  if (!hasCheckedAttr(ctx.attrs.type)) {
    return isPropPresent(props, "modelValue") ? props.modelValue : ctx.attrs.value;
  }
  return isPropPresent(props, "modelValue") ? props.modelValue : void 0;
}
let FORM_COUNTER = 0;
function useForm(opts) {
  const formId = FORM_COUNTER++;
  const fieldsByPath = ref$1({});
  const isSubmitting = ref$1(false);
  const submitCount = ref$1(0);
  const fieldArraysLookup = {};
  const formValues = reactive$1(klona(unref$1(opts === null || opts === void 0 ? void 0 : opts.initialValues) || {}));
  const { errorBag, setErrorBag, setFieldErrorBag } = useErrorBag(opts === null || opts === void 0 ? void 0 : opts.initialErrors);
  const errors = computed(() => {
    return keysOf(errorBag.value).reduce((acc, key) => {
      const bag = errorBag.value[key];
      if (bag && bag.length) {
        acc[key] = bag[0];
      }
      return acc;
    }, {});
  });
  function getFirstFieldAtPath(path) {
    const fieldOrGroup = fieldsByPath.value[path];
    return Array.isArray(fieldOrGroup) ? fieldOrGroup[0] : fieldOrGroup;
  }
  function fieldExists(path) {
    return !!fieldsByPath.value[path];
  }
  const fieldNames = computed(() => {
    return keysOf(fieldsByPath.value).reduce((names, path) => {
      const field = getFirstFieldAtPath(path);
      if (field) {
        names[path] = unref$1(field.label || field.name) || "";
      }
      return names;
    }, {});
  });
  const fieldBailsMap = computed(() => {
    return keysOf(fieldsByPath.value).reduce((map, path) => {
      var _a;
      const field = getFirstFieldAtPath(path);
      if (field) {
        map[path] = (_a = field.bails) !== null && _a !== void 0 ? _a : true;
      }
      return map;
    }, {});
  });
  const initialErrors = Object.assign({}, (opts === null || opts === void 0 ? void 0 : opts.initialErrors) || {});
  const { initialValues, originalInitialValues, setInitialValues } = useFormInitialValues(fieldsByPath, formValues, opts === null || opts === void 0 ? void 0 : opts.initialValues);
  const meta = useFormMeta(fieldsByPath, formValues, initialValues, errors);
  const schema = opts === null || opts === void 0 ? void 0 : opts.validationSchema;
  const formCtx = {
    formId,
    fieldsByPath,
    values: formValues,
    errorBag,
    errors,
    schema,
    submitCount,
    meta,
    isSubmitting,
    fieldArraysLookup,
    validateSchema: unref$1(schema) ? validateSchema : void 0,
    validate: validate2,
    register: registerField,
    unregister: unregisterField,
    setFieldErrorBag,
    validateField,
    setFieldValue,
    setValues,
    setErrors,
    setFieldError,
    setFieldTouched,
    setTouched,
    resetForm,
    handleSubmit,
    stageInitialValue,
    unsetInitialValue,
    setFieldInitialValue
  };
  function isFieldGroup(fieldOrGroup) {
    return Array.isArray(fieldOrGroup);
  }
  function applyFieldMutation(fieldOrGroup, mutation) {
    if (Array.isArray(fieldOrGroup)) {
      return fieldOrGroup.forEach(mutation);
    }
    return mutation(fieldOrGroup);
  }
  function setFieldError(field, message) {
    setFieldErrorBag(field, message);
  }
  function setErrors(fields) {
    setErrorBag(fields);
  }
  function setFieldValue(field, value, { force } = { force: false }) {
    var _a;
    const fieldInstance = fieldsByPath.value[field];
    const clonedValue = klona(value);
    if (!fieldInstance) {
      setInPath(formValues, field, clonedValue);
      return;
    }
    if (isFieldGroup(fieldInstance) && ((_a = fieldInstance[0]) === null || _a === void 0 ? void 0 : _a.type) === "checkbox" && !Array.isArray(value)) {
      const newValue2 = klona(resolveNextCheckboxValue(getFromPath(formValues, field) || [], value, void 0));
      setInPath(formValues, field, newValue2);
      return;
    }
    let newValue = value;
    if (!isFieldGroup(fieldInstance) && fieldInstance.type === "checkbox" && !force) {
      newValue = klona(resolveNextCheckboxValue(getFromPath(formValues, field), value, unref$1(fieldInstance.uncheckedValue)));
    }
    setInPath(formValues, field, newValue);
  }
  function setValues(fields) {
    keysOf(formValues).forEach((key) => {
      delete formValues[key];
    });
    keysOf(fields).forEach((path) => {
      setFieldValue(path, fields[path]);
    });
    Object.values(fieldArraysLookup).forEach((f) => f && f.reset());
  }
  function setFieldTouched(field, isTouched) {
    const fieldInstance = fieldsByPath.value[field];
    if (fieldInstance) {
      applyFieldMutation(fieldInstance, (f) => f.setTouched(isTouched));
    }
  }
  function setTouched(fields) {
    keysOf(fields).forEach((field) => {
      setFieldTouched(field, !!fields[field]);
    });
  }
  function resetForm(state) {
    if (state === null || state === void 0 ? void 0 : state.values) {
      setInitialValues(state.values);
      setValues(state === null || state === void 0 ? void 0 : state.values);
    } else {
      setInitialValues(originalInitialValues.value);
      setValues(originalInitialValues.value);
    }
    Object.values(fieldsByPath.value).forEach((field) => {
      if (!field) {
        return;
      }
      applyFieldMutation(field, (f) => f.resetField());
    });
    if (state === null || state === void 0 ? void 0 : state.touched) {
      setTouched(state.touched);
    }
    setErrors((state === null || state === void 0 ? void 0 : state.errors) || {});
    submitCount.value = (state === null || state === void 0 ? void 0 : state.submitCount) || 0;
  }
  function insertFieldAtPath(field, path) {
    const rawField = markRaw$1(field);
    const fieldPath = path;
    if (!fieldsByPath.value[fieldPath]) {
      fieldsByPath.value[fieldPath] = rawField;
      return;
    }
    const fieldAtPath = fieldsByPath.value[fieldPath];
    if (fieldAtPath && !Array.isArray(fieldAtPath)) {
      fieldsByPath.value[fieldPath] = [fieldAtPath];
    }
    fieldsByPath.value[fieldPath] = [...fieldsByPath.value[fieldPath], rawField];
  }
  function removeFieldFromPath(field, path) {
    const fieldPath = path;
    const fieldAtPath = fieldsByPath.value[fieldPath];
    if (!fieldAtPath) {
      return;
    }
    if (!isFieldGroup(fieldAtPath) && field.id === fieldAtPath.id) {
      delete fieldsByPath.value[fieldPath];
      return;
    }
    if (isFieldGroup(fieldAtPath)) {
      const idx = fieldAtPath.findIndex((f) => f.id === field.id);
      if (idx === -1) {
        return;
      }
      fieldAtPath.splice(idx, 1);
      if (fieldAtPath.length === 1) {
        fieldsByPath.value[fieldPath] = fieldAtPath[0];
        return;
      }
      if (!fieldAtPath.length) {
        delete fieldsByPath.value[fieldPath];
      }
    }
  }
  function registerField(field) {
    const fieldPath = unref$1(field.name);
    insertFieldAtPath(field, fieldPath);
    if (isRef$1(field.name)) {
      watch$1(field.name, async (newPath, oldPath) => {
        await nextTick$1();
        removeFieldFromPath(field, oldPath);
        insertFieldAtPath(field, newPath);
        if (errors.value[oldPath] || errors.value[newPath]) {
          validateField(newPath);
        }
        await nextTick$1();
        if (!fieldExists(oldPath)) {
          unsetPath(formValues, oldPath);
        }
      });
    }
    const initialErrorMessage = unref$1(field.errorMessage);
    if (initialErrorMessage && (initialErrors === null || initialErrors === void 0 ? void 0 : initialErrors[fieldPath]) !== initialErrorMessage) {
      validateField(fieldPath);
    }
    delete initialErrors[fieldPath];
  }
  function unregisterField(field) {
    const fieldName = unref$1(field.name);
    removeFieldFromPath(field, fieldName);
    nextTick$1(() => {
      if (!fieldExists(fieldName)) {
        setFieldError(fieldName, void 0);
        unsetPath(formValues, fieldName);
      }
    });
  }
  async function validate2(opts2) {
    if (formCtx.validateSchema) {
      return formCtx.validateSchema((opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) || "force");
    }
    const validations = await Promise.all(Object.values(fieldsByPath.value).map((field) => {
      const fieldInstance = Array.isArray(field) ? field[0] : field;
      if (!fieldInstance) {
        return Promise.resolve({ key: "", valid: true, errors: [] });
      }
      return fieldInstance.validate(opts2).then((result) => {
        return {
          key: unref$1(fieldInstance.name),
          valid: result.valid,
          errors: result.errors
        };
      });
    }));
    const results = {};
    const errors2 = {};
    for (const validation of validations) {
      results[validation.key] = {
        valid: validation.valid,
        errors: validation.errors
      };
      if (validation.errors.length) {
        errors2[validation.key] = validation.errors[0];
      }
    }
    return {
      valid: validations.every((r) => r.valid),
      results,
      errors: errors2
    };
  }
  async function validateField(field) {
    const fieldInstance = fieldsByPath.value[field];
    if (!fieldInstance) {
      warn$1(`field with name ${field} was not found`);
      return Promise.resolve({ errors: [], valid: true });
    }
    if (Array.isArray(fieldInstance)) {
      return fieldInstance.map((f) => f.validate())[0];
    }
    return fieldInstance.validate();
  }
  function handleSubmit(fn, onValidationError) {
    return function submissionHandler(e) {
      if (e instanceof Event) {
        e.preventDefault();
        e.stopPropagation();
      }
      setTouched(keysOf(fieldsByPath.value).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {}));
      isSubmitting.value = true;
      submitCount.value++;
      return validate2().then((result) => {
        if (result.valid && typeof fn === "function") {
          return fn(klona(formValues), {
            evt: e,
            setErrors,
            setFieldError,
            setTouched,
            setFieldTouched,
            setValues,
            setFieldValue,
            resetForm
          });
        }
        if (!result.valid && typeof onValidationError === "function") {
          onValidationError({
            values: klona(formValues),
            evt: e,
            errors: result.errors,
            results: result.results
          });
        }
      }).then((returnVal) => {
        isSubmitting.value = false;
        return returnVal;
      }, (err) => {
        isSubmitting.value = false;
        throw err;
      });
    };
  }
  function setFieldInitialValue(path, value) {
    setInPath(initialValues.value, path, klona(value));
  }
  function unsetInitialValue(path) {
    unsetPath(initialValues.value, path);
  }
  function stageInitialValue(path, value) {
    setInPath(formValues, path, value);
    setFieldInitialValue(path, value);
  }
  async function _validateSchema() {
    const schemaValue = unref$1(schema);
    if (!schemaValue) {
      return { valid: true, results: {}, errors: {} };
    }
    const formResult = isYupValidator(schemaValue) ? await validateYupSchema(schemaValue, formValues) : await validateObjectSchema(schemaValue, formValues, {
      names: fieldNames.value,
      bailsMap: fieldBailsMap.value
    });
    return formResult;
  }
  const debouncedSchemaValidation = debounceAsync(_validateSchema, 5);
  async function validateSchema(mode) {
    const formResult = await debouncedSchemaValidation();
    const fieldsById = formCtx.fieldsByPath.value || {};
    const currentErrorsPaths = keysOf(formCtx.errorBag.value);
    const paths = [
      ...new Set([...keysOf(formResult.results), ...keysOf(fieldsById), ...currentErrorsPaths])
    ];
    return paths.reduce((validation, path) => {
      const field = fieldsById[path];
      const messages = (formResult.results[path] || { errors: [] }).errors;
      const fieldResult = {
        errors: messages,
        valid: !messages.length
      };
      validation.results[path] = fieldResult;
      if (!fieldResult.valid) {
        validation.errors[path] = fieldResult.errors[0];
      }
      if (!field) {
        setFieldError(path, messages);
        return validation;
      }
      applyFieldMutation(field, (f) => f.meta.valid = fieldResult.valid);
      if (mode === "silent") {
        return validation;
      }
      const wasValidated = Array.isArray(field) ? field.some((f) => f.meta.validated) : field.meta.validated;
      if (mode === "validated-only" && !wasValidated) {
        return validation;
      }
      applyFieldMutation(field, (f) => f.setState({ errors: fieldResult.errors }));
      return validation;
    }, { valid: formResult.valid, results: {}, errors: {} });
  }
  const submitForm = handleSubmit((_, { evt }) => {
    if (isFormSubmitEvent(evt)) {
      evt.target.submit();
    }
  });
  onMounted(() => {
    if (opts === null || opts === void 0 ? void 0 : opts.initialErrors) {
      setErrors(opts.initialErrors);
    }
    if (opts === null || opts === void 0 ? void 0 : opts.initialTouched) {
      setTouched(opts.initialTouched);
    }
    if (opts === null || opts === void 0 ? void 0 : opts.validateOnMount) {
      validate2();
      return;
    }
    if (formCtx.validateSchema) {
      formCtx.validateSchema("silent");
    }
  });
  if (isRef$1(schema)) {
    watch$1(schema, () => {
      var _a;
      (_a = formCtx.validateSchema) === null || _a === void 0 ? void 0 : _a.call(formCtx, "validated-only");
    });
  }
  provide(FormContextKey, formCtx);
  return {
    errors,
    meta,
    values: formValues,
    isSubmitting,
    submitCount,
    validate: validate2,
    validateField,
    handleReset: () => resetForm(),
    resetForm,
    handleSubmit,
    submitForm,
    setFieldError,
    setErrors,
    setFieldValue,
    setValues,
    setFieldTouched,
    setTouched
  };
}
function useFormMeta(fieldsByPath, currentValues, initialValues, errors) {
  const MERGE_STRATEGIES = {
    touched: "some",
    pending: "some",
    valid: "every"
  };
  const isDirty = computed(() => {
    return !es6(currentValues, unref$1(initialValues));
  });
  const flags = computed(() => {
    const fields = Object.values(fieldsByPath.value).flat(1).filter(Boolean);
    return keysOf(MERGE_STRATEGIES).reduce((acc, flag) => {
      const mergeMethod = MERGE_STRATEGIES[flag];
      acc[flag] = fields[mergeMethod]((field) => field.meta[flag]);
      return acc;
    }, {});
  });
  return computed(() => {
    return Object.assign(Object.assign({ initialValues: unref$1(initialValues) }, flags.value), { valid: flags.value.valid && !keysOf(errors.value).length, dirty: isDirty.value });
  });
}
function useFormInitialValues(fields, formValues, providedValues) {
  const initialValues = ref$1(klona(unref$1(providedValues)) || {});
  const originalInitialValues = ref$1(klona(unref$1(providedValues)) || {});
  function setInitialValues(values, updateFields = false) {
    initialValues.value = klona(values);
    originalInitialValues.value = klona(values);
    if (!updateFields) {
      return;
    }
    keysOf(fields.value).forEach((fieldPath) => {
      const field = fields.value[fieldPath];
      const wasTouched = Array.isArray(field) ? field.some((f) => f.meta.touched) : field === null || field === void 0 ? void 0 : field.meta.touched;
      if (!field || wasTouched) {
        return;
      }
      const newValue = getFromPath(initialValues.value, fieldPath);
      setInPath(formValues, fieldPath, klona(newValue));
    });
  }
  if (isRef$1(providedValues)) {
    watch$1(providedValues, (value) => {
      setInitialValues(value, true);
    }, {
      deep: true
    });
  }
  return {
    initialValues,
    originalInitialValues,
    setInitialValues
  };
}
function useErrorBag(initialErrors) {
  const errorBag = ref$1({});
  function normalizeErrorItem(message) {
    return Array.isArray(message) ? message : message ? [message] : [];
  }
  function setFieldErrorBag(field, message) {
    if (!message) {
      delete errorBag.value[field];
      return;
    }
    errorBag.value[field] = normalizeErrorItem(message);
  }
  function setErrorBag(fields) {
    errorBag.value = keysOf(fields).reduce((acc, key) => {
      const message = fields[key];
      if (message) {
        acc[key] = normalizeErrorItem(message);
      }
      return acc;
    }, {});
  }
  if (initialErrors) {
    setErrorBag(initialErrors);
  }
  return {
    errorBag,
    setErrorBag,
    setFieldErrorBag
  };
}
defineComponent$1({
  name: "Form",
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: "form"
    },
    validationSchema: {
      type: Object,
      default: void 0
    },
    initialValues: {
      type: Object,
      default: void 0
    },
    initialErrors: {
      type: Object,
      default: void 0
    },
    initialTouched: {
      type: Object,
      default: void 0
    },
    validateOnMount: {
      type: Boolean,
      default: false
    },
    onSubmit: {
      type: Function,
      default: void 0
    },
    onInvalidSubmit: {
      type: Function,
      default: void 0
    }
  },
  setup(props, ctx) {
    const initialValues = toRef(props, "initialValues");
    const validationSchema = toRef(props, "validationSchema");
    const { errors, values, meta, isSubmitting, submitCount, validate: validate2, validateField, handleReset, resetForm, handleSubmit, submitForm, setErrors, setFieldError, setFieldValue, setValues, setFieldTouched, setTouched } = useForm({
      validationSchema: validationSchema.value ? validationSchema : void 0,
      initialValues,
      initialErrors: props.initialErrors,
      initialTouched: props.initialTouched,
      validateOnMount: props.validateOnMount
    });
    const onSubmit = props.onSubmit ? handleSubmit(props.onSubmit, props.onInvalidSubmit) : submitForm;
    function handleFormReset(e) {
      if (isEvent(e)) {
        e.preventDefault();
      }
      handleReset();
      if (typeof ctx.attrs.onReset === "function") {
        ctx.attrs.onReset();
      }
    }
    function handleScopedSlotSubmit(evt, onSubmit2) {
      const onSuccess = typeof evt === "function" && !onSubmit2 ? evt : onSubmit2;
      return handleSubmit(onSuccess, props.onInvalidSubmit)(evt);
    }
    function slotProps() {
      return {
        meta: meta.value,
        errors: errors.value,
        values,
        isSubmitting: isSubmitting.value,
        submitCount: submitCount.value,
        validate: validate2,
        validateField,
        handleSubmit: handleScopedSlotSubmit,
        handleReset,
        submitForm,
        setErrors,
        setFieldError,
        setFieldValue,
        setValues,
        setFieldTouched,
        setTouched,
        resetForm
      };
    }
    ctx.expose({
      setFieldError,
      setErrors,
      setFieldValue,
      setValues,
      setFieldTouched,
      setTouched,
      resetForm,
      validate: validate2,
      validateField
    });
    return function renderForm() {
      const tag = props.as === "form" ? props.as : resolveDynamicComponent(props.as);
      const children = normalizeChildren(tag, ctx, slotProps);
      if (!props.as) {
        return children;
      }
      const formAttrs = props.as === "form" ? {
        novalidate: true
      } : {};
      return h(tag, Object.assign(Object.assign(Object.assign({}, formAttrs), ctx.attrs), { onSubmit, onReset: handleFormReset }), children);
    };
  }
});
let FIELD_ARRAY_COUNTER = 0;
function useFieldArray(arrayPath) {
  const id = FIELD_ARRAY_COUNTER++;
  const form = injectWithSelf(FormContextKey, void 0);
  const fields = ref$1([]);
  const noOp = () => {
  };
  const noOpApi = {
    fields: readonly$1(fields),
    remove: noOp,
    push: noOp,
    swap: noOp,
    insert: noOp,
    update: noOp,
    replace: noOp,
    prepend: noOp
  };
  if (!form) {
    warn("FieldArray requires being a child of `<Form/>` or `useForm` being called before it. Array fields may not work correctly");
    return noOpApi;
  }
  if (!unref$1(arrayPath)) {
    warn("FieldArray requires a field path to be provided, did you forget to pass the `name` prop?");
    return noOpApi;
  }
  let entryCounter = 0;
  function initFields() {
    const currentValues = getFromPath(form === null || form === void 0 ? void 0 : form.values, unref$1(arrayPath), []);
    fields.value = currentValues.map(createEntry);
    updateEntryFlags();
  }
  initFields();
  function updateEntryFlags() {
    const fieldsLength = fields.value.length;
    for (let i = 0; i < fieldsLength; i++) {
      const entry = fields.value[i];
      entry.isFirst = i === 0;
      entry.isLast = i === fieldsLength - 1;
    }
  }
  function createEntry(value) {
    const key = entryCounter++;
    const entry = {
      key,
      value: computed(() => {
        const currentValues = getFromPath(form === null || form === void 0 ? void 0 : form.values, unref$1(arrayPath), []);
        const idx = fields.value.findIndex((e) => e.key === key);
        return idx === -1 ? value : currentValues[idx];
      }),
      isFirst: false,
      isLast: false
    };
    return entry;
  }
  function remove2(idx) {
    const pathName = unref$1(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    if (!pathValue || !Array.isArray(pathValue)) {
      return;
    }
    const newValue = [...pathValue];
    newValue.splice(idx, 1);
    form === null || form === void 0 ? void 0 : form.unsetInitialValue(pathName + `[${idx}]`);
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
    fields.value.splice(idx, 1);
    updateEntryFlags();
  }
  function push(value) {
    const pathName = unref$1(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
    if (!Array.isArray(normalizedPathValue)) {
      return;
    }
    const newValue = [...normalizedPathValue];
    newValue.push(value);
    form === null || form === void 0 ? void 0 : form.stageInitialValue(pathName + `[${newValue.length - 1}]`, value);
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
    fields.value.push(createEntry(value));
    updateEntryFlags();
  }
  function swap(indexA, indexB) {
    const pathName = unref$1(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    if (!Array.isArray(pathValue) || !pathValue[indexA] || !pathValue[indexB]) {
      return;
    }
    const newValue = [...pathValue];
    const newFields = [...fields.value];
    const temp = newValue[indexA];
    newValue[indexA] = newValue[indexB];
    newValue[indexB] = temp;
    const tempEntry = newFields[indexA];
    newFields[indexA] = newFields[indexB];
    newFields[indexB] = tempEntry;
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
    fields.value = newFields;
    updateEntryFlags();
  }
  function insert(idx, value) {
    const pathName = unref$1(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    if (!Array.isArray(pathValue) || pathValue.length < idx) {
      return;
    }
    const newValue = [...pathValue];
    const newFields = [...fields.value];
    newValue.splice(idx, 0, value);
    newFields.splice(idx, 0, createEntry(value));
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
    fields.value = newFields;
    updateEntryFlags();
  }
  function replace(arr) {
    const pathName = unref$1(arrayPath);
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, arr);
    initFields();
  }
  function update(idx, value) {
    const pathName = unref$1(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    if (!Array.isArray(pathValue) || pathValue.length - 1 < idx) {
      return;
    }
    form === null || form === void 0 ? void 0 : form.setFieldValue(`${pathName}[${idx}]`, value);
  }
  function prepend(value) {
    const pathName = unref$1(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
    if (!Array.isArray(normalizedPathValue)) {
      return;
    }
    const newValue = [value, ...normalizedPathValue];
    form === null || form === void 0 ? void 0 : form.stageInitialValue(pathName + `[${newValue.length - 1}]`, value);
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
    fields.value.unshift(createEntry(value));
    updateEntryFlags();
  }
  form.fieldArraysLookup[id] = {
    reset: initFields
  };
  onBeforeUnmount(() => {
    delete form.fieldArraysLookup[id];
  });
  return {
    fields: readonly$1(fields),
    remove: remove2,
    push,
    swap,
    insert,
    update,
    replace,
    prepend
  };
}
defineComponent$1({
  name: "FieldArray",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props, ctx) {
    const { push, remove: remove2, swap, insert, replace, update, prepend, fields } = useFieldArray(toRef(props, "name"));
    function slotProps() {
      return {
        fields: fields.value,
        push,
        remove: remove2,
        swap,
        insert,
        update,
        replace,
        prepend
      };
    }
    ctx.expose({
      push,
      remove: remove2,
      swap,
      insert,
      update,
      replace,
      prepend
    });
    return () => {
      const children = normalizeChildren(void 0, ctx, slotProps);
      return children;
    };
  }
});
defineComponent$1({
  name: "ErrorMessage",
  props: {
    as: {
      type: String,
      default: void 0
    },
    name: {
      type: String,
      required: true
    }
  },
  setup(props, ctx) {
    const form = inject(FormContextKey, void 0);
    const message = computed(() => {
      return form === null || form === void 0 ? void 0 : form.errors.value[props.name];
    });
    function slotProps() {
      return {
        message: message.value
      };
    }
    return () => {
      if (!message.value) {
        return void 0;
      }
      const tag = props.as ? resolveDynamicComponent(props.as) : props.as;
      const children = normalizeChildren(tag, ctx, slotProps);
      const attrs = Object.assign({ role: "alert" }, ctx.attrs);
      if (!tag && (Array.isArray(children) || !children) && (children === null || children === void 0 ? void 0 : children.length)) {
        return children;
      }
      if ((Array.isArray(children) || !children) && !(children === null || children === void 0 ? void 0 : children.length)) {
        return h(tag || "span", attrs, message.value);
      }
      return h(tag, attrs, children);
    };
  }
});
var _export_sfc = (sfc, props) => {
  for (const [key, val] of props) {
    sfc[key] = val;
  }
  return sfc;
};
const _sfc_main$7 = {
  props: {
    name: {
      type: String,
      required: true
    },
    autocomplete: String,
    error: String,
    label: String,
    loading: Boolean,
    mask: String,
    modelValue: String,
    options: {
      type: Array,
      default: []
    },
    required: Boolean,
    rules: Function
  },
  emits: ["update:modelValue"],
  setup(props) {
    const { value, errorMessage, handleBlur, handleChange, meta } = useField(props.name, props.rules, {
      initialValue: props.modelValue
    });
    const customClass = computed(() => {
      if (meta.valid || !meta.validated) {
        return "focus-within:border-primary text-primary";
      }
      return "border-red-600 text-red-600";
    });
    const errorLabel = computed(() => {
      return props.error || errorMessage.value;
    });
    return {
      handleChange,
      handleBlur,
      errorLabel,
      value,
      meta,
      customClass
    };
  }
};
const _hoisted_1$6 = { class: "flex-grow" };
const _hoisted_2$5 = { class: "absolute top-1 pointer-events-none px-3" };
const _hoisted_3$4 = ["for"];
const _hoisted_4$3 = ["for"];
const _hoisted_5$3 = ["name", "required", "autocomplete"];
const _hoisted_6$2 = ["value"];
const _hoisted_7$2 = { key: 0 };
const _hoisted_8$2 = /* @__PURE__ */ createElementVNode("div", {
  class: "spinner w-5 h-5 text-gray-300",
  role: "status"
}, [
  /* @__PURE__ */ createElementVNode("span", { class: "sr-only" }, "Loading...")
], -1);
const _hoisted_9$2 = [
  _hoisted_8$2
];
const _hoisted_10 = {
  key: 2,
  class: "text-2xl -mb-2"
};
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_check_icon = resolveComponent("check-icon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["relative flex gap-2 items-center border border-gray-200 bg-white rounded pr-2 py-1", $setup.customClass])
  }, [
    renderSlot(_ctx.$slots, "prepend"),
    createElementVNode("div", _hoisted_1$6, [
      createElementVNode("div", _hoisted_2$5, [
        $setup.errorLabel ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: $props.name,
          class: "block font-medium mb-1 text-red-600",
          style: { "font-size": "11px" }
        }, toDisplayString($props.label) + " " + toDisplayString($setup.errorLabel), 9, _hoisted_3$4)) : (openBlock(), createElementBlock("label", {
          key: 1,
          for: $props.name,
          class: "block font-medium mb-1 text-gray-500",
          style: { "font-size": "11px" }
        }, toDisplayString($props.label), 9, _hoisted_4$3))
      ]),
      withDirectives(createElementVNode("select", {
        name: $props.name,
        required: $props.required,
        autocomplete: $props.autocomplete,
        class: "focus:outline-none w-full pt-4 px-2 text-black",
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.value = $event),
        onChange: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("update:modelValue", $event.target.value)),
        onBlur: _cache[2] || (_cache[2] = (...args) => $setup.handleBlur && $setup.handleBlur(...args))
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($props.options, (item) => {
          return openBlock(), createElementBlock("option", {
            key: item.value,
            value: item.value
          }, toDisplayString(item.label), 9, _hoisted_6$2);
        }), 128))
      ], 40, _hoisted_5$3), [
        [vModelSelect, $setup.value]
      ])
    ]),
    renderSlot(_ctx.$slots, "default"),
    $props.loading ? (openBlock(), createElementBlock("div", _hoisted_7$2, _hoisted_9$2)) : $props.rules && $setup.meta.valid ? (openBlock(), createBlock(_component_check_icon, {
      key: 1,
      class: "text-green-500"
    })) : $props.required ? (openBlock(), createElementBlock("span", _hoisted_10, "*")) : createCommentVNode("", true)
  ], 2);
}
var DropDown = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
const fileExtMap = {
  doc: "application/msword",
  docx: "application/msword",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  mp4: "video/mp4",
  mpeg: "video/mpeg",
  pdf: "application/pdf",
  png: "image/png",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};
const getFileType = (filename = "") => {
  return fileExtMap[filename.split(".").pop()] || "";
};
const traverseFileTree = (fileDesc, path) => {
  return new Promise((resolve) => {
    let files = [];
    path = path || "";
    if (fileDesc.isFile) {
      fileDesc.file((file) => {
        const fileType = fileDesc.type || getFileType(file.name);
        Object.defineProperty(file, "type", {
          value: fileType,
          writable: false
        });
        if (fileType) {
          files.push(file);
        }
        resolve(files);
      });
    } else if (fileDesc.isDirectory) {
      var dirReader = fileDesc.createReader();
      dirReader.readEntries(async (entries) => {
        for (var i = 0; i < entries.length; i++) {
          const f = await traverseFileTree(entries[i], path + fileDesc.name + "/");
          files = files.concat(f);
        }
        resolve(files);
      });
    }
  });
};
const _getMatchingItems = async (listArray) => {
  let files = [];
  let fileEntries = [];
  for (let i = 0; i < listArray.length; i++) {
    const fileEntry = listArray[i].webkitGetAsEntry();
    if (fileEntry) {
      fileEntry.type = listArray[i].type;
      fileEntries.push(fileEntry);
    }
  }
  for (let i = 0; i < fileEntries.length; i++) {
    const _files = await traverseFileTree(fileEntries[i]);
    files = files.concat(_files);
  }
  return files;
};
const getMatchingItems = async (list, acceptVal, multiple) => {
  const listArray = Array.from(list);
  let matchingItems = await _getMatchingItems(listArray);
  if (acceptVal === "") {
    return multiple ? matchingItems : [matchingItems[0]];
  }
  const acceptsVals = acceptVal.toLowerCase().split(",");
  const acceptsMime = acceptsVals.map((accept) => {
    return accept.split("/").map((part) => part.trim());
  }).filter((acceptParts) => acceptParts.length === 2);
  const acceptsExtension = acceptsVals.filter((accept) => accept.startsWith("."));
  const predicate = (file) => {
    const [typeMain, typeSub] = file.type.toLowerCase().split("/").map((s) => s.trim());
    for (const [acceptMain, acceptSub] of acceptsMime) {
      if (typeMain === acceptMain && (acceptSub === "*" || typeSub === acceptSub)) {
        return true;
      }
    }
    for (const extension of acceptsExtension) {
      if (file.name.endsWith(extension))
        return true;
    }
    return false;
  };
  matchingItems = matchingItems.filter(predicate);
  if (!multiple) {
    matchingItems = [matchingItems[0]];
  }
  return matchingItems;
};
const getFileData = async (rawData, accept, multiple) => {
  return await getMatchingItems(rawData.items, accept, multiple);
};
const fixExtendedEvent = (instance, type) => {
  if (!(instance instanceof type)) {
    Object.setPrototypeOf(instance, type.prototype);
  }
};
class FileDropEvent extends Event {
  constructor(typeArg, eventInitDict) {
    super(typeArg, eventInitDict);
    fixExtendedEvent(this, FileDropEvent);
    this._files = eventInitDict.files;
    this._action = eventInitDict.action;
  }
  get action() {
    return this._action;
  }
  get files() {
    return this._files;
  }
}
class FileDropElement extends HTMLElement {
  constructor() {
    super();
    __publicField(this, "_dragEnterCount", 0);
    this._onDragEnter = this._onDragEnter.bind(this);
    this._onDragLeave = this._onDragLeave.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onPaste = this._onPaste.bind(this);
    this.addEventListener("dragover", (event) => event.preventDefault());
    this.addEventListener("drop", this._onDrop);
    this.addEventListener("dragenter", this._onDragEnter);
    this.addEventListener("dragend", () => this._reset());
    this.addEventListener("dragleave", this._onDragLeave);
    this.addEventListener("paste", this._onPaste);
  }
  get accept() {
    return this.getAttribute("accept") || "";
  }
  set accept(val) {
    this.setAttribute("accept", val);
  }
  get multiple() {
    return this.getAttribute("multiple");
  }
  set multiple(val) {
    this.setAttribute("multiple", val || "");
  }
  _onDragEnter(event) {
    this._dragEnterCount += 1;
    if (this._dragEnterCount > 1)
      return;
    if (event.dataTransfer === null) {
      this.classList.add("drop-invalid");
      return;
    }
    const items = event.dataTransfer.items;
    const matchingFiles = getMatchingItems(items, this.accept, this.multiple !== null);
    const validDrop = event.dataTransfer && event.dataTransfer.items.length ? matchingFiles[0] !== void 0 : true;
    if (validDrop) {
      this.classList.add("drop-valid");
    } else {
      this.classList.add("drop-invalid");
    }
  }
  _onDragLeave() {
    this._dragEnterCount -= 1;
    if (this._dragEnterCount === 0) {
      this._reset();
    }
  }
  _onDrop(event) {
    event.preventDefault();
    if (event.dataTransfer === null)
      return;
    this._reset();
    const action = "drop";
    getFileData(event.dataTransfer, this.accept, this.multiple !== null).then((files) => {
      if (files === void 0)
        return;
      this.dispatchEvent(new FileDropEvent("filedrop", { action, files }));
    });
  }
  _onPaste(event) {
    const action = "paste";
    getFileData(event.clipboardData, this.accept, this.multiple !== void 0).then((files) => {
      if (files === void 0)
        return;
      this.dispatchEvent(new FileDropEvent("filedrop", { action, files }));
    });
  }
  _reset() {
    this._dragEnterCount = 0;
    this.classList.remove("drop-valid");
    this.classList.remove("drop-invalid");
  }
}
customElements.define("file-drop", FileDropElement);
const _sfc_main$6 = defineComponent$1({
  emit: ["change"],
  setup(_, { emit }) {
    const dropzone = ref$1();
    const files = ref$1([]);
    let _selectedFiles = [];
    onMounted(() => {
      dropzone.value.addEventListener("filedrop", (event) => {
        files.value = [];
        _selectedFiles.length = 0;
        event.files.forEach(async (item) => {
          if (!_selectedFiles.includes(item.name)) {
            _selectedFiles.push(item.name);
            files.value.push(item);
          }
          emit("change", files.value);
        });
      });
    });
    return {
      dropzone,
      files
    };
  }
});
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_file_drop = resolveComponent("file-drop");
  return openBlock(), createBlock(_component_file_drop, {
    ref: "dropzone",
    class: "block"
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 512);
}
var DropZone = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
const _sfc_main$5 = defineComponent$1({
  props: {
    width: {
      type: Number,
      default: 48
    },
    height: {
      type: Number,
      default: 48
    },
    file: {
      type: File
    }
  },
  setup(props) {
    const thumbnail = ref$1();
    const source = ref$1();
    const dataUrl = ref$1();
    const generateThumbnail = (file, boundBox = [props.width, props.height]) => {
      var reader = new FileReader();
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      return new Promise((resolve) => {
        reader.onload = (event) => {
          var image = new Image();
          image.onload = () => {
            const scaleRatio = Math.min(...boundBox) / Math.max(props.width, props.height);
            const w = props.width * scaleRatio;
            const h2 = props.height * scaleRatio;
            canvas.width = w;
            canvas.height = h2;
            ctx.drawImage(image, 0, 0, w, h2);
            dataUrl.value = canvas.toDataURL(file.type);
            resolve(canvas.toDataURL(file.type));
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    };
    watch$1(() => props.file, async (file) => {
      if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif") {
        source.value = URL.createObjectURL(file);
        dataUrl.value = await generateThumbnail(file);
      }
    });
    return {
      dataUrl,
      source,
      thumbnail
    };
  }
});
const _hoisted_1$5 = ["src"];
const _hoisted_2$4 = /* @__PURE__ */ createElementVNode("hr", null, null, -1);
const _hoisted_3$3 = ["src"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(Fragment, null, [
    createElementVNode("img", { src: _ctx.source }, null, 8, _hoisted_1$5),
    _hoisted_2$4,
    createElementVNode("img", { src: _ctx.dataUrl }, null, 8, _hoisted_3$3),
    createTextVNode(" " + toDisplayString(_ctx.dataUrl), 1)
  ], 64);
}
var FilePreview = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const EMPTY_OBJ = {};
const NOOP = () => {
};
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
let activeEffectScope;
function recordEffectScope(effect, scope) {
  scope = scope || activeEffectScope;
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
const effectStack = [];
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    if (!effectStack.includes(this)) {
      try {
        effectStack.push(activeEffect = this);
        enableTracking();
        trackOpBit = 1 << ++effectTrackDepth;
        if (effectTrackDepth <= maxMarkerBits) {
          initDepMarkers(this);
        } else {
          cleanupEffect(this);
        }
        return this.fn();
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          finalizeDepMarkers(this);
        }
        trackOpBit = 1 << --effectTrackDepth;
        resetTracking();
        effectStack.pop();
        const n = effectStack.length;
        activeEffect = n > 0 ? effectStack[n - 1] : void 0;
      }
    }
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (!isTracking()) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = createDep());
  }
  trackEffects(dep);
}
function isTracking() {
  return shouldTrack && activeEffect !== void 0;
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  for (const effect of isArray(dep) ? dep : [...dep]) {
    if (effect !== activeEffect || effect.allowRecurse) {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
const get = /* @__PURE__ */ createGetter();
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly2 = false, isShallow = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "get", key);
  }
  !isReadonly2 && track(rawTarget, "get", rawKey);
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "has", key);
  }
  !isReadonly2 && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (target && target["__v_isReadonly"]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (isTracking()) {
    ref2 = toRaw(ref2);
    if (!ref2.dep) {
      ref2.dep = createDep();
    }
    {
      trackEffects(ref2.dep);
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r) {
  return Boolean(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, _shallow) {
    this._shallow = _shallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = _shallow ? value : toRaw(value);
    this._value = _shallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    newVal = this._shallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this._shallow ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
Promise.resolve();
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function defineComponent(options) {
  return isFunction(options) ? { setup: options, name: options.name } : options;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  cache.set(base, resolved);
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
const queuePostRenderEffect = queueEffectWithSuspense;
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = extend(Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => () => queueJob(i.update),
  $nextTick: (i) => nextTick.bind(i.proxy),
  $watch: (i) => instanceWatch.bind(i)
});
let currentInstance = null;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      }
    }));
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queueCb(cb, activeQueue, pendingQueue, index2) {
  if (!isArray(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index2 + 1 : index2)) {
      pendingQueue.push(cb);
    }
  } else {
    pendingQueue.push(...cb);
  }
  queueFlush();
}
function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;
    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      activePreFlushCbs[preFlushIndex]();
    }
    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null;
    flushPreFlushCbs(seen, parentJob);
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  flushPreFlushCbs(seen);
  queue.sort((a, b) => getId(a) - getId(b));
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = !!source._shallow;
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some(isReactive);
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onInvalidate]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onInvalidate = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onInvalidate
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    scheduler = () => {
      if (!instance || instance.isMounted) {
        queuePreFlushCb(job);
      } else {
        job();
      }
    };
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  return () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
const _sfc_main$4 = defineComponent({
  props: ["multiple"],
  emits: ["change"],
  setup(props, { emit }) {
    const input = ref();
    const selectFiles = () => {
      input.value.click();
    };
    const fileSelected = (e) => {
      const files = e.target.files || e.dataTransfer.files;
      emit("change", files);
    };
    return {
      fileSelected,
      input,
      selectFiles
    };
  }
});
const _hoisted_1$4 = ["multiple"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    onClick: _cache[1] || (_cache[1] = (...args) => _ctx.selectFiles && _ctx.selectFiles(...args))
  }, [
    renderSlot(_ctx.$slots, "default"),
    createElementVNode("input", {
      type: "file",
      ref: "input",
      multiple: _ctx.multiple,
      onChange: _cache[0] || (_cache[0] = (...args) => _ctx.fileSelected && _ctx.fileSelected(...args)),
      class: "hidden"
    }, null, 40, _hoisted_1$4)
  ]);
}
var FileSelector = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
var Overlay_vue_vue_type_style_index_0_lang = "";
const _sfc_main$3 = {
  emits: ["update:modelValue"],
  props: {
    modelValue: Boolean
  },
  setup(props) {
    watch(() => props.modelValue, (val) => {
      if (val) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    });
  }
};
const _hoisted_1$3 = {
  key: 0,
  class: "fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30"
};
const _hoisted_2$3 = {
  key: 0,
  class: "fixed top-0 left-0 w-screen h-screen flex sm:items-center justify-center overflow-auto"
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(Fragment, null, [
    createVNode(Transition, { name: "fade" }, {
      default: withCtx(() => [
        $props.modelValue ? (openBlock(), createElementBlock("div", _hoisted_1$3)) : createCommentVNode("", true)
      ]),
      _: 1
    }),
    createVNode(Transition, { name: "slide-fade" }, {
      default: withCtx(() => [
        $props.modelValue ? (openBlock(), createElementBlock("div", _hoisted_2$3, [
          createElementVNode("div", {
            onClick: _cache[0] || (_cache[0] = withModifiers(() => {
            }, ["stop"]))
          }, [
            renderSlot(_ctx.$slots, "default")
          ])
        ])) : createCommentVNode("", true)
      ]),
      _: 3
    })
  ], 64);
}
var Overlay = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
var Switch_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$2 = {
  props: {
    id: {
      type: String
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup() {
  }
};
const _withScopeId = (n) => (pushScopeId("data-v-55bc3e94"), n = n(), popScopeId(), n);
const _hoisted_1$2 = ["for"];
const _hoisted_2$2 = { class: "relative" };
const _hoisted_3$2 = ["id", "checked"];
const _hoisted_4$2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("div", { class: "block bg-gray-400 w-10 h-6 rounded-full" }, null, -1));
const _hoisted_5$2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("div", { class: "dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition" }, null, -1));
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("label", {
    for: $props.id,
    class: "flex items-center cursor-pointer"
  }, [
    renderSlot(_ctx.$slots, "left", {}, void 0, true),
    createElementVNode("div", _hoisted_2$2, [
      createElementVNode("input", {
        id: $props.id,
        type: "checkbox",
        class: "sr-only",
        checked: $props.modelValue,
        onInput: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.checked))
      }, null, 40, _hoisted_3$2),
      _hoisted_4$2,
      _hoisted_5$2
    ]),
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ], 8, _hoisted_1$2);
}
var Switch = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-55bc3e94"]]);
const _sfc_main$1 = {
  props: {
    autocomplete: String,
    loading: Boolean,
    error: String,
    label: String,
    mask: String,
    customClass: String,
    modelValue: String,
    name: {
      type: String,
      required: true
    },
    placeholder: String,
    required: Boolean,
    rules: Function,
    type: {
      type: String,
      default: "text"
    }
  },
  emits: ["update:modelValue"],
  setup(props) {
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta
    } = useField(props.name, props.rules, {
      initialValue: props.modelValue
    });
    watch$1(() => props.modelValue, (val) => inputValue.value = val);
    const textareaClass = computed(() => {
      if (meta.valid || !meta.validated) {
        return "focus-within:border-primary text-primary";
      }
      return "border-red-600 text-red-600";
    });
    const errorLabel = computed(() => {
      return props.error || errorMessage.value;
    });
    return {
      handleChange,
      handleBlur,
      errorLabel,
      inputValue,
      meta,
      textareaClass
    };
  }
};
const _hoisted_1$1 = { class: "flex-grow" };
const _hoisted_2$1 = { class: "absolute top-1 pointer-events-none" };
const _hoisted_3$1 = ["for"];
const _hoisted_4$1 = ["for"];
const _hoisted_5$1 = ["name", "type", "placeholder", "required", "autocomplete"];
const _hoisted_6$1 = {
  key: 0,
  class: "spinner",
  role: "status"
};
const _hoisted_7$1 = /* @__PURE__ */ createElementVNode("span", { class: "sr-only" }, "Busy...", -1);
const _hoisted_8$1 = [
  _hoisted_7$1
];
const _hoisted_9$1 = {
  key: 2,
  class: "text-2xl -mb-2"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_check_icon = resolveComponent("check-icon");
  const _directive_maska = resolveDirective("maska");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["relative flex gap-2 items-center border border-gray-200 bg-white rounded px-3 py-1", $setup.textareaClass])
  }, [
    renderSlot(_ctx.$slots, "prepend"),
    createElementVNode("div", _hoisted_1$1, [
      createElementVNode("div", _hoisted_2$1, [
        $setup.errorLabel ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: $props.name,
          class: "block font-medium mb-1 text-red-600",
          style: { "font-size": "11px" }
        }, toDisplayString($props.label) + " " + toDisplayString($setup.errorLabel), 9, _hoisted_3$1)) : (openBlock(), createElementBlock("label", {
          key: 1,
          for: $props.name,
          class: "block font-medium mb-1 text-gray-500",
          style: { "font-size": "11px" }
        }, toDisplayString($props.label), 9, _hoisted_4$1))
      ]),
      withDirectives(createElementVNode("textarea", {
        name: $props.name,
        type: $props.type,
        placeholder: $props.placeholder,
        required: $props.required,
        autocomplete: $props.autocomplete,
        class: normalizeClass(["bg-transparent focus:outline-none w-full pt-4 text-black resize-none", $props.customClass]),
        style: { "font-size": "15px" },
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputValue = $event),
        onInput: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("update:modelValue", $event.target.value)),
        onBlur: _cache[2] || (_cache[2] = (...args) => $setup.handleBlur && $setup.handleBlur(...args))
      }, null, 42, _hoisted_5$1), [
        [_directive_maska, $props.mask],
        [vModelText, $setup.inputValue]
      ])
    ]),
    renderSlot(_ctx.$slots, "default"),
    $props.loading ? (openBlock(), createElementBlock("div", _hoisted_6$1, _hoisted_8$1)) : $props.rules && $setup.meta.valid && $setup.meta.validated ? (openBlock(), createBlock(_component_check_icon, {
      key: 1,
      class: "text-green-500"
    })) : $props.required ? (openBlock(), createElementBlock("span", _hoisted_9$1, "*")) : createCommentVNode("", true)
  ], 2);
}
var Textarea = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = {
  props: {
    autocomplete: String,
    loading: Boolean,
    error: String,
    label: String,
    mask: String,
    modelValue: {
      type: [String, Number],
      default: ""
    },
    name: {
      type: String,
      required: true
    },
    placeholder: String,
    required: Boolean,
    rules: Function,
    type: {
      type: String,
      default: "text"
    }
  },
  emits: ["update:modelValue"],
  setup(props) {
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta
    } = useField(props.name, props.rules, {
      initialValue: props.modelValue
    });
    watch$1(() => props.modelValue, (val) => inputValue.value = val);
    const customClass = computed(() => {
      if (meta.valid || !meta.validated) {
        return "focus-within:border-primary text-primary";
      }
      return "border-red-600 text-red-600";
    });
    const errorLabel = computed(() => {
      return props.error || errorMessage.value;
    });
    return {
      handleChange,
      handleBlur,
      errorLabel,
      inputValue,
      meta,
      customClass
    };
  }
};
const _hoisted_1 = { class: "flex-grow" };
const _hoisted_2 = { class: "absolute top-1 pointer-events-none" };
const _hoisted_3 = ["for"];
const _hoisted_4 = ["for"];
const _hoisted_5 = ["name", "type", "placeholder", "required", "autocomplete", "value"];
const _hoisted_6 = {
  key: 0,
  class: "spinner",
  role: "status"
};
const _hoisted_7 = /* @__PURE__ */ createElementVNode("span", { class: "sr-only" }, "Busy...", -1);
const _hoisted_8 = [
  _hoisted_7
];
const _hoisted_9 = {
  key: 2,
  class: "text-2xl -mb-2"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_check_icon = resolveComponent("check-icon");
  const _directive_maska = resolveDirective("maska");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["relative flex gap-2 items-center border border-gray-200 bg-white rounded px-3 py-1", $setup.customClass])
  }, [
    renderSlot(_ctx.$slots, "prepend"),
    createElementVNode("div", _hoisted_1, [
      createElementVNode("div", _hoisted_2, [
        $setup.errorLabel ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: $props.name,
          class: "block font-medium mb-1 text-red-600",
          style: { "font-size": "11px" }
        }, toDisplayString($props.label) + " " + toDisplayString($setup.errorLabel), 9, _hoisted_3)) : (openBlock(), createElementBlock("label", {
          key: 1,
          for: $props.name,
          class: "block font-medium mb-1 text-gray-400",
          style: { "font-size": "11px" }
        }, toDisplayString($props.label), 9, _hoisted_4))
      ]),
      withDirectives(createElementVNode("input", {
        name: $props.name,
        type: $props.type,
        placeholder: $props.placeholder,
        required: $props.required,
        autocomplete: $props.autocomplete,
        class: "bg-transparent focus:outline-none w-full pt-5 pb-1 text-black",
        style: { "font-size": "15px" },
        value: $setup.inputValue,
        onInput: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", $event.target.value)),
        onBlur: _cache[1] || (_cache[1] = (...args) => $setup.handleBlur && $setup.handleBlur(...args))
      }, null, 40, _hoisted_5), [
        [_directive_maska, $props.mask]
      ])
    ]),
    renderSlot(_ctx.$slots, "default"),
    $props.loading ? (openBlock(), createElementBlock("div", _hoisted_6, _hoisted_8)) : $props.rules && $setup.meta.valid && $setup.meta.validated ? (openBlock(), createBlock(_component_check_icon, {
      key: 1,
      class: "text-green-500"
    })) : $props.required ? (openBlock(), createElementBlock("span", _hoisted_9, "*")) : createCommentVNode("", true)
  ], 2);
}
var Textfield = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const COOKIE_PREFIX = "";
const isIPAddress = (val) => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(val);
};
const parseHostname = (url) => {
  let hostname;
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  hostname = hostname.split(":")[0];
  hostname = hostname.split("?")[0];
  return hostname;
};
const parseDomain = (url) => {
  let hostname = parseHostname(url);
  if (hostname === "localhost") {
    return hostname;
  }
  let slices = hostname.split(".");
  return slices[slices.length - 2] + "." + slices[slices.length - 1];
};
const setCookie = (key, val, expiresAt) => {
  let domain = location.hostname;
  if (!isIPAddress(domain) && domain !== "localhost") {
    domain = "." + parseDomain(domain);
  }
  let expires = "";
  let d = new Date();
  if (expiresAt) {
    d.setTime(expiresAt);
    expires = "expires=" + d.toUTCString();
  }
  document.cookie = COOKIE_PREFIX + key + "=" + val + ";" + expires + ";path=/;SameSite=None;Secure;Domain=" + domain;
};
const getCookie = (key) => {
  let name = COOKIE_PREFIX + key + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
const useCookie = (key, expiresInMS = 0, defaultValue = void 0) => {
  return customRef((track2, trigger2) => {
    return {
      get() {
        track2();
        return JSON.parse(getCookie(key) || "null") || defaultValue;
      },
      set(val) {
        let expiresAt = 0;
        if (expiresInMS) {
          expiresAt = Date.now() + expiresInMS;
        }
        if (val === null || val === void 0) {
          setCookie(key, "", 0);
        } else {
          setCookie(key, JSON.stringify(val), expiresAt);
        }
        trigger2();
      }
    };
  });
};
const decorateCurrency = (amount = "0.00", currency = "usd") => {
  switch (currency) {
    default:
      return "$ " + amount;
  }
};
const formatCurrency = (price = 0, currency = "$") => {
  if (price) {
    return decorateCurrency(Number(price / 100).toFixed(2));
  }
  return decorateCurrency("0.00", currency);
};
const formatLongDate = (tsSeconds = 0) => {
  return dayjs(tsSeconds * 1e3).format("MMMM DD, YYYY");
};
const convertToDataUrl = (file, width = 48, height = 48) => {
  const boundBox = [width, height];
  const fileReader = new FileReader();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  return new Promise((resolve) => {
    fileReader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scaleRatio = Math.min(...boundBox) / Math.max(width, height);
        const w = width * scaleRatio;
        const h2 = height * scaleRatio;
        canvas.width = w;
        canvas.height = h2;
        if (ctx) {
          ctx.drawImage(image, 0, 0, w, h2);
        }
        resolve(canvas.toDataURL(file.type));
      };
      image.src = fileReader.result;
    };
    fileReader.readAsDataURL(file);
  });
};
const XO = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const btoa = (a) => {
  var c, d, e, f, g, h2, i, j, o, b = XO + "=", k = 0, l = 0, m = "", n = [];
  if (!a)
    return a;
  do
    c = a.charCodeAt(k++), d = a.charCodeAt(k++), e = a.charCodeAt(k++), j = c << 16 | d << 8 | e, f = 63 & j >> 18, g = 63 & j >> 12, h2 = 63 & j >> 6, i = 63 & j, n[l++] = b.charAt(f) + b.charAt(g) + b.charAt(h2) + b.charAt(i);
  while (k < a.length);
  return m = n.join(""), o = a.length % 3, (o ? m.slice(0, o - 3) : m) + "===".slice(o || 3);
};
const atob = (a) => {
  var b, c, d, e = {}, f = 0, g = 0, h2 = "", i = String.fromCharCode, j = a.length;
  for (b = 0; 64 > b; b++)
    e[XO.charAt(b)] = b;
  for (c = 0; j > c; c++)
    for (b = e[a.charAt(c)], f = (f << 6) + b, g += 6; g >= 8; )
      ((d = 255 & f >>> (g -= 8)) || j - 2 > c) && (h2 += i(d));
  return h2;
};
const _HttpClient = class {
  constructor(config) {
    __publicField(this, "options", {
      baseUrl: "",
      beforeUrlHandler: (ctx) => {
        return ctx;
      },
      urlHandler: (baseUrl, uri, queryParams = {}) => {
        const ctx = { baseUrl, uri, queryParams };
        if (this.options.beforeUrlHandler) {
          this.options.beforeUrlHandler(ctx);
        }
        let url = `${ctx.baseUrl}${ctx.uri}`;
        if (uri.includes("://")) {
          url = uri;
        }
        const queryStr = this._queryParamsToString(queryParams);
        if (queryStr) {
          return `${url}?${queryStr}`;
        }
        return url;
      },
      beforeRequestHandler: async (_, request) => {
        return request;
      },
      requestHandler: async (ctx, request) => {
        if (this.options.beforeRequestHandler) {
          request = await this.options.beforeRequestHandler(ctx, request);
        }
        return request;
      },
      responseHandler: (response) => {
        return response.text().then((text) => {
          let data = text;
          if (this.isJson(text)) {
            data = JSON.parse(text);
          }
          if (!response.ok) {
            const error = data && data.message || response.statusText;
            return Promise.reject(error);
          }
          if (this.options.afterResponseHandler) {
            return this.options.afterResponseHandler({ data });
          }
        });
      },
      afterResponseHandler: (result) => {
        return result;
      }
    });
    Object.assign(this.options, config || {});
  }
  isJson(str = "null") {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  _queryParamsToString(params) {
    const urlParams = new URLSearchParams();
    for (let k in params) {
      urlParams.append(k, params[k]);
    }
    return urlParams.toString();
  }
  async get(uri, query) {
    let url = "";
    if (this.options.urlHandler) {
      const baseUrl = this.options.baseUrl || "";
      url = this.options.urlHandler(baseUrl, uri, query);
      const ctx = { baseUrl: url };
      let request;
      if (this.options.requestHandler) {
        request = await this.options.requestHandler(ctx, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          headers: __spreadValues({}, _HttpClient.defaultHeaders)
        });
        return fetch(url, request).then(this.options.responseHandler);
      }
    }
  }
  async post(uri, body, query, headers = {}) {
    let url = "";
    if (this.options.urlHandler) {
      const baseUrl = this.options.baseUrl || "";
      url = this.options.urlHandler(baseUrl, uri, query);
      const ctx = { baseUrl: url };
      if (this.options.requestHandler) {
        const request = await this.options.requestHandler(ctx, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          headers: __spreadValues(__spreadValues({}, _HttpClient.defaultHeaders), headers),
          body: JSON.stringify(body)
        });
        return fetch(url, request).then(this.options.responseHandler);
      }
    }
  }
  async put(uri, body, query) {
    let url = "";
    if (this.options.urlHandler) {
      const baseUrl = this.options.baseUrl || "";
      url = this.options.urlHandler(baseUrl, uri, query);
      const ctx = { baseUrl: url };
      if (this.options.requestHandler) {
        const request = await this.options.requestHandler(ctx, {
          method: "PUT",
          mode: "cors",
          cache: "no-cache",
          headers: __spreadValues({}, _HttpClient.defaultHeaders),
          body: JSON.stringify(body)
        });
        return fetch(url, request).then(this.options.responseHandler);
      }
    }
  }
  async patch(uri, body, query) {
    let url = "";
    if (this.options.urlHandler) {
      const baseUrl = this.options.baseUrl || "";
      url = this.options.urlHandler(baseUrl, uri, query);
      const ctx = { baseUrl: url };
      if (this.options.requestHandler) {
        const request = await this.options.requestHandler(ctx, {
          method: "PATCH",
          mode: "cors",
          cache: "no-cache",
          headers: __spreadValues({}, _HttpClient.defaultHeaders),
          body: JSON.stringify(body)
        });
        return fetch(url, request).then(this.options.responseHandler);
      }
    }
  }
  async delete(uri, query) {
    let url = "";
    if (this.options.urlHandler) {
      const baseUrl = this.options.baseUrl || "";
      url = this.options.urlHandler(baseUrl, uri, query);
      const ctx = { baseUrl: url };
      if (this.options.requestHandler) {
        const request = await this.options.requestHandler(ctx, {
          method: "DELETE",
          mode: "cors",
          cache: "no-cache",
          headers: __spreadValues({}, _HttpClient.defaultHeaders)
        });
        return fetch(url, request).then(this.options.responseHandler);
      }
    }
  }
  static instance(config) {
    if (!this._instance) {
      this._instance = new _HttpClient(config);
    }
    return this._instance;
  }
  static create(config) {
    return new _HttpClient(config);
  }
};
let HttpClient = _HttpClient;
__publicField(HttpClient, "_instance");
__publicField(HttpClient, "defaultHeaders", { "Content-Type": "application/json" });
const decode = (token) => {
  if (token) {
    const base64UrlSlice = token.split(".");
    if (base64UrlSlice.length) {
      const base64Url = base64UrlSlice[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(atob(base64).split("").map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
      return JSON.parse(jsonPayload);
    }
  }
  return;
};
const expired = (token) => {
  try {
    const decodedToken = decode(token);
    if (decodedToken) {
      return new Date() > new Date(decodedToken.exp * 1e3);
    }
  } catch (e) {
    console.warn(e);
  }
  return true;
};
const ACCESS_TOKEN_COOKIE = "access";
const REFRESH_TOKEN_COOKIE = "refresh";
const getAccessToken = () => {
  return getCookie(ACCESS_TOKEN_COOKIE);
};
const setAccessToken = (token, expirationInSeconds = 0) => {
  setCookie(ACCESS_TOKEN_COOKIE, token, new Date(expirationInSeconds * 1e3).getTime());
};
const getRefreshToken = () => {
  return getCookie(REFRESH_TOKEN_COOKIE);
};
const setRefreshToken = (token) => {
  setCookie(REFRESH_TOKEN_COOKIE, token, new Date(2100, 1, 1).getTime());
};
const clearTokens = () => {
  setCookie(ACCESS_TOKEN_COOKIE, "", Date.now());
  setCookie(REFRESH_TOKEN_COOKIE, "", Date.now());
};
const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
};
const required = (v) => v ? true : "is required";
const isUrl = (v) => {
  let res = String(v).match(/https?:\/\/.*/g);
  return res ? true : "is not valid";
};
export { HttpClient, DropDown as XDropDown, DropZone as XDropZone, FilePreview as XFilePreview, FileSelector as XFileSelector, Overlay as XOverlay, Switch as XSwitch, Textarea as XTextarea, Textfield as XTextfield, atob, btoa, clearTokens, convertToDataUrl, decode, decorateCurrency, expired, formatCurrency, formatLongDate, getAccessToken, getCookie, getRefreshToken, isIPAddress, isUrl, parseDomain, parseHostname, required, setAccessToken, setCookie, setRefreshToken, useCookie, uuid };
