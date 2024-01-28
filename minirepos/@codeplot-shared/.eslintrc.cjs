const rulesDirPlugin = require("eslint-plugin-rulesdir");
const path = require("path");
rulesDirPlugin.RULES_DIR = path.join(__dirname, "..", "..", "_eslint");

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}", "*.ts"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "rulesdir/import-rule": "error",
  },
  plugins: ["rulesdir", "@typescript-eslint"],
};
