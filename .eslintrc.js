module.exports = {
  env: {
    browser: true,
    jest: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  plugins: ['react', 'prettier'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'prettier/prettier': ['error']
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:jest/recommended', 'plugin:testing-library/react']
    },
    {
      files: 'packages/web/**',
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: ['@app/features/*/*', '@lib/*/*', '@app/shared/*/*', '@app/core/*/*']
          }
        ]
      }
    }
  ]
};
