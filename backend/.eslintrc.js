module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:import/recommended', 'prettier'],
  root: true,
  env: {
    node: true,
    jest: false,
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
