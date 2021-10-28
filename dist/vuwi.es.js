var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { computed, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createElementVNode, toDisplayString, withDirectives, Fragment, renderList, vModelSelect, createBlock, createCommentVNode, defineComponent as defineComponent$1, ref as ref$1, onMounted, withCtx, watch as watch$1, createTextVNode, createVNode, Transition, withModifiers, pushScopeId, popScopeId, resolveDirective, vModelText } from "vue";
import { useField } from "vee-validate";
var vuwi = "";
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
function queueCb(cb, activeQueue, pendingQueue, index) {
  if (!isArray(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
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
var _export_sfc = (sfc, props) => {
  for (const [key, val] of props) {
    sfc[key] = val;
  }
  return sfc;
};
const _sfc_main$7 = defineComponent({
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
      default: () => []
    },
    required: Boolean,
    rules: Function
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
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
});
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
    class: normalizeClass(["relative flex gap-2 items-center border border-gray-200 bg-white rounded pr-2 py-1", _ctx.customClass])
  }, [
    renderSlot(_ctx.$slots, "prepend"),
    createElementVNode("div", _hoisted_1$6, [
      createElementVNode("div", _hoisted_2$5, [
        _ctx.errorLabel ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: _ctx.name,
          class: "block font-medium mb-1 text-red-600",
          style: { "font-size": "11px" }
        }, toDisplayString(_ctx.label) + " " + toDisplayString(_ctx.errorLabel), 9, _hoisted_3$4)) : (openBlock(), createElementBlock("label", {
          key: 1,
          for: _ctx.name,
          class: "block font-medium mb-1 text-gray-500",
          style: { "font-size": "11px" }
        }, toDisplayString(_ctx.label), 9, _hoisted_4$3))
      ]),
      withDirectives(createElementVNode("select", {
        name: _ctx.name,
        required: _ctx.required,
        autocomplete: _ctx.autocomplete,
        class: "focus:outline-none w-full pt-4 px-2 text-black",
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.value = $event),
        onChange: _cache[1] || (_cache[1] = (...args) => _ctx.handleChange && _ctx.handleChange(...args)),
        onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.handleBlur && _ctx.handleBlur(...args))
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.options, (item) => {
          return openBlock(), createElementBlock("option", {
            key: item.value,
            value: item.value
          }, toDisplayString(item.label), 9, _hoisted_6$2);
        }), 128))
      ], 40, _hoisted_5$3), [
        [vModelSelect, _ctx.value]
      ])
    ]),
    renderSlot(_ctx.$slots, "default"),
    _ctx.loading ? (openBlock(), createElementBlock("div", _hoisted_7$2, _hoisted_9$2)) : _ctx.rules && _ctx.meta.valid ? (openBlock(), createBlock(_component_check_icon, {
      key: 1,
      class: "text-green-500"
    })) : _ctx.required ? (openBlock(), createElementBlock("span", _hoisted_10, "*")) : createCommentVNode("", true)
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
      var fileReader = new FileReader();
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      return new Promise((resolve) => {
        fileReader.onload = (event) => {
          const image = new Image();
          image.onload = () => {
            const scaleRatio = Math.min(...boundBox) / Math.max(props.width, props.height);
            const w = props.width * scaleRatio;
            const h = props.height * scaleRatio;
            canvas.width = w;
            canvas.height = h;
            if (ctx) {
              ctx.drawImage(image, 0, 0, w, h);
            }
            dataUrl.value = canvas.toDataURL(file.type);
            resolve(canvas.toDataURL(file.type));
          };
          image.src = fileReader.result;
        };
        fileReader.readAsDataURL(file);
      });
    };
    watch$1(() => props.file, async (file) => {
      if (file) {
        if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif") {
          source.value = URL.createObjectURL(file);
          dataUrl.value = await generateThumbnail(file);
        }
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
const _sfc_main$3 = defineComponent({
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
});
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
        _ctx.modelValue ? (openBlock(), createElementBlock("div", _hoisted_1$3)) : createCommentVNode("", true)
      ]),
      _: 1
    }),
    createVNode(Transition, { name: "slide-fade" }, {
      default: withCtx(() => [
        _ctx.modelValue ? (openBlock(), createElementBlock("div", _hoisted_2$3, [
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
const _sfc_main$2 = defineComponent({
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
  setup(props, { emit }) {
    const handleInput = (evt) => {
      const target = evt.target;
      emit("update:modelValue", target.checked);
    };
    return {
      handleInput
    };
  }
});
const _withScopeId = (n) => (pushScopeId("data-v-19e7d526"), n = n(), popScopeId(), n);
const _hoisted_1$2 = ["for"];
const _hoisted_2$2 = { class: "relative" };
const _hoisted_3$2 = ["id", "checked"];
const _hoisted_4$2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("div", { class: "block bg-gray-400 w-10 h-6 rounded-full" }, null, -1));
const _hoisted_5$2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("div", { class: "dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition" }, null, -1));
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("label", {
    for: _ctx.id,
    class: "flex items-center cursor-pointer"
  }, [
    renderSlot(_ctx.$slots, "left", {}, void 0, true),
    createElementVNode("div", _hoisted_2$2, [
      createElementVNode("input", {
        id: _ctx.id,
        type: "checkbox",
        class: "sr-only",
        checked: _ctx.modelValue,
        onInput: _cache[0] || (_cache[0] = ($event) => _ctx.handleInput($event))
      }, null, 40, _hoisted_3$2),
      _hoisted_4$2,
      _hoisted_5$2
    ]),
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ], 8, _hoisted_1$2);
}
var Switch = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-19e7d526"]]);
const _sfc_main$1 = defineComponent({
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
});
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
    class: normalizeClass(["relative flex gap-2 items-center border border-gray-200 bg-white rounded px-3 py-1", _ctx.textareaClass])
  }, [
    renderSlot(_ctx.$slots, "prepend"),
    createElementVNode("div", _hoisted_1$1, [
      createElementVNode("div", _hoisted_2$1, [
        _ctx.errorLabel ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: _ctx.name,
          class: "block font-medium mb-1 text-red-600",
          style: { "font-size": "11px" }
        }, toDisplayString(_ctx.label) + " " + toDisplayString(_ctx.errorLabel), 9, _hoisted_3$1)) : (openBlock(), createElementBlock("label", {
          key: 1,
          for: _ctx.name,
          class: "block font-medium mb-1 text-gray-500",
          style: { "font-size": "11px" }
        }, toDisplayString(_ctx.label), 9, _hoisted_4$1))
      ]),
      withDirectives(createElementVNode("textarea", {
        name: _ctx.name,
        type: _ctx.type,
        placeholder: _ctx.placeholder,
        required: _ctx.required,
        autocomplete: _ctx.autocomplete,
        class: normalizeClass(["bg-transparent focus:outline-none w-full pt-4 text-black resize-none", _ctx.customClass]),
        style: { "font-size": "15px" },
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.inputValue = $event),
        onInput: _cache[1] || (_cache[1] = (...args) => _ctx.handleChange && _ctx.handleChange(...args)),
        onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.handleBlur && _ctx.handleBlur(...args))
      }, null, 42, _hoisted_5$1), [
        [_directive_maska, _ctx.mask],
        [vModelText, _ctx.inputValue]
      ])
    ]),
    renderSlot(_ctx.$slots, "default"),
    _ctx.loading ? (openBlock(), createElementBlock("div", _hoisted_6$1, _hoisted_8$1)) : _ctx.rules && _ctx.meta.valid && _ctx.meta.validated ? (openBlock(), createBlock(_component_check_icon, {
      key: 1,
      class: "text-green-500"
    })) : _ctx.required ? (openBlock(), createElementBlock("span", _hoisted_9$1, "*")) : createCommentVNode("", true)
  ], 2);
}
var Textarea = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _sfc_main = defineComponent({
  props: {
    autocomplete: String,
    loading: Boolean,
    disabled: Boolean,
    error: String,
    label: String,
    mask: String,
    modelValue: {
      type: [String, Number],
      default: () => ""
    },
    name: {
      type: String,
      required: true,
      default: ""
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
  setup(props, { emit }) {
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
      let cls = "border-red-600 text-red-600";
      if (meta.valid || !meta.validated) {
        cls = "focus-within:border-primary text-primary";
      }
      if (!props.disabled) {
        cls += " border";
      }
      return cls;
    });
    const errorLabel = computed(() => {
      return props.error || errorMessage.value;
    });
    const handleInput = (evt) => {
      const target = evt.target;
      emit("update:modelValue", target.value);
    };
    return {
      handleChange,
      handleBlur,
      handleInput,
      errorLabel,
      inputValue,
      meta,
      customClass
    };
  }
});
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
  key: 1,
  class: "text-2xl -mb-2"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_maska = resolveDirective("maska");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["relative flex gap-2 items-center border border-gray-200 bg-white rounded px-3 py-1", _ctx.customClass])
  }, [
    renderSlot(_ctx.$slots, "prepend"),
    createElementVNode("div", _hoisted_1, [
      createElementVNode("div", _hoisted_2, [
        _ctx.errorLabel ? (openBlock(), createElementBlock("label", {
          key: 0,
          for: _ctx.name,
          class: "block font-medium mb-1 text-red-600",
          style: { "font-size": "11px" }
        }, toDisplayString(_ctx.label) + " " + toDisplayString(_ctx.errorLabel), 9, _hoisted_3)) : (openBlock(), createElementBlock("label", {
          key: 1,
          for: _ctx.name,
          class: "block font-medium mb-1 text-gray-400",
          style: { "font-size": "11px" }
        }, toDisplayString(_ctx.label), 9, _hoisted_4))
      ]),
      withDirectives(createElementVNode("input", {
        name: _ctx.name,
        type: _ctx.type,
        placeholder: _ctx.placeholder,
        required: _ctx.required,
        autocomplete: _ctx.autocomplete,
        class: "bg-transparent focus:outline-none w-full pt-5 pb-1 text-black",
        style: { "font-size": "15px" },
        value: _ctx.inputValue,
        onInput: _cache[0] || (_cache[0] = (...args) => _ctx.handleInput && _ctx.handleInput(...args)),
        onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.handleBlur && _ctx.handleBlur(...args))
      }, null, 40, _hoisted_5), [
        [_directive_maska, _ctx.mask]
      ])
    ]),
    renderSlot(_ctx.$slots, "default"),
    _ctx.loading ? (openBlock(), createElementBlock("div", _hoisted_6, _hoisted_8)) : _ctx.required ? (openBlock(), createElementBlock("span", _hoisted_9, "*")) : createCommentVNode("", true)
  ], 2);
}
var Textfield = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DropDown as XDropDown, DropZone as XDropZone, FilePreview as XFilePreview, FileSelector as XFileSelector, Overlay as XOverlay, Switch as XSwitch, Textarea as XTextarea, Textfield as XTextfield };
