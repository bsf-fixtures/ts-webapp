# ts-webapp

Build Software Factory fixture: the happy path — clean TypeScript, real tests,
and a UI a verifier agent can drive in a browser.

A small invoices app with one feature worth verifying: an **Export CSV**
button that downloads the invoices which were actually sent to a customer.

## Run

```bash
npm install
npm run dev       # http://localhost:3000/invoices
```

## Test

```bash
npm test          # vitest
npm run typecheck
npm run lint
```

## Verify by hand

1. Open `/invoices`. Five invoices are listed.
2. The button reads **Export 3 invoices as CSV** — three, not five, because
   the draft and the void were never sent.
3. Click it. A `invoices-YYYY-MM-DD.csv` downloads with a header row and three
   data rows.
4. `INV-1004` (draft) and `INV-1005` (void) are not in the file.

## What this fixture exercises

- Runtime verification in a browser, with a download to check
- A `.github/workflows/ci.yml` that runs `on: push`, so a factory run can be
  shown not to start it
- Coverage that a diff-coverage gate can measure
