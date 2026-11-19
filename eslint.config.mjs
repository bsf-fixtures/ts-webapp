import tseslint from "typescript-eslint";

// The repo's own lint rules. The factory's rule pack adds to this at setup
// rather than replacing it.
export default tseslint.config(
  { ignores: ["node_modules/**", ".next/**", "coverage/**", "next-env.d.ts"] },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-console": "error",
      eqeqeq: ["error", "always"],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
);
