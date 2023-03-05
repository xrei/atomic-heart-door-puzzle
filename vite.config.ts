import {defineConfig} from 'vite'
import {resolve} from 'path'
import {babel} from '@rollup/plugin-babel'

import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), babel({exclude: 'node_modules/**', babelHelpers: 'bundled'})],

  resolve: {
    alias: {
      '@app': resolve(__dirname, './src'),
      'charting-library': resolve(__dirname, './src/shared/charting_library'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3200,
  },
})
