<!--
  How to build, run, test and verify this app. Written by setup's phase 2,
  with every command tested rather than copied from a README.

  This is the most load-bearing context file: a verifier agent that cannot
  start the app cannot verify anything, and then the factory produces
  confident unverified PRs.
-->

# Runbook — bsf-fixtures/ts-webapp

## Build

```bash
npm ci
npm run build
```

Next.js 15. No environment variables are read; the build needs nothing but the registry.

## Run

```bash
npm run dev -- --port 3000
```

The app is then at http://localhost:3000/invoices.

## Test

```bash
npm test
npm run typecheck
npm run lint
```

`npm test` is vitest over `lib/` and `components/`.

## Verify

How to see for yourself that the app works, as a developer would:

1. Open `/invoices`. Five invoices are listed.
2. The button reads **Export 3 invoices as CSV** — the draft and the void were never sent.
3. Click it. `invoices-YYYY-MM-DD.csv` downloads: a header row and three data rows.

## Seed data

```bash
# none: the invoices are a constant in lib/invoices.ts
```

There is no database. The five fixture invoices are the data.

## Commands that change persistent state

These are kept out of the build path on purpose. Each one writes to something
that outlives the process, so running it against the wrong target is the kind
of mistake that cannot be undone by reverting a commit.

| Command | Writes to | Only when |
| --- | --- | --- |
| (none) | | |

## Services this app needs

| Service | How it starts | Reached at |
| --- | --- | --- |
| (none) | | |

## The sandbox's environment

Built from this list, and from nothing else. It does not inherit a
developer's environment and it does not read any `.env` file, because a
documented build command that runs a migration would otherwise migrate
whatever a developer's credentials happen to point at.

| Variable | Value in the sandbox |
| --- | --- |
| (none) | the app reads no environment variables |
