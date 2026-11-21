# How the change works, file by file

Four files, one new function and one changed line of rendering code.

## `lib/invoices.ts`

A new exported function, placed with the other derivations over the invoice
list (above `exportableInvoices`):

```ts
/** Newest issue date first; invoices issued on the same day keep their input order. */
export function newestFirst(invoices: readonly Invoice[]): readonly Invoice[] {
  // The copy exists because the seeded list is readonly and sort mutates in place.
  return [...invoices].sort((a, b) => (a.issuedOn < b.issuedOn ? 1 : a.issuedOn > b.issuedOn ? -1 : 0));
}
```

Three things in that line are deliberate:

- **`[...invoices]` before `.sort()`.** `Array.prototype.sort` sorts in place
  and returns the same reference. `INVOICES` is a module-level
  `readonly Invoice[]` that `listInvoices()` hands out by reference to both
  the page and the export route, so sorting it directly would reorder the CSV
  from a distance. The copy is what keeps `newestFirst` a pure derivation, and
  the comment on it says why rather than restating the spread.
- **String comparison, not a date parse and not `localeCompare`.** `issuedOn`
  is an ISO `YYYY-MM-DD` string — the repo's stated pattern for dates, with no
  date library anywhere — and for that format lexicographic order is
  chronological order. `localeCompare` would make the result depend on the
  host locale, which is the thing `formatCurrency` already pins a locale to
  avoid.
- **`? 1 : ? -1 : 0`, not `b.issuedOn.localeCompare(a.issuedOn)` and not
  `toSorted()`.** The explicit comparator is anti-symmetric and transitive,
  which V8 requires; returning `0` for equal dates is what makes a tie keep
  its input order, because `sort` has been stable since ES2019. `toSorted()`
  is ES2023 and this repo's `tsconfig.json` targets ES2022, so `tsc` would
  reject it.

The return type is `readonly Invoice[]`, matching `exportableInvoices` and
`totalCents` — take a readonly list, return a derived readonly list.

## `app/invoices/page.tsx`

Two lines: `newestFirst` added to the existing `@/lib/invoices` import, and

```ts
const invoices = newestFirst(listInvoices());
```

in place of `const invoices = listInvoices();`.

Everything downstream is untouched. `exportableInvoices(invoices)` filters by
status and `totalCents(exportable)` sums — neither reads position, so the
button's count stays 3 and the total stays `$1,497.50`. The `tbody` already
maps `invoices` in array order and keys on `i.id`, so it picks up the new
order with no JSX change.

## `app/invoices/export/route.ts` — not touched

Stated here because its absence is the decision. The route builds its CSV from
`exportableInvoices(listInvoices())`, which never passes through
`newestFirst`, so the downloaded file still reads INV-1001, INV-1002,
INV-1003. Verified by fetching the route and by clicking the button in a
browser after the change.

## Tests

`lib/invoices.test.ts` — a new `describe("newestFirst")` with three cases,
built from the file's existing `invoice(over)` factory:

- the most recently issued invoice comes first;
- two invoices sharing `issuedOn: "2026-10-02"` come back in the order they
  were given;
- the array passed in is still in its original order afterwards.

`app/invoices/page.test.tsx` — one new case that renders `<InvoicesPage />`,
reads the first cell of each `tbody tr` and asserts the sequence
`INV-1005, INV-1004, INV-1003, INV-1002, INV-1001`. It uses plain DOM
properties (`querySelectorAll`, `textContent`) rather than jest-dom matchers,
as the other component tests in this repo do.

Both files are named in the spec's `tests_changed`. `npm test` goes from 28
to 32 tests; `npm run typecheck` and `npm run lint` are clean, and both
changed source files remain at 100% line coverage (`lib/invoices.ts` 40/40,
`app/invoices/page.tsx` 32/32).
