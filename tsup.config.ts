import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    treeshake: true,
    target: 'es2018',
    sourcemap: true,
    outExtension({ format }) {
      if (format === 'esm') return { js: '.mjs' }
      return { js: '.cjs' }
    },
  },
  {
    entry: { index: 'src/iife.ts' },
    format: ['iife'],
    globalName: 'uaBrowser',
    clean: false,
    treeshake: true,
    target: 'es2018',
    sourcemap: true,
    outExtension() {
      return { js: '.min.js' }
    },
  },
])
