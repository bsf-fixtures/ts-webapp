<!--
  The conventions no check enforces. Everything here is something a script
  could not decide, which is why it is prose.

  The bar for a line in this file: it has to be a judgement. If a static rule
  could catch it, it belongs in .factory/guardrails/ instead, because a rule
  is reproducible and prose is something agents argue with.

  Each line carries where it came from, so a line nobody can justify can be
  removed later.
-->

# Fundamentals — bsf-fixtures/ts-webapp

## Dominant patterns

For each recurring concern, the pattern most of this codebase already uses.
Follow it rather than introducing a second way of doing the same thing.

| Concern | The pattern here | Source |
| --- | --- | --- |
| Money | integer cents, formatted only at the edge with `formatAmount` | `lib/invoices.ts` |
| Tests | beside the file they test, `*.test.ts(x)`, vitest | `lib/`, `components/` |
| Data | `readonly` types and arrays | `lib/invoices.ts` |

## Product intent

What this product is trying to be, where that would change a decision an
agent has to make.

An export is something a customer acts on, so it contains only invoices a customer was actually sent: never drafts, never voids.

## Taste

Things a reviewer would ask for that no rule states.

- A doc comment says why, not what.

## Deliberate exceptions

Places that look like they break a rule and should stay as they are, with the
reason. Without this section, cleanup keeps rediscovering them.

| (none yet) | |
