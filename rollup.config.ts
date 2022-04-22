import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

const common = (type?: string) => {
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
  ]

  if (type === 'min') {
    plugins.push(terser())
  }

  return {
    input: './src/index.ts',
    output: {
      file: `dist/browser.${type || ''}.js`,
      format: 'umd',
      name: 'uaBrowser'
    },
    plugins: plugins.concat(typescript()),
  }
}

export default [common(), common('min')]