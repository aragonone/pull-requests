require('dotenv').config()

const commonjs = require('rollup-plugin-commonjs')
const resolve = require('@rollup/plugin-node-resolve')
const copy = require('rollup-plugin-copy')
const replace = require('@rollup/plugin-replace')

const BUILD_DIR = 'public'

module.exports = {
  input: 'src/index.js',
  output: {
    file: `${BUILD_DIR}/bundle.js`,
    format: 'iife',
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    copy({
      targets: [{ src: 'src/index.html', dest: BUILD_DIR }],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.GITHUB_TOKEN': JSON.stringify(process.env.GITHUB_TOKEN),
      'process.env.TRACKED_REPOS': JSON.stringify(process.env.TRACKED_REPOS),
    }),
  ],
}
