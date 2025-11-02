/* Expo React Native + TS — relaxed for inline styles */
module.exports = {
    root: true,
    env: { es2022: true, node: true },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      // use recommended (not "all") to avoid strict style-only rules
      "plugin:react-native/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
    plugins: ["@typescript-eslint", "react", "react-hooks", "react-native"],
    settings: { react: { version: "detect" } },
    rules: {
      // Keep signal/noise good for your codebase
      "react/prop-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "react-hooks/exhaustive-deps": "warn",
  
      // 💅 Turn off strict RN style rules that break your current code
      "react-native/no-color-literals": "off",
      "react-native/sort-styles": "off",
      "react-native/no-unused-styles": "off",
      "react-native/no-single-element-style-arrays": "off",
  
      // TS comments — just warn for now
      "@typescript-eslint/ban-ts-comment": ["warn", { "ts-expect-error": "allow-with-description" }],
    },
    ignorePatterns: ["node_modules/", "android/", "ios/", "dist/", "build/", ".expo/"],
  };
  