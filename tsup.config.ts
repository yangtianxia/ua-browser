import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm', 'cjs', 'iife'],
  globalName: 'uaBrowser',
  dts: true,
  clean: true,
  minify: false,
  sourcemap: true,
  treeshake: true,
  target: 'es2018',
  outExtension({ format }) {
    if (format === 'esm') return { js: '.mjs' }
    if (format === 'cjs') return { js: '.cjs' }
    return { js: '.min.js' }
  },
  rollupOptions: {
    output: {
      exports: 'named'
    }
  }
})
