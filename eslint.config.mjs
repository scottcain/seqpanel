import eslint from "@eslint/js";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/build/**/*", "**/dist/**/*", "**/esm/**/*", "**/public/**/*"],
  },
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  eslintPluginReact.configs.flat.recommended,
  {
    plugins: {
      "react-hooks": eslintPluginReactHooks,
    },
    rules: eslintPluginReactHooks.configs.recommended.rules,
  },
  {
    // in main config for TSX/JSX source files
    plugins: {
      "react-refresh": eslintPluginReactRefresh,
    },
    rules: {},
  },
  {
    rules: {
      "no-console": [
        "warn",
        {
          allow: ["error", "warn"],
        },
      ],
      curly: "error",
    },
  },
);
