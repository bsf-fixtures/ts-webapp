# Technical breakdown

Two files change, both in `app/invoices/`. No `lib/`, `components/`,
configuration or dependency change.

## `app/invoices/page.tsx`

One line, plus a three-line comment.

```diff
-      <h1>Invoices</h1>
+      {/* Counted from the array the table maps over, so the heading and the
+          rows cannot disagree, and the heading follows any filter added to
+          that array later. One template literal, for the reason below. */}
+      <h1>{`Invoices (${invoices.length})`}</h1>
```

`invoices` is already in scope — it is `listInvoices()`, bound on the
component's first line, and it is the same array `<tbody>` maps over a few
lines down. Nothing else in the component moves: `exportable`,
`totalSentCents`, the `<ExportButton count={exportable.length} />` and the
`Total sent:` paragraph are untouched.

Two details worth knowing while reading the diff:

**Why a template literal.** React 19's server renderer separates adjacent JSX
children with a comment marker, so `<h1>Invoices ({invoices.length})</h1>`
would reach the browser as `<h1>Invoices (<!-- -->5<!-- -->)</h1>`. A single
template literal is one text child and renders as `<h1>Invoices (5)</h1>`. The
repo already hit this: the `Total sent:` paragraph is written the same way and
carries the comment explaining it, which is what "for the reason below" points
at — rather than restating it and leaving two copies to keep in step.

**Why `invoices.length` and not a `lib/` helper.** `totalCents` exists in
`lib/invoices.ts` because summing cents is a rule two callers must agree on.
Counting an array the component already holds is not a rule, and
fundamentals.md asks for one domain module that stays one until a genuinely
separate concept appears. Adding `countInvoices()` would be a second near
duplicate of `.length`.

## `app/invoices/page.test.tsx`

Two cases appended to the existing `describe("InvoicesPage")`. The file is
listed in the spec's `tests_changed`, which is what `policy.yaml`'s
`tests.declared_edits: required` wants for an edit to an existing test file.
The two cases already in it are unchanged.

```
it("shows how many invoices are listed, so a reader does not have to count the rows")
```

Renders the page, counts `tbody tr`, and asserts the `<h1>` text is exactly
`` `Invoices (${rows.length})` ``. The assertion is written against the row
count rather than against a literal so that it stays true if the seed array
changes — and then pinned to `Invoices (5)` on the next line, so a bug that
emptied both the table and the heading could not pass by agreeing with itself.

```
it("counts the rows on the page, not the exportable ones, so the heading cannot read (3) while five rows are visible")
```

Asserts the heading is not `Invoices (3)` while the button still reads
`Export 3 invoices as CSV`. This is the regression guard: the page now shows
two counts that are deliberately different, and the failure mode to protect
against is someone later making them agree by pointing the heading at
`exportableInvoices`.

Both use `container.querySelector` and plain DOM properties rather than
jest-dom matchers, matching the convention stated in
`components/ExportButton.test.tsx` and in fundamentals.md.

## Checks run here

`npm test` — 30 passed across 4 files (was 28 across 4).
`npm run typecheck` and `npm run lint` — clean.
`npm test -- --coverage` — `app/invoices/page.tsx` stays at 100% lines.
`npm run build` then `npm run start -- --port 3000`, and the page opened in
Chromium: the heading reads `Invoices (5)`, five body rows, the button reads
`Export 3 invoices as CSV`, clicking it downloads `invoices-2026-11-21.csv`
with a header row and INV-1001/1002/1003 only. `curl` of the HTML contains the
literal `Invoices (5)` with no `<!-- -->` between the parts. The only console
message is the pre-existing `favicon.ico` 404, present before this change too.

The factory re-runs all of this in the gates; the above is what the change was
built against, not a substitute for them.
