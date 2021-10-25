<template>
  <div @click="selectFiles">
    <slot></slot>
    <input type="file" ref="input" :multiple="multiple" @change="fileSelected" class="hidden" />
  </div>
</template>

<script src="./FileSelector.js"></script>
