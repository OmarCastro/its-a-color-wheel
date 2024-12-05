import globals from 'globals'
import neostandard from 'neostandard'
import jsdoc from 'eslint-plugin-jsdoc'
import js from '@eslint/js'

export default [
  {
    ignores: [
      '**/*.min.js',
      '**/build',
      '**/node_modules',
      '**/dist',
    ],
  },
  ...neostandard(),
  jsdoc.configs['flat/recommended-typescript-flavor'],
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
]
