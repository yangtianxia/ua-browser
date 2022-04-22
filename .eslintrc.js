module.exports = {
  env: {
    browser: true,
    es6: true,
		node: true
  },
  extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript'
	],
  parserOptions: {
    ecmaVersion: 2018,
		sourceType: 'module'
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'camelcase': 0,
    'eol-last': 0,
    'no-unused-vars': 0,
    'no-console': 'off',
    'no-debugger': 'off',
    'quote-props': [0, 'always'],
    'space-before-function-paren': 0,
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
}