const rulesDirPlugin = require("eslint-plugin-rulesdir");
const path = require("path");
rulesDirPlugin.RULES_DIR = path.join(__dirname, "..", "..", "_eslint");

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "plugin:prettier/recommended",
  ],
  overrides: [{
    files: [".eslintrc.{js,cjs}", "*.tsx", "*.css"],
  }],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['rulesdir', 'react-refresh'],
  rules: {
    "rulesdir/import-rule": "error",
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}



