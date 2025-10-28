import globals from 'globals'
import neostandard from 'neostandard'
import jsdoc from 'eslint-plugin-jsdoc'
import js from '@eslint/js'
import cspellESLintPluginRecommended from '@cspell/eslint-plugin/recommended'

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
  cspellESLintPluginRecommended,
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
      '@cspell/spellchecker': 0
    },

  },
  {
    files: ['src/**/*.js'],
    ignores: ['src/utils/utf8-to-jis-table.constants.js'],
    rules: {
      '@cspell/spellchecker': ['warn', {
        cspell: {
          dictionaries: ['html'],
          words: [
            'perc', // short of percentage
          ],
        }
      }]
    }
  },
]
