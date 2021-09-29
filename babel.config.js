module.exports = function(api) {
  api.cache(true)

  const presets=[], plugins=[]

  /*
  * env-preset options
  * we won't include all polyfills because of env-preset can automatically detect
  * by looking our codebase and decide which polyfills should be imported based on
  * the file .browserslistrc. that's what useBuiltIns and corejs options are for.
  */
  const envPresetOpts = {
    useBuiltIns: false,
    corejs: undefined,
    debug: false
  }
  presets.push(['@babel/env', envPresetOpts])

  plugins.push(['@babel/plugin-transform-runtime', {regenerator: true}])

  /*
  * notes
  *
  * 1. babel's minify-preset doesn't work with useBuiltIns: 'usage'
  * therefore we preferred terser rollup plugin.
  * 2. the other options specified below are for compatibility with rollup
  *
  */

  return {
    babelrc: false,
    exclude: ['node_modules/**'],
    presets: presets,
    plugins: plugins
  }
}
