<!--
  The conventions no check enforces. Everything here is something a script
  could not decide, which is why it is prose.

  The bar for a line in this file: it has to be a judgement. If a static rule
  could catch it, it belongs in .factory/guardrails/ instead, because a rule
  is reproducible and prose is something agents argue with.

  Each line carries where it came from, so a line nobody can justify can be
  removed later.
-->

# Fundamentals — ts-webapp

## Dominant patterns

For each recurring concern, the pattern most of this codebase already uses.
Follow it rather than introducing a second way of doing the same thing.

| Concern | The pattern here | Source |
| --- | --- | --- |
| Domain logic | Pure functions over `readonly` data in `lib/`, with no React and no I/O. The page and the route handler both call the same `exportableInvoices` / `toCsv`, so the rule lives in one place and the two cannot disagree. | `lib/invoices.ts`, used by `app/invoices/page.tsx` and `app/invoices/export/route.ts` |
| Server vs client components | Server by default. `"use client"` appears exactly once, on the component that needs browser APIs, and the page stays a server component that passes it a plain prop (`count`). | `components/ExportButton.tsx` is the only `"use client"` file; `app/invoices/page.tsx` has no directive |
| Route handlers | Export a named HTTP-verb function that builds and returns a `Response` by hand, with every header set explicitly. No helper wrapper, no `NextResponse`. | `app/invoices/export/route.ts` |
| Money | Integer cents in the data (`amountCents`), formatted to a string only at the edge. Never a float in the domain. | `lib/invoices.ts` (`Invoice.amountCents`, `formatAmount`) |
| Dates | ISO `YYYY-MM-DD` strings, typed as `string` with the format noted in a comment. No date library. | `lib/invoices.ts` (`issuedOn`), `components/ExportButton.tsx` (`toISOString().slice(0, 10)`) |
| Imports | `@/`-prefixed absolute imports when crossing a folder (`@/lib/invoices`), relative with an explicit `.js` extension within a folder (`./invoices.js`). | `tsconfig.json` `paths`, `vitest.config.ts` `resolve.alias`; both styles visible in `lib/invoices.test.ts` and `app/invoices/export/route.test.ts` |
| Types | Strict throughout — `strict` plus `noUncheckedIndexedAccess`. Domain shapes are `interface` with every field `readonly`; no `any` appears in the repo. Indexed access is handled at the use site (`?? ""`), not with a non-null assertion. | `tsconfig.json`, `lib/invoices.ts`, `lib/invoices.test.ts` |
| Tests | Colocated `*.test.ts(x)` beside the source, `describe` naming the unit and `it` naming the user-visible consequence in a full sentence. Component assertions use plain DOM properties rather than jest-dom matchers, to keep the dependency list short. | all three test files; the comment in `components/ExportButton.test.tsx` states the jest-dom choice |
| Test data | A single `invoice(over: Partial<Invoice> = {})` factory with sane defaults, overridden per case, instead of literal objects in each test. | `lib/invoices.test.ts` |
| Styling | Inline `style={{}}` objects on the element. No CSS file, no class names, no styling library. | `app/layout.tsx`, `app/invoices/page.tsx` |
| Comments | Only where the reason is not evident from the code, as a full sentence saying *why*. JSDoc on exported functions whose rule matters; no restating of signatures. | `lib/invoices.ts` (`/** Only invoices that were actually sent … */`), `components/ExportButton.tsx` |

## Product intent

What this product is trying to be, where that would change a decision an
agent has to make.

The app exists to demonstrate one rule, and the rule is about trust in an
export: **a CSV of invoices contains only the invoices that were actually
sent to a customer.** `draft` and `void` invoices are visible in the table —
a person needs to see them — but they must never reach the file. Any change
that widens `exportableInvoices` beyond `sent` and `paid`, or that builds the
export from `listInvoices()` directly, breaks the only thing this app
promises.

Around that rule, three smaller intentions, each stated in the code:

- **The button tells you what will happen before you click it.** Its label
  carries the count ("Export 3 invoices as CSV"), and the count comes from the
  same filter the file does. A label that says five while the file has three
  is worse than no label.
- **A download must never be empty.** The button is disabled at `count === 0`,
  and the route always writes a header row. Those are two halves of the same
  intention; changing one without the other leaves a hole.
- **A second export in the same day must not silently overwrite the first.**
  Hence the date in the filename. The server's `Content-Disposition` says
  `invoices.csv`; the client overrides it with the dated name. That difference
  is deliberate, not a bug.

This is a fixture for the Build Software Factory (README), so its secondary
intent is to stay small and legible: the clearest implementation wins over the
most general one.

## Taste

Things a reviewer would ask for that no rule states.

- A test name should say what a user loses if it fails — "leaves out drafts
  and voids, which were never sent to a customer", not "filters correctly".
  Every existing test is written this way; match it.
- Keep the dependency list short. jest-dom was deliberately not added for four
  assertions; a new dependency needs a reason bigger than convenience.
- Prefer widening an existing pure function in `lib/` to adding a second one
  that does nearly the same thing. There is one domain module; it should stay
  one until a genuinely separate concept appears.
- `readonly` on domain arrays and fields is the default, not an embellishment.
  Code that needs to mutate should copy, and say why.
- CSV output ends with a trailing newline, and that is tested. Don't "tidy" it
  away — appending to the file would otherwise join two rows.
- Inline styles are already the convention; adding a styling system for one
  component would make the codebase have two answers to the same question.
- Comments earn their place by explaining a decision. A comment that restates
  the next line should be deleted rather than updated.

## Deliberate exceptions

Places that look like they break a rule and should stay as they are, with the
reason. Without this section, cleanup keeps rediscovering them.

| Place | Why it stays |
| --- | --- |
| `.github/workflows/ci.yml` is `on: push` (and `pull_request`) | Deliberate, and stated in the file's own header comment and in the README: this fixture's acceptance criterion is that a full factory run — whose writes go to `refs/factory/*`, outside `refs/heads/` — starts none of these runs. Narrowing the trigger would destroy what it is there to prove. |
| `eslint.config.mjs` carries no Next.js ESLint plugin, so `next build` prints `⚠ The Next.js plugin was not detected in your ESLint configuration` | The file's comment says these are "the repo's own lint rules" and that the factory's rule pack "adds to this at setup rather than replacing it". The warning is cosmetic and the build succeeds. Adding the plugin is a decision for the repo's owners — it would introduce new rules and new baseline counts — not a cleanup for an agent to make unasked. |
| The server sends `filename="invoices.csv"` but the client saves `invoices-YYYY-MM-DD.csv` | Two different jobs. The header is a correct fallback for anyone fetching the URL directly; the dated name exists so a second export in a day does not overwrite the first (comment in `components/ExportButton.tsx`). Making them identical would lose one of the two. |
| Imports of local modules carry a `.js` extension in test files (`./invoices.js`) while the source is `.ts` | Required by the ESM/`"moduleResolution": "bundler"` setup these tests run under; it resolves correctly through vitest. Not a stray build artefact. |
| Styles are inline objects rather than CSS | A fixture-sized app kept deliberately dependency-light; see Taste. |
| `components/ExportButton.test.tsx` asserts with `(el as HTMLButtonElement).disabled` instead of `toBeDisabled()` | Stated in a comment in that file: it keeps jest-dom out of the dependency list. The cast is the cost of that choice, not an oversight. |
