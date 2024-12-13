import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    stylistic: {
      indent: 2,
      quotes: 'single',
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'vue/no-multiple-template-root': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        vars: 'all',
        args: 'after-used',
        caughtErrors: 'all',
        ignoreRestSiblings: false,
        reportUsedIgnorePattern: false,
      }],
    },
    ignores: ['node_modules', '.nuxt', 'dist', '_old', '.output'],
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },
  }, {
    files: ['**/*.vue'],
    rules: { },
  }),
).override(
  'antfu/javascript/rules',
  {
    rules: {
      'no-unused-vars': ['error', {
        vars: 'all',
        args: 'after-used',
        caughtErrors: 'all',
        ignoreRestSiblings: false,
        reportUsedIgnorePattern: false,
      }],
    },
  },
)
