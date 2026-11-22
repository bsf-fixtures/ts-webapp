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
  {
    // Money is integer cents and is formatted in one place, lib/invoices.ts
    // (formatAmount / formatCurrency), so the UI and the CSV export cannot drift.
    files: ["**/*.{ts,tsx}"],
    ignores: ["lib/invoices.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "BinaryExpression[operator='/'][right.value=100]",
          message: "Do not convert cents inline. Use formatAmount or formatCurrency from lib/invoices.",
        },
        {
          selector: "CallExpression[callee.property.name='toFixed']",
          message: "Do not format money with toFixed. Use formatAmount or formatCurrency from lib/invoices.",
        },
        {
          selector: "NewExpression[callee.object.name='Intl'][callee.property.name='NumberFormat'], CallExpression[callee.object.name='Intl'][callee.property.name='NumberFormat']",
          message: "Do not build an Intl.NumberFormat. Use formatAmount or formatCurrency from lib/invoices.",
        },
      ],
    },
  },
);
