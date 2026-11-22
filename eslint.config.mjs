import tseslint from "typescript-eslint";

const MONEY_MESSAGE =
  "Amounts are integer cents: format them with formatAmount or formatCurrency from @/lib/invoices, so the page rounds the same way the CSV export does.";

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
  // Inline money formatting rounds differently from the CSV export; lib/ is
  // where formatAmount and formatCurrency legitimately do it.
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    ignores: ["**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "BinaryExpression[operator='/'][right.type='Literal'][right.value=100]", message: MONEY_MESSAGE },
        { selector: "CallExpression[callee.property.name='toFixed']", message: MONEY_MESSAGE },
        { selector: "MemberExpression[object.name='Intl'][property.name='NumberFormat']", message: MONEY_MESSAGE },
      ],
    },
  },
);
