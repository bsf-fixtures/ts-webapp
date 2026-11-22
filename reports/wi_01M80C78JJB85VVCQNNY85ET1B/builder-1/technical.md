# Technical
- `eslint.config.mjs`: one new config object for `app/**` and `components/**` (tests ignored) setting `no-restricted-syntax` with three selectors (`/ 100`, `.toFixed`, `Intl.NumberFormat`) sharing one message. `lib/` is excluded, since formatAmount/formatCurrency live there.
- `lint-rules.test.ts`: uses `ESLint.lintText` with virtual paths to check a bad page, bad component, good page and lib exemption.
