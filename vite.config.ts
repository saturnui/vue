import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
// import typescript from '@rollup/plugin-typescript'
// import path from 'path'

// const resolvePath = (str: string) => path.resolve(__dirname, str)
// import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WindiCSS()],
  build: {
    lib: {
      // formats: ['es', 'cjs', 'iife'],
      entry: 'src/index.ts',
      name: 'vuwi',
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'dayjs', 'vee-validate', 'maska', 'yup'],
      output: {
        format: 'esm',
        // manualChunks: undefined,
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          dayjs: 'dayjs',
          yup: 'yup',
        },
      },
      // plugins: [
      //   typescript({
      //     target: 'es2020',
      //     rootDir: resolvePath('src'),
      //     declaration: true,
      //     declarationDir: resolvePath('dist'),
      //     exclude: resolvePath('node_modules/**'),
      //     allowSyntheticDefaultImports: true,
      //   }),
      // ],
    },
  },
})
