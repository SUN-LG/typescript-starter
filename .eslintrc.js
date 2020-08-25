module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'eslint-config-alloy',
    // 'eslint-config-alloy/typescript'
    // 用于关闭 ESLint 相关的规则集合，具体可查看 https://github.com/prettier/eslint-config-prettier/blob/master/index.js
    'prettier',
    // 用于关闭 @typescript-eslint/eslint-plugin 插件相关的格式规则集合，具体可查看 https://github.com/prettier/eslint-config-prettier/blob/master/%40typescript-eslint.js
    'prettier/@typescript-eslint',

    "plugin:jest/recommended"
  ],
  rules: {
    // '@typescript-eslint/no-extra-semi': 'off'
  }
};