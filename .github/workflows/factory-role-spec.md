---
# Spec role. Compiled by `gh aw compile` into factory-role-spec.lock.yml.
# A workflow_call reusable workflow called as a job by factory-run (spike §3).
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
        description: This role's model, from factory.yaml, read by the caller with `bsf models`
        required: true
        type: string
      work_item:
        required: true
        type: string
      pipeline:
        required: false
        default: product_work
        type: string
      attempt:
        required: false
        default: 1
        type: number
      protected_files_policy:
        required: false
        default: request-review
        type: string
      staged:
        required: false
        default: false
        type: boolean
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
  pull-requests: read
  issues: read

network:
  # The spec researches beyond the repo, so it reaches package registries and
  # their documentation, GitHub, and general references. Not a bare wildcard:
  # an agent that can fetch any page is one any page can try to steer. Setup
  # adds the documentation hosts of this repo's own stack here, chosen by
  # reading the repo, before it recompiles — reviewable in the setup PR.
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
    - developer.mozilla.org
    - stackoverflow.com
    - en.wikipedia.org
    - pkg.go.dev
    - docs.rs
    - docs.python.org
    - nodejs.org
    - learn.microsoft.com

sandbox:
  agent:
    id: awf
    mounts:
      - ${{ github.workspace }}:/workspace:rw

timeout-minutes: 45

tools:
  bash: [":*"]
  # Research beyond the repo: a library's current API, a standard, how the
  # thing the request names is usually done. The spec cites what it used.
  web-fetch:
  web-search:

safe-outputs:
  add-comment:
    staged: ${{ inputs.staged }}
  upload-artifact:
  threat-detection:
    enabled: true

pre-agent-steps:
  # The runner that judges a change must not come from the change. A pull
  # request, a merge-group commit or an agent's workspace can all modify
  # .factory/bin, so it is taken from the default branch and parked outside the
  # workspace, which is the only directory the agent sandbox can write to.
  - name: Fetch the factory runner from the default branch
    uses: actions/checkout@v4
    with:
      ref: ${{ github.event.repository.default_branch }}
      path: .factory-trusted
      sparse-checkout: |
        .factory/bin
        .factory/definition
        .factory/sandbox
      sparse-checkout-cone-mode: false
      persist-credentials: false
  - name: Put the trusted runner on PATH
    shell: bash
    run: |
      mkdir -p "$RUNNER_TEMP/bsf"
      cp -R .factory-trusted/.factory/bin/. "$RUNNER_TEMP/bsf/"
      # The definition and the sandbox decide how a change is judged, so
      # bsf reads them from this copy, never from the checkout.
      mkdir -p "$RUNNER_TEMP/bsf-trusted/.factory"
      for d in definition sandbox; do
        if [ -d ".factory-trusted/.factory/$d" ]; then cp -R ".factory-trusted/.factory/$d" "$RUNNER_TEMP/bsf-trusted/.factory/"; fi
      done
      echo "BSF_TRUSTED_ROOT=$RUNNER_TEMP/bsf-trusted" >> "$GITHUB_ENV"
      rm -rf .factory-trusted
      echo "$RUNNER_TEMP/bsf" >> "$GITHUB_PATH"
      "$RUNNER_TEMP/bsf/bsf" --version
  # Read-only, for the steps that fetch this item's data before the agent
  # starts. Minted here rather than handed to the agent: step outputs never
  # reach the agent's sandbox.
  - name: Mint a read-only token for the factory's data
    id: read-token
    uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.FACTORY_APP_CLIENT_ID }}
      private-key: ${{ secrets.FACTORY_APP_PRIVATE_KEY }}
      permission-contents: read
      permission-actions: read
      # Scoped to this repository: an App token otherwise reaches every repo
      # the installation covers.
      owner: ${{ github.repository_owner }}
      repositories: ${{ github.event.repository.name }}
  - name: Fetch the work item and triage's finding
    shell: bash
    env:
      GH_TOKEN: ${{ steps.read-token.outputs.token }}
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf fetch-work-item "$WORK_ITEM" --with-triage --out /tmp/gh-aw/agent/bsf/work-item.json

