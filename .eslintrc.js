module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    curly: 0,
    'import/order': 0,
    indent: 0,
    'no-console': 0,
    'no-lonely-if': 1,
    'arrow-parens': 0,
    'no-unused-vars': 1,
    'no-unreachable': 1,
    camelcase: 1,
    'no-trailing-spaces': 1,
    'no-multiple-empty-lines': 1,
    quotes: 1,
    'quote-props': [1, 'as-needed'],
    'no-case-declarations': 1,
    'array-bracket-spacing': 1,
    'no-undef': 1,
    'padded-blocks': 0
  }
}
