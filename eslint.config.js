import globals from 'globals'
import neostandard from 'neostandard'
import jsdoc from 'eslint-plugin-jsdoc'

export default [
  {
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
  jsdoc.configs['flat/recommended-typescript-flavor'],
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
