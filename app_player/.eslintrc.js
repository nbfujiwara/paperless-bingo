module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  // add your custom rules here
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": 0,
    "no-console": 'off'
  }
}
