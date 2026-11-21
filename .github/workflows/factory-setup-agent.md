---
# Setup agent. Compiled by `gh aw compile` into factory-setup-agent.lock.yml.
#
# One design round of phase 2, called by factory-setup. It reads the repo and
# writes what setup produces — the context files and a complete candidate
# sandbox manifest — into its output directory. Nothing it writes reaches the
# repo directly: a separate job runs the candidate on the runner and measures
# the tier it reaches, and only the best measured round is frozen into the
# setup PR. The agent designs; the runner observes.
on:
  # Who may start this: decided upstream, not here. This workflow's only
  # trigger is workflow_call, so only this repo's own workflows can start it, and
  # the run that calls it starts only from someone with write access or from the
  # factory's App after intake has checked the request's author is trusted.
  # gh-aw's default role check would test the App itself — whose name differs in
  # every repo and cannot be a compile-time literal — and skip every run.
  roles: all
  workflow_call:
    inputs:
      model:
        description: The model, from factory.yaml (the builder's), read by the caller with `bsf models`
        required: true
        type: string
      round:
        description: Which design round this is, 1..3
        required: true
        type: number
      amend:
        description: For an amendment, the inadequacy report that asked for it, as JSON
        required: false
        default: ''
        type: string
    secrets:
      ANTHROPIC_API_KEY:
        required: true
      FACTORY_APP_PRIVATE_KEY:
        required: true

github-app:
  client-id: ${{ vars.FACTORY_APP_CLIENT_ID }}
  private-key: ${{ secrets.FACTORY_APP_PRIVATE_KEY }}

engine:
  id: claude
  model: ${{ inputs.model }}
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

permissions:
  contents: read

# It installs and builds the app while forming its hypothesis, and reads the
# documentation of what the app uses, so it reaches every common ecosystem
# and the general references the spec role does.
network:
  allowed:
    - api.anthropic.com
    - defaults
    - node
    - python
    - go
    - rust
    - ruby
    - java
    - dotnet
    - github
    - playwright
    - developer.mozilla.org
    - stackoverflow.com
    - en.wikipedia.org
    - pkg.go.dev
    - docs.rs
    - docs.python.org
    - nodejs.org
    - learn.microsoft.com

# The setup agent reads a repo it has never seen, and roles: all lets anyone
# who can start factory-setup reach it. Threat detection inspects what the
# agent produced before anything downstream acts on it: the trial and the
# setup PR wait for this whole workflow, detection included, to succeed.
safe-outputs:
  noop:
  threat-detection:
    enabled: true

sandbox:
  agent:
    id: awf
    mounts:
      - ${{ github.workspace }}:/workspace:rw

timeout-minutes: 60

tools:
  bash: [":*"]
  edit:
  playwright:
  web-fetch:
  web-search:

pre-agent-steps:
  - name: Make the output directory
    shell: bash
    run: mkdir -p /tmp/gh-aw/agent/bsf/setup/previous
  # Rounds after the first read what the last round designed and what the
  # trial measured. On round 1 there is nothing to fetch.
  - name: Fetch the previous round's design
    if: inputs.round > 1
    uses: actions/download-artifact@v4
    with:
      pattern: '*-round-*'
      path: /tmp/gh-aw/agent/bsf/setup/previous
  - name: Record the amendment request, if any
    shell: bash
    env:
      AMEND: ${{ inputs.amend }}
    run: |
      if [ -n "$AMEND" ]; then printf '%s\n' "$AMEND" > /tmp/gh-aw/agent/bsf/setup/amend.json; fi

post-steps:
  - name: Keep this round's design for the trial
    uses: actions/upload-artifact@v4
    with:
      name: setup-round-${{ inputs.round }}
      path: /tmp/gh-aw/agent/bsf/setup/
      if-no-files-found: error
---

# Setup

You are setting up a software factory on `${{ github.repository }}`. Your job
is to work out what it takes to run this app for real, write it down so other
agents can work here, and prove it.

Everything you write goes in `/tmp/gh-aw/agent/bsf/setup/`. Nothing you write
in the repo itself is kept.

## What to produce

1. **`context/feature-map.md`, `context/runbook.md`, `context/fundamentals.md`,
   `context/history.md`** — the templates for each are in
   `.factory/definition/context/`. Replace every `{{PLACEHOLDER}}` with what is
   true of this repo, from reading it. Say what you did not find rather than
   guessing; an empty table row is better than an invented one.
2. **`manifest.json`** — the sandbox, as a complete hypothesis. Check it before
   you finish; an invalid manifest wastes the whole round:

   ```bash
   .factory/bin/bsf sandbox check --file /tmp/gh-aw/agent/bsf/setup/manifest.json
   ```
3. **`stubs/`**, if the app needs a third party you cannot reach (see below).
4. **`research-domains.txt`** — one host per line: the documentation sites of
   the frameworks and libraries this repo actually uses. The spec role reads
   them when it researches.

## Read first, then hypothesize

Do not discover the app by crashing it fourteen times. Read it:

- the manifest files (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`,
  `Gemfile`, `*.csproj`, `pom.xml` — whatever is here) for how to install,
  build, test and run;
- the README and any docs, CI workflows, Dockerfiles, compose files and
  devcontainers, **for what the app needs installed — never for what
  production does**. A Dockerfile's `ENTRYPOINT`, a deploy script, a release
  step: those describe production. Record each one you deliberately leave out
  under `dropped`, with why;
- every place the code reads configuration — environment variables, config
  files, a settings module, a helper like `requireEnv("NAME")` — so you know
  every variable the app needs and what each one is *for*.

Then write the whole manifest at once.

## Choosing each variable's value

Read what the code does with it, and pick the kind that makes the app
genuinely work:

- **`self`** — the app's own configuration. Set it to the correct value, not a
  placeholder: the app's own origin is `http://localhost:<port>`, a domain
  allowlist is the real domain, a feature flag is what the app needs on. A
  placeholder here breaks things that are not secrets at all.
- **`service`** — something you can run: a database, a cache, object storage,
  a mail catcher. Add it under `services` (an official image, a port, throwaway
  credentials) and point the variable at `127.0.0.1:<port>`. A migration that
  runs at build time then migrates the throwaway, which is exactly what should
  happen.
- **`stub`** — a third party you cannot run. Write a small local server under
  `stubs/<name>/` that answers the requests this app actually makes with the
  shapes the real API returns (read the client code and the provider's docs),
  record it under `stubs` with where its fixture shapes came from and when.
  Where the app can be told the endpoint, point the variable at the stub and
  start it as part of `run`. Where it cannot — a client library with a fixed
  host, a driver that derives its endpoint from a connection string, an OAuth
  provider found by discovery — give the stub `hosts` (the names the app
  calls), a `port` and a `start` command: the sandbox makes those names
  resolve to this runner and serves them over HTTPS with a certificate the
  runtime trusts, forwarding to your stub. Any credential the client needs to
  sign with (a service-account key, a client secret) is one you generate for
  the stub, never the owner's. A fixed host is a reason for `hosts`, not for
  `inert`.
- **`test_mode`** — only when the provider has a real test mode and the app
  cannot be exercised otherwise. Name the secret; never write a value.
- **`inert`** — present so the app starts; any path needing it will not work
  here. Use it last, only once `service` and `stub` (with `hosts` where the
  address is fixed) are both impossible, and list what it costs under
  `capabilities.not_exercised`. Sign-in is not a reason for `inert`: an
  identity provider can be stubbed like any other, so the pages behind
  sign-in can be seen.

**No credential of the owner's goes in the sandbox.** Not a real database
URL, not a real API key, not a production origin. The environment is closed:
the sandbox gives the app exactly your list and nothing else, so a variable
you miss makes the app fail loudly rather than quietly reach something real.

## Prove what you can, then claim honestly

Inside your own sandbox you can install, build and run the tests, so do — fix
the manifest until they pass. You cannot start services here; the trial does
that on the runner.

Set `tier` to what you believe the trial will reach: `renders` if the app will
start and show its main screen, `build_and_test` if it will build and test but
not start, `static` if neither. Set `app_url` to the page a person would land
on. Fill `capabilities` honestly: what verification here can exercise, and
under `not_exercised`, what it cannot and why. Write each thing you tried in
`episode`.

The trial measures the tier itself. Claiming higher than it reaches costs a
round; it does not change the result. It also runs the build and test
commands once more in an empty directory: commands that pass there too —
guarded on a file the repo does not have, or an `echo` — build and test
nothing, and the tier is `static`. When there is nothing to build or test,
say so with `static` and null commands.

## If this is not the first round

`previous/` holds the last round's design (`setup-round-*`) and what the trial
measured (`trial-round-*/trial.json`): each step's command, whether it passed,
and the last lines of its output. Read the failing step's output, change the
smallest thing that explains it, and write the whole manifest again.

## If this is an amendment

`amend.json` is a report from a role that could not exercise what a change
needed. Start from the current `.factory/sandbox/manifest.json` and extend it
to cover what the report asks for. Keep everything that already works.
