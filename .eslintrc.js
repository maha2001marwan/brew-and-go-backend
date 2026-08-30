module.exports = {
  env:           { node: true, es2021: true, jest: true },
  extends:       'eslint:recommended',
  parserOptions: { ecmaVersion: 2021 },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-empty':       ['error', { allowEmptyCatch: true }],
    'no-console':     'off',
    semi:             ['error', 'always'],
    quotes:           ['error', 'single'],
  },
};
