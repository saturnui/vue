<template>
  <div
    class="relative flex gap-2 items-center border border-gray-200 bg-white rounded px-3 py-1"
    :class="textareaClass"
  >
    <slot name="prepend"> </slot>
    <div class="flex-grow">
      <div class="absolute top-1 pointer-events-none">
        <label v-if="errorLabel" :for="name" class="block font-medium mb-1 text-red-600" style="font-size: 11px">
          {{ label }} {{ errorLabel }}
        </label>
        <label v-else :for="name" class="block font-medium mb-1 text-gray-500" style="font-size: 11px">
          {{ label }}
        </label>
      </div>
      <textarea
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        class="bg-transparent focus:outline-none w-full pt-4 text-black resize-none"
        :class="customClass"
        style="font-size: 15px"
        v-maska="mask"
        v-model="inputValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="handleBlur"
      />
    </div>
    <slot></slot>
    <div v-if="loading" class="spinner" role="status">
      <span class="sr-only">Busy...</span>
    </div>
    <check-icon v-else-if="rules && meta.valid && meta.validated" class="text-green-500"></check-icon>
    <span v-else-if="required" class="text-2xl -mb-2">*</span>
  </div>
</template>

<script src="./Textarea.ts"></script>
