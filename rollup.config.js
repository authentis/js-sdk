const {nodeResolve} = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const babel = require('rollup-plugin-babel')
const {terser} = require('rollup-plugin-terser')
const json = require('@rollup/plugin-json')

module.exports = [
  {
    input: 'src/browser/index.js',
    output: [{
      format: 'iife',
      file: 'dist/authentis.iife.js',
      name: 'Authentis'
    }],
    plugins: [
      nodeResolve({browser: true}),
      commonjs(),
      json(),
      babel({runtimeHelpers: true}),
      terser()
    ]
  },
  {
    input: 'src/node/index.js',
    output: [{
      format: 'cjs',
      file: 'dist/authentis.cjs.js'
    }, {
      format: 'es',
      file: 'dist/authentis.es.js'
    }],
    plugins: [
      nodeResolve(),
      commonjs(),
      json(),
      babel({runtimeHelpers: true}),
      terser()
    ]
  }
]
