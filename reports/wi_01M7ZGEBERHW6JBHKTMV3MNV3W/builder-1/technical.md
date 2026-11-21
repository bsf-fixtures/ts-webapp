# How it works, file by file

Three files: one new component, one new test, and the page that now delegates
to the component. Nothing under `lib/` or `components/` changed, no dependency
was added, and `app/invoices/page.test.tsx` is untouched.

## `app/invoices/InvoiceTable.tsx` (new)

A server component — no `"use client"`, because it renders markup from data it
is handed and needs no browser API. It has one import,
`import { formatAmount, type Invoice } from "@/lib/invoices";`, in the `@/`
form the repo uses when an import crosses a folder.

```tsx
export function InvoiceTable({ invoices }: { invoices: readonly Invoice[] })
```

The prop is `readonly Invoice[]`, matching what `listInvoices()` returns, so no
caller has to copy a list to pass it.

The body is two cases:

1. **`invoices.length === 0`** — an early return of
   `<p style={{ marginTop: "1.5rem" }}>No invoices match this filter</p>`.
   The `1.5rem` is not arbitrary: it is the top margin the `<table>` carries,
   so the gap under the export button is the same whichever branch renders.
   A comment in the file says that, because the number would otherwise look
   copied.
2. **Otherwise** — the `<table>` block lifted out of `page.tsx` lines 13-32
   with nothing altered: the same `marginTop`/`borderCollapse` style object,
   the same four `<th>` cells with their individual alignment and padding
   styles, the same `<tr key={i.id}>`, and the same
   `formatAmount(i.amountCents)` in the amount cell.

Styling stays an inline `style={{}}` object, which is the repo's only styling
mechanism — there is no CSS file, class name or styling library to use instead.

## `app/invoices/page.tsx` (changed)

Three edits, all mechanical:

- added `import { InvoiceTable } from "./InvoiceTable";`. **Extensionless, not
  `"./InvoiceTable.js"`** — see the note at the bottom of this file;
- dropped `formatAmount` from the `@/lib/invoices` import, since the only use
  of it left with the table. `@typescript-eslint/no-unused-vars` is an error
  here, so leaving it would fail `npm run lint`;
- replaced the whole `<table>…</table>` block with
  `<InvoiceTable invoices={invoices} />`.

The `<h1>`, the `<ExportButton count={exportable.length} />` and the
`Total sent` paragraph are byte-for-byte as they were, including the comment
above the paragraph about using one template literal. `listInvoices()`,
`exportableInvoices()` and `totalCents()` are still called exactly as before;
the page passes the full list straight through, so it does no filtering of its
own.

The page remains a server component.

## `app/invoices/InvoiceTable.test.tsx` (new)

Follows `components/ExportButton.test.tsx`: `render` from
`@testing-library/react`, `afterEach(cleanup)`, and plain DOM property
assertions rather than jest-dom matchers — a deliberate repo choice to keep the
dependency list short. Test data comes from the
`invoice(over: Partial<Invoice> = {})` factory in the style of
`lib/invoices.test.ts:7`, not from literal objects.

The import of the component under test is `"./InvoiceTable.js"`, which is the
repo's convention for a relative import and resolves correctly under vitest.

Two cases, each named for what a reader loses if it fails:

| Case | Asserts |
| --- | --- |
| "says no invoices match rather than showing a table with nothing under its headings" | `document.body.textContent` is exactly `"No invoices match this filter"`, and `document.querySelector("table")` is `null` — so it is not a header row over an empty body |
| "still lists every invoice it is given, so moving the table out of the page changed nothing a user sees" | three `<tr>` elements (the header row plus one per invoice), both invoice ids present, and the empty-state text absent |

## Why `"./InvoiceTable"` and not `"./InvoiceTable.js"`

This is the one place the change departs from a documented repo convention, so
it is worth the paragraph. `fundamentals.md` records that relative imports
within a folder carry an explicit `.js` extension. That holds for test files,
which only ever run through vitest, and this change keeps it there.

It does **not** hold for app source. Next's webpack resolver does not rewrite
`.js` to `.tsx` for files under `app/`, so `import … from "./InvoiceTable.js"`
in `page.tsx` passes `tsc --noEmit` and passes `vitest`, and then fails
`next build` with `Module not found: Can't resolve './InvoiceTable.js'` — a
failure that only two of the three checks can see. The extensionless form
builds, type-checks and lints clean. Please leave it as it is.

## Checks run here

`npm test -- --coverage`, `npm run typecheck`, `npm run lint` and `npm run build`
were all run locally while building this, and the app was started and looked at
in a browser in both states. The factory re-runs the gates itself in a separate
job; that run, not this paragraph, is the evidence.
