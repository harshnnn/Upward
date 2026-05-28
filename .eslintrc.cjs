module.exports = {
  root: true,
  ignorePatterns: ['dist', 'build', '.expo', '.turbo', 'coverage', 'node_modules'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      extends: ['@upward/eslint-config/base']
    },
    {
      files: ['apps/web/**/*.{ts,tsx}'],
      extends: ['@upward/eslint-config/react']
    },
    {
      files: ['apps/mobile/**/*.{ts,tsx}'],
      extends: ['@upward/eslint-config/react']
    },
    {
      files: ['apps/api/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
      extends: ['@upward/eslint-config/node']
    }
  ]
};
