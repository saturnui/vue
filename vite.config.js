import vue from '@vitejs/plugin-vue'
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  // envPrefix: 'APP_',
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'vuwi',
      fileName: format => `vuwi.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'dayjs'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          dayjs: 'dayjs',
        },
      },
    },
  },
})