post-steps:
  # Write access, only after the agent has exited, for the steps that store
  # what it produced on the factory's data ref.
  - name: Mint a token to store this step's results
    id: write-token
    uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.FACTORY_APP_CLIENT_ID }}
      private-key: ${{ secrets.FACTORY_APP_PRIVATE_KEY }}
      permission-contents: write
      permission-actions: read
      # Scoped to this repository: an App token otherwise reaches every repo
      # the installation covers.
      owner: ${{ github.repository_owner }}
      repositories: ${{ github.event.repository.name }}
  - name: Write the StepReport with memex
    shell: bash
    env:
      GH_TOKEN: ${{ steps.write-token.outputs.token }}
      ROLE: spec
      ATTEMPT: ${{ inputs.attempt }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --out /tmp/gh-aw/agent/bsf/step-report.json
  - name: Write the spec back onto the work item
    shell: bash
    env:
      PIPELINE: ${{ inputs.pipeline }}
      GH_TOKEN: ${{ steps.write-token.outputs.token }}
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf write-spec "$WORK_ITEM" --from /tmp/gh-aw/agent/bsf/spec.json --pipeline "$PIPELINE"
---
# Spec

You are the spec writer for `${{ github.repository }}`. You turn a triaged work
item into a plan precise enough that the builder has nothing left to decide and
the verifier has something concrete to check. Write it to
`/tmp/gh-aw/agent/bsf/spec.json`.

## Read first — the factory's own rules

- `.factory/definition/context/feature-map.md`, `fundamentals.md`, `history.md`
- `.factory/definition/context/practices.md` — what this repo's owners have asked for
- `.factory/definition/policy.yaml` — what this pipeline may change, and what is protected
- `.factory/guardrails/` — the static rules every change is gated on
- `.factory/sandbox/manifest.json` — `capabilities` says what verification can
  exercise here

A plan that contradicts a practice, needs a protected path, or asks the verifier
to check something the sandbox cannot exercise will be rejected before any code
is written. Find that out now, not after the builder has spent an attempt.

## Research, then plan

Investigate before deciding. Two sides, and use both:

**The codebase.** Find every place the request touches: grep for the names in
it, read the files around them, follow the imports, read the tests that cover
them, and check `git log` for how this area has changed and why. Find the
dominant pattern for each concern the change involves. The question you are
answering: where does this belong, and how does this codebase already do it?

**The world.** When the request involves a library, an API, a file format, a
standard or a technique, look up how it actually works now — its current
documentation, not your memory of it. Check the version this repo uses. When
the request is vague about what good looks like, find out how this is usually
done.

Stop researching when you can answer, with evidence, every question the builder
would otherwise have to decide. Then write the plan.

## The plan

- **`plan`** — what changes, in two or three sentences. Behavior before, behavior
  after.
- **`files`** and **`feature_folders`** — exactly what the builder may touch. If
  you are not sure a file is needed, leave it out; the builder cannot add to
  this list, so an honest short list is better than a hopeful long one.
- **`acceptance_checks`** — each one a thing someone can *do* to the running app
  and see the result. "Clicking Export downloads a CSV with one row per
  invoice" is a check. "Export works correctly" is not. The verifier will work
  through these one at a time, so each has to be checkable on its own, and
  checkable in this sandbox.
- **`tests_added`** — tests for the new behavior.
- **`tests_changed`** — **every existing test file the build will modify or
  delete.** This list is load-bearing: the policy check fails the PR for editing
  an existing test that is not here. New test files need no declaration.
- **`research`** — what you found and where. One entry per finding the plan
  depends on. A `source` starts with one of three references, optionally
  followed by a note:
  - `path/to/file.ts` or `path/to/file.ts:42` — a file in this repo
  - `https://...` — a page in the world
  - `ran: <command>` — an experiment you ran here, with the command, so a
    reviewer can run it again
  A plan whose decisions do not trace to a source is rejected.

Before you finish, run
`.factory/bin/bsf spec check --file /tmp/gh-aw/agent/bsf/spec.json --pipeline P`,
with `P` the work item's `pipeline`. It applies the gate the spec must pass to be stored. Fix whatever it reports
and run it again until it passes.

## How to size it

The smallest change that satisfies the request. If the request implies a
refactor, the refactor is a separate work item: say so in `plan` rather than
folding it in. If the request cannot be done without touching more than a
handful of feature folders, that is a sign it should be split — say so.

## Then

Post the plan as a comment on the source issue, so the person who asked can see
what is about to be built. There is no approval step: the plan is visible, not
gated.

## Do not

- Do not write the code.
- Do not add acceptance checks the request did not ask for.
- Do not plan any new markdown file.
- Do not cite a source you did not read.
