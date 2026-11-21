# How it works, file by file

Five files changed, three added. No new dependency, no config change.

## `lib/invoices.ts` — the lookup

One new exported function, placed beside `listInvoices` because that is where
every other reader of the seeded array already reaches:

```ts
export function findInvoice(id: string): Invoice | undefined {
  return INVOICES.find((i) => i.id === id);
}
```

It returns `undefined` rather than throwing, so the caller decides what a miss
means — here, a 404. It searches `INVOICES`, not `exportableInvoices(...)`: the
table shows drafts and voids, so their rows have to open. The comment above it
says that, because it is the one thing a later reader might "fix" wrongly.

Nothing else in the module moved. `exportableInvoices`, `totalCents`,
`formatAmount`, `formatCurrency`, `csvCell` and `toCsv` are byte-identical.

## `app/invoices/[id]/page.tsx` — the new route (added)

An async server component, no `"use client"`. On Next 15 a page's `params` is a
Promise, so the signature is `{ params: Promise<{ id: string }> }` and the
component awaits it before looking anything up.

```tsx
const { id } = await params;
const invoice = findInvoice(id);
if (invoice === undefined) notFound();
```

`notFound()` returns `never`, so TypeScript narrows `invoice` to `Invoice` on
every line below the guard — no non-null assertion, which the rule pack bans
anyway. The four fields go in a `<dl>`: `customer`, `formatCurrency(amountCents)`,
`issuedOn` and `status`, then a `next/link` to `/invoices`. No inline styles, matching
`app/page.tsx`.

The amount is the only field that is formatted. It goes through the existing
`formatCurrency`, which is why it reads `$1,180.00` and not `1180.00` — the
table's Amount column keeps `formatAmount`, unchanged.

## `app/invoices/[id]/not-found.tsx` — the 404 body (added)

Eleven lines: a heading reading "Invoice not found", one sentence, and the same
`next/link` back to `/invoices`. Next renders it automatically for anything
`notFound()` throws inside this segment. It exists so a reader who mistypes an
id is not left on the framework's bare screen with no way back to the list.

## `app/invoices/page.tsx` — the id cell becomes a link

Two lines. `import Link from "next/link"` at the top, and the id cell's content
wrapped:

```tsx
<td style={{ paddingRight: "1.5rem" }}>
  <Link href={`/invoices/${i.id}`}>{i.id}</Link>
</td>
```

The `<td>`'s own style is untouched, so the column keeps its spacing. Nothing
else on the page changed: the export button, the other three columns and the
"Total sent" paragraph are all as they were.

## Tests

Both edited test files are declared in the spec's `tests_changed`.

- **`app/invoices/[id]/page.test.tsx`** (new) — four cases. The component is
  rendered directly, the way `app/invoices/page.test.tsx` already does, with the
  async call awaited first:
  `render(await InvoicePage({ params: Promise.resolve({ id: "INV-1001" }) }))`.
  One case asserts all four fields of INV-1001; one asserts a *draft*
  (INV-1004) opens and shows `$931.00`; one asserts the back link's href; one
  asserts an unknown id rejects, because `notFound()` throws rather than
  returning.
- **`app/invoices/[id]/not-found.test.tsx`** (new) — two cases: the text, and
  the back link. Without this file the component measures 0% and drags diff
  coverage below the 80% floor.
- **`lib/invoices.test.ts`** — a `findInvoice` describe block: the invoice it
  returns, that a draft and a void are found too, and `undefined` for an id
  nobody has.
- **`app/invoices/page.test.tsx`** — one case asserting all five ids are
  anchors, in order, with the right hrefs.

## What was checked here

`npm test` (38 passing, up from 21), `npm run typecheck`, `npm run lint` and
`npm run build` all exit 0; the route table prints `ƒ /invoices/[id]`.
`npm test -- --coverage` puts every new and changed source file at 100% lines.
In a browser against the production server: the five ids are links, INV-1002
and INV-1004 render their four fields, the back link returns to the five-row
list, and INV-9999 answers 404 with "Invoice not found". The only console
message anywhere is the pre-existing `favicon.ico` 404. The factory re-runs all
of this in its own job.
