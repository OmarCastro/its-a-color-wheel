import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import neostandard from 'neostandard'
import sonarjs from 'eslint-plugin-sonarjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [{
  ignores: [
    '**/*.spec.js',
    '**/*.spec.ts',
    '**/*.min.js',
    '**/build',
    '**/node_modules',
    '**/dist',
  ],
},
...neostandard(),
sonarjs.configs.recommended,
...compat.extends(
  'plugin:jsdoc/recommended-typescript-flavor',
), {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },

    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  rules: {
    '@stylistic/comma-dangle': ['error', 'always-multiline'],

    'key-spacing': ['error', {
      mode: 'minimum',
    }],

    'no-multi-spaces': ['error', {
      exceptions: {
        Property: true,
        ObjectExpression: true,
      },
    }],
  },
}]
