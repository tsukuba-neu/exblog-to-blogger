module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  env: {
    node: true,
    es6: true
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        'singleQuote': true,
        'semi': false
      }
    ]
  }
}
