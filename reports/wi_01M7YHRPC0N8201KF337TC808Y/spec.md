# Sort invoices newest first

## plan

Today the /invoices table renders listInvoices() in seeded order, so rows read INV-1001, INV-1002, INV-1003, INV-1004, INV-1005 — oldest issue date first. After this change the table reads newest issue date first: INV-1005 (2026-11-08), INV-1004 (2026-11-01), INV-1003 (2026-10-19), INV-1002 (2026-10-11), INV-1001 (2026-10-02). The ordering is a new pure function in the one domain module — `export function newestFirst(invoices: readonly Invoice[]): readonly Invoice[]` in lib/invoices.ts, implemented as `[...invoices].sort((a, b) => (a.issuedOn < b.issuedOn ? 1 : a.issuedOn > b.issuedOn ? -1 : 0))`, with a JSDoc line saying newest issue date first and ties keeping their input order, and a comment on the spread saying the copy exists because the seeded list is readonly and sort mutates in place. Do not use localeCompare (the repo pins locale-sensitive formatting for exactly this reason) and do not use toSorted (lib is ES2022; toSorted is ES2023). app/invoices/page.tsx changes one line and its import: `const invoices = newestFirst(listInvoices());`, leaving `exportableInvoices(invoices)` and `totalCents(exportable)` as they are, since neither depends on order. Deliberately out of scope: the CSV export keeps its current row order (INV-1001, INV-1002, INV-1003) because the request is about the table and app/invoices/export/route.ts is not touched; if the owners want the file to match the table, that is a separate work item. Also out of scope: adding an issue-date column to the table — the table shows Invoice, Customer, Amount, Status today and the request did not ask for a new column, so the new order is visible as a change in row order, not as a new field.

## files

- lib/invoices.ts
- lib/invoices.test.ts
- app/invoices/page.tsx
- app/invoices/page.test.tsx

## feature folders

- lib/
- app/invoices/

## acceptance checks

- Load http://localhost:3000/invoices in a browser: the table's body rows read, top to bottom, INV-1005, INV-1004, INV-1003, INV-1002, INV-1001 — the reverse of today's order, which is newest issue date first for the seeded data.
- On the same page, the export button above the table still reads 'Export 3 invoices as CSV' and the line below the table still reads 'Total sent: $1,497.50' — reordering the rows changes neither what is counted nor what is summed.
- Request http://localhost:3000/invoices/export (curl or by clicking the export button and opening the downloaded file): the body is still the header row followed by INV-1001, INV-1002, INV-1003 in that order, with INV-1004 and INV-1005 absent — the table's new order does not reach the CSV.
- Run `npm test`: the suite passes, including a new lib/invoices.test.ts case that feeds newestFirst two invoices sharing issuedOn '2026-10-02' and asserts they come back in the order they were given, and a new case asserting the array passed in is not reordered in place.

## tests added

- lib/invoices.test.ts — a `describe("newestFirst")` block with: 'puts the most recently issued invoice first, so the newest work is what a reader sees at the top'; 'keeps two invoices issued on the same day in the order they were given, so equal dates do not shuffle'; 'leaves the list it was given in its original order, because the seeded list is shared with the export'. Build the inputs with the existing `invoice(over)` factory, overriding `id` and `issuedOn`.
- app/invoices/page.test.tsx — 'lists the invoices newest first, so INV-1005 is the top row and INV-1001 the last': render <InvoicesPage />, read the row ids out of the rendered table (e.g. the first cell of each `tbody tr`) and assert the sequence INV-1005, INV-1004, INV-1003, INV-1002, INV-1001. Use plain DOM properties, not jest-dom matchers, as the existing component tests do.

## tests changed

- lib/invoices.test.ts
- app/invoices/page.test.tsx

## research

