const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  envPrefix: 'APP_',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'uvisity',
      fileName: (format) => `uvisity.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
