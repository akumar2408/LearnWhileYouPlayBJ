/* eslint config for Expo React Native + TypeScript */
module.exports = {
    root: true,
    env: { es2022: true, node: true },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:react-native/all"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: { jsx: true },
      sourceType: "module"
      // note: no "project" field so CI is fast & non-type-aware
    },
    plugins: ["@typescript-eslint", "react", "react-hooks", "react-native"],
    settings: { react: { version: "detect" } },
    rules: {
      // RN-friendly defaults
      "react/prop-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-native/no-inline-styles": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }]
    },
    ignorePatterns: ["node_modules/", "android/", "ios/", "dist/", "build/", ".expo/"]
  };
  