import globals from 'globals'
import neostandard from 'neostandard'
import sonarjs from 'eslint-plugin-sonarjs'
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
  sonarjs.configs.recommended,
  {
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

      '@stylistic/key-spacing': ['error', {
        mode: 'minimum',
      }],

      '@stylistic/no-multi-spaces': ['error', {
        exceptions: {
          Property: true,
          ObjectExpression: true,
        },
      }],
    },
  },
]
