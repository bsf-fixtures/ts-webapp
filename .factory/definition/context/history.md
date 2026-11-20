<!--
  What has gone wrong before, and what was learned. Seeded by setup from the
  mined corrections, then added to by the scheduled review.

  This file is for failures whose lesson could not be turned into a check. A
  correction that became a rule does not belong here: the rule is the record,
  and repeating it in prose means two things to keep in step.
-->

# History — ts-webapp

Nothing to mine yet. The repository has a single commit — `d231833`
"Install the factory (bootstrap)", 2026-11-20 — which added the app and the
factory together. There is no earlier revision, no review history and no
record of a correction, so every row below that is not blank comes from
reading the code and its tests, not from an incident. The factory has not run
here yet.

## Lessons

| What happened | What to do instead | Where it came from |
| --- | --- | --- |
| _(none recorded)_ | — | No commit history, issues or PRs exist to mine; setup found nothing it could honestly call a past failure. |

## Problem classes already eliminated

Kept so nobody proposes a rule that exists, and so a regression is
recognisable as one.

| Problem class | How it was eliminated | When |
| --- | --- | --- |
| Unsent invoices (drafts, voids) reaching a customer-facing export | A single `exportableInvoices()` filter in `lib/invoices.ts`, used by both the page's count and the route's body so they cannot diverge, locked by tests on both sides (`lib/invoices.test.ts` "leaves out drafts and voids…", `app/invoices/export/route.test.ts` asserts INV-1004 and INV-1005 are absent). | Present at the bootstrap commit `d231833` (2026-11-20); no earlier state exists. |
| A comma or quote in a customer name breaking the CSV's columns | `csvCell()` quotes any cell containing `,`, `"`, CR or LF and doubles embedded quotes; tested with `Smith, Jones & Co` (column count asserted) and `The "Good" Bakery`. | Present at the bootstrap commit `d231833` (2026-11-20). |
| Downloading an empty file | Two halves: the button is `disabled` when `count === 0`, and `toCsv` always writes the header row — each with its own test. | Present at the bootstrap commit `d231833` (2026-11-20). |
| A second export in the same day silently overwriting the first | The client names the download `invoices-YYYY-MM-DD.csv` rather than using the server's static `filename="invoices.csv"`. Explained in a comment in `components/ExportButton.tsx`. | Present at the bootstrap commit `d231833` (2026-11-20). |
| Appending to an export joining two rows together | `toCsv` ends with a trailing newline, with a comment saying why and a test asserting it. | Present at the bootstrap commit `d231833` (2026-11-20). |
| A stale export being served from cache | The route sets `Cache-Control: no-store`, asserted in `app/invoices/export/route.test.ts`. | Present at the bootstrap commit `d231833` (2026-11-20). |

## Escalations

Work the factory could not finish, and why. A pattern across several of these
is a signal about the factory rather than about the work.

| Work item | Where it stopped | Cause |
| --- | --- | --- |
| _(none)_ | — | The factory has not yet run on this repository. |
