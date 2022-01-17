import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    dts({
      cleanVueFileName: true,
      insertTypesEntry: false,
      beforeWriteFile(filePath: string, content: string) {
        return {
          filePath: filePath.replace('src/', ''),//.replace('index', 'vue'),
          content
        }
      }
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'vuwi',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd', 'iife'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'vee-validate', 'maska', '@popperjs/core', 'mitt', 'yup'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          'vee-validate': "veeValidate",
          '@popperjs/core': 'core',
        }
      }
    }
  }
})
