import babel from 'rollup-plugin-babel'
import { eslint } from 'rollup-plugin-eslint'
import { uglify } from 'rollup-plugin-uglify'

const dependencies = Object.keys(require('./package.json').dependencies)

const commonConfig = {
  input: 'src/index.js',
  output: {
    name: 'MithVaultSDK',
    globals: {
      'crypto-js': 'CryptoJS',
      axios: 'axios'
    }
  },
  external: dependencies,
  plugins: [
    eslint({
      include: ['src/**'],
      exclude: ['node_modules/**']
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    uglify()
  ]
}

export default [
  {
    ...commonConfig,
    output: {
      ...commonConfig.output,
      file: 'dist/mith-vault-sdk.browser.min.js',
      format: 'iife'
    }
  },
  {
    ...commonConfig,
    output: {
      ...commonConfig.output,
      file: 'dist/mith-vault-sdk.node.min.js',
      format: 'cjs'
    }
  },
  {
    ...commonConfig,
    output: {
      ...commonConfig.output,
      file: 'dist/mith-vault-sdk.min.js',
      format: 'umd'
    }
  }
]