- `{"claim":"The table renders listInvoices() directly in seeded order, with no sort anywhere, so the row order today is the array's declaration order; the page already derives count and total from the same list via exportableInvoices/totalCents, and neither depends on order.","source":"app/invoices/page.tsx:5 — `const invoices = listInvoices();` then `invoices.map` in the tbody at line 23"}`
- `{"claim":"The seeded invoices are declared oldest-first (2026-10-02 through 2026-11-08), so newest-first is exactly the reverse of the current display order: INV-1005, INV-1004, INV-1003, INV-1002, INV-1001.","source":"ran: node -e 'read lib/invoices.ts, extract id/issuedOn pairs, sort descending by issuedOn' — printed seeded INV-1001@2026-10-02 … INV-1005@2026-11-08 and newestFirst INV-1005, INV-1004, INV-1003, INV-1002, INV-1001, with the input array unchanged"}`
- `{"claim":"issuedOn is an ISO YYYY-MM-DD string with no date library in the repo, so plain string `<`/`>` comparison is chronological comparison and no parsing is needed.","source":"lib/invoices.ts:7 — `readonly issuedOn: string; // YYYY-MM-DD`; fundamentals.md records 'ISO YYYY-MM-DD strings … No date library' as the dominant pattern for dates"}`
- `{"claim":"Array.prototype.sort has been stable since ES2019, so a comparator returning 0 for equal issue dates leaves tied invoices in their input order — which is what 'ties keep their current order' asks for. sort also mutates in place and returns the same array reference, so the readonly seeded list must be copied first; `[...arr].sort(...)` is the documented non-mutating form. The comparator must be anti-symmetric and transitive or V8 leaves the array unsorted, which `a < b ? 1 : a > b ? -1 : 0` satisfies.","source":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort"}`
- `{"claim":"Stability is real on the engine this repo runs on: sorting four records descending by date, two of them tied, kept the tied pair in input order on Node v24.22.3 (V8), which is what both vitest and `next start` execute.","source":"ran: node -e 'const a=[{id:\"A\",d:\"2026-10-02\"},{id:\"B\",d:\"2026-11-01\"},{id:\"C\",d:\"2026-10-02\"},{id:\"D\",d:\"2026-11-08\"}]; console.log([...a].sort((x,y)=> x.d<y.d?1:x.d>y.d?-1:0).map(i=>i.id).join())' → D,B,A,C — A before C preserved"}`
- `{"claim":"toSorted() is not an option here: tsconfig targets ES2022 and lists lib ['dom','dom.iterable','ES2022'], while Array.prototype.toSorted is ES2023, so tsc would reject it.","source":"tsconfig.json — `\"target\": \"ES2022\"`, `\"lib\": [\"dom\", \"dom.iterable\", \"ES2022\"]`"}`
- `{"claim":"localeCompare is the wrong tool here even though the strings are ASCII digits: this repo deliberately pins the locale for its one locale-sensitive formatter rather than letting host locale decide, so an ordering that reads the host locale would contradict a stated decision.","source":"lib/invoices.ts:37 — '// The locale is pinned so the grouping and the symbol cannot drift with the host's.'"}`
- `{"claim":"The ordering belongs in lib/invoices.ts, not inline in the page: lib is the domain module of pure functions over readonly data with no React and no I/O, the page holds no logic of its own, and the repo's stated taste is one domain module that stays one. exportableInvoices/totalCents already set the shape — take a readonly Invoice[], return a derived readonly Invoice[].","source":".factory/definition/context/fundamentals.md — 'Domain logic | Pure functions over readonly data in lib/, with no React and no I/O'; feature-map.md — 'lib/ … Pure functions over readonly data. No React, no I/O, no framework imports'"}`
- `{"claim":"Sorting must not be pushed into listInvoices(): the route handler builds the CSV from listInvoices() too, so sorting there would silently reorder the export, a behaviour change the request did not ask for.","source":"app/invoices/export/route.ts:5 — `const csv = toCsv(exportableInvoices(listInvoices()));`"}`
- `{"claim":"'readonly on domain arrays and fields is the default' and 'code that needs to mutate should copy, and say why' is a stated taste rule, which is why newestFirst returns readonly Invoice[] and carries a comment on the spread.","source":".factory/definition/context/fundamentals.md — Taste section"}`
- `{"claim":"Both test files this change touches already exist, so both must be declared in tests_changed or the policy check fails the PR; new test files would need no declaration, but adding a third test file for lib would split the domain's tests in two.","source":".factory/definition/policy.yaml:64-67 — `tests: declared_edits: required`; ran: `find . -name '*.test.*' -not -path './node_modules/*'` → app/invoices/export/route.test.ts, app/invoices/page.test.tsx, components/ExportButton.test.tsx, lib/invoices.test.ts"}`
- `{"claim":"Both files this change touches are already at 100% line coverage, so the 80% diff-coverage floor is comfortably met; the gate measures diff coverage per whole changed file from lcov LF/LH, and changed test files carry no coverage entry and are skipped.","source":"ran: `npm ci && npm test -- --coverage` → 28 tests in 4 files pass; coverage/lcov.info gives lib/invoices.ts LF=37 LH=37 and app/invoices/page.tsx LF=32 LH=32, against .factory/guardrails/coverage.json diff_min_pct 80"}`
- `{"claim":"Everything the acceptance checks ask for is exercisable in this sandbox: the production server renders /invoices server-side so a browser screenshot shows the real row order, GET /invoices/export answers over HTTP, and `npm test` runs the vitest suite.","source":".factory/sandbox/manifest.json — capabilities.exercised: 'A browser can be pointed at http://localhost:3000/invoices: the page is server-rendered, so a screenshot shows the real table', 'GET /invoices/export answers 200 over HTTP … a header row and three data rows', '`npm test` (vitest, jsdom) runs …'"}`
- `{"claim":"The request is issue #28, open, body identical to the work item's request text, so the plan comment belongs there.","source":"https://github.com/bsf-fixtures/ts-webapp/issues/28"}`
