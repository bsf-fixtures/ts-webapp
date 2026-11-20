<!--
  How to build, run, test and verify this app. Written by setup's phase 2,
  with every command tested rather than copied from a README.

  This is the most load-bearing context file: a verifier agent that cannot
  start the app cannot verify anything, and then the factory produces
  confident unverified PRs.
-->

# Runbook — ts-webapp

## Build

```bash
npm ci
npm run build
```

`npm ci` installs from the committed `package-lock.json` (333 packages, ~7s).
Use it rather than `npm install`, which would rewrite the lockfile.

`npm run build` is `next build`. It compiles the App Router app, type-checks
it, and prerenders `/` and `/invoices` as static pages; `/invoices/export`
stays a dynamic route handler. Measured at ~3s.

Two messages are normal and are not failures:

- `npm warn install-scripts … esbuild@0.21.5 (postinstall: node install.js)` —
  the postinstall is not run under the sandbox's script policy. vitest still
  works, so nothing needs doing about it.
- `⚠ The Next.js plugin was not detected in your ESLint configuration.` — the
  repo's `eslint.config.mjs` carries its own rules and no Next plugin. See
  fundamentals.md; treat adding the plugin as a decision for the owners, not
  as cleanup.

## Run

```bash
npm run start -- --port 3000
```

The app is then at http://localhost:3000/invoices.

The build above must have run first — `next start` serves `.next/`, it does
not compile. The process stays in the foreground; it is ready in under a
second. `npm run dev` exists and works, but the sandbox deliberately does not
use it: see `dropped` in the manifest.

## Test

```bash
npm test          # vitest run — 21 tests in 3 files
npm run typecheck # tsc --noEmit
npm run lint      # eslint .
```

All three pass on a clean tree, verified. `npm test` is the sandbox's test
command; typecheck and lint are kept separate so a type error and a failing
test do not look like the same thing — the static gate runs the repo's own
linters itself.

Tests run under jsdom and need no server, no network and no fixtures. Vite
prints `The CJS build of Vite's Node API is deprecated`; that is a notice, not
an error.

Coverage, when a gate asks for it, comes from the same runner:
`npx vitest run --coverage` (v8 provider, configured in `vitest.config.ts` over
`app/**`, `lib/**`, `components/**`).

## Verify

How to see for yourself that the app works, as a developer would:

1. Build and start as above, then open http://localhost:3000/invoices.
2. The table lists five invoices: INV-1001 (paid), INV-1002 (sent),
   INV-1003 (paid), INV-1004 (draft), INV-1005 (void).
3. The button reads **Export 3 invoices as CSV** — three, not five, because a
   draft and a void were never sent to a customer. This is the one product
   rule the app exists to hold; if the button says five, the change is wrong.
4. Click it. The browser downloads `invoices-YYYY-MM-DD.csv`.
5. The file has the header `id,customer,amount,issued_on,status` and three
   data rows. `INV-1004` and `INV-1005` are not in it.
6. Without a browser, the same check over HTTP:

   ```bash
   curl -i http://localhost:3000/invoices/export
   ```

   Expect `200`, `Content-Type: text/csv; charset=utf-8`,
   `Content-Disposition: attachment; filename="invoices.csv"`,
   `Cache-Control: no-store`, and four lines of body.

## Seed data

```bash
# None. There is no seed step.
```

The data is a hard-coded `readonly Invoice[]` in `lib/invoices.ts` — five
invoices, returned by `listInvoices()`. There is no database, no migration and
no fixture file, so there is nothing to seed and nothing that persists between
runs. To change what the app shows, edit that array.

## Commands that change persistent state

These are kept out of the build path on purpose. Each one writes to something
that outlives the process, so running it against the wrong target is the kind
of mistake that cannot be undone by reverting a commit.

| Command | Writes to | Only when |
| --- | --- | --- |
| _(none found)_ | — | — |

No command in this repo writes outside the working tree. `npm ci` replaces
`node_modules/`, `next build` writes `.next/`, and coverage writes
`coverage/` — all three are gitignored and all three are safe to delete and
regenerate.

## Services this app needs

| Service | How it starts | Reached at |
| --- | --- | --- |
| _(none)_ | — | — |

The app has no database, cache, queue, object store or outbound API client.
Nothing was stubbed, because there is no third party to stub.

## The sandbox's environment

Built from this list, and from nothing else. It does not inherit a
developer's environment and it does not read any `.env` file, because a
documented build command that runs a migration would otherwise migrate
whatever a developer's credentials happen to point at.

| Variable | Value in the sandbox |
| --- | --- |
| `PORT` | `3000` — the port `next start` binds. Read by the Next CLI, not by any application code. |
| `NEXT_TELEMETRY_DISABLED` | `1` — stops the build posting anonymous telemetry to telemetry.nextjs.org. The app's own setting, not a credential. |

No application file reads an environment variable: `process.env`,
`import.meta.env` and `NEXT_PUBLIC_` have zero matches across `app/`, `lib/`,
`components/` and the root config files. There is no secret in this sandbox
because the app needs none.
