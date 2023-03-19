import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

const common = () => {
  const plugins = [
    resolve(),
    json(),
    commonjs(),
    getBabelOutputPlugin({
      allowAllFormats: true,
      presets: [
        ['@babel/preset-env', {
          useBuiltIns: 'entry',
          modules: false,
          corejs: 3,
          targets: {
            browsers: ['ie >= 8', 'iOS 7']
          }
        }]
      ]
    }),
    terser(),
    typescript()
  ]

  return [
    {
      input: './src/index.ts',
      plugins: plugins.filter((plugin) => plugin.name !== 'terser'),
      output: [
        {
          file: 'dist/index.esm.mjs',
          format: 'es'
        },
        {
          file: 'dist/index.cjs.js',
          format: 'cjs',
          exports: 'default'
        }
      ]
    },
    {
      plugins,
      input: './src/index.ts',
      output: {
        file: 'dist/index.min.js',
        format: 'umd',
        name: 'uaBrowser'
      }
    }
  ]
}

export default common()