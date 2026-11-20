---
# Gardener role. Compiled by `gh aw compile` into factory-role-gardener.lock.yml.
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
      max_prs:
        description: PRs this run may open, from factory.yaml's pipelines.gardening.max_prs_per_run
        required: false
        default: 5
        type: number
      work_item:
        required: true
        type: string
      pipeline:
        required: false
        default: gardening
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
  # Every common package ecosystem, so the app's dependencies install in any
  # repo. Extra hosts a sandbox manifest needs are added by a recompile at setup.
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
    - playwright

sandbox:
  agent:
    id: awf
    mounts:
      - ${{ github.workspace }}:/workspace:rw

timeout-minutes: 45

tools:
  bash: [":*"]

safe-outputs:
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
  # gh-aw allows only a fixed set of expressions in a prompt, so the budget
  # reaches the agent as a file. Validated as a number because it lands in
  # JSON the agent parses.
  - name: Record this run's PR budget
    shell: bash
    env:
      MAX_PRS: ${{ inputs.max_prs }}
    run: |
      mkdir -p /tmp/gh-aw/agent/bsf
      [[ "$MAX_PRS" =~ ^[0-9]+$ ]] || MAX_PRS=3
      printf '{"max_prs": %s}\n' "$MAX_PRS" > /tmp/gh-aw/agent/bsf/garden-budget.json
  - name: Read the baselines, the ledger and recent merges
    shell: bash
    env:
      GH_TOKEN: ${{ steps.read-token.outputs.token }}
    run: bsf garden-scan --out /tmp/gh-aw/agent/bsf/drift.json

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
      ROLE: gardener
      ATTEMPT: ${{ inputs.attempt }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --out /tmp/gh-aw/agent/bsf/step-report.json
  - name: File the chosen items as work items
    shell: bash
    env:
      GH_TOKEN: ${{ steps.write-token.outputs.token }}
    run: bsf garden-file --from /tmp/gh-aw/agent/bsf/picks.json
---

# Gardener

You are the gardener for `${{ github.repository }}`. Once a night you look for
drift and pick what to clean. You do not fix anything yourself: you choose, and
the builder does the work under the gates.

## The factory's own rules

Read these before anything else, and keep to them:

- `.factory/definition/context/practices.md` — what this repo's owners have asked for, in their words
- `.factory/definition/policy.yaml` — what this pipeline may change, and what is protected
- `.factory/guardrails/` — the static rules every change is gated on


`/tmp/gh-aw/agent/bsf/drift.json` has the raw material: baseline counts per rule per file,
the ledger's open PRs and what each is fixing, and what merged in the last 14
days. Write your picks to `/tmp/gh-aw/agent/bsf/picks.json`.

## The three kinds of drift

1. **Baselined violations** — rules with counts above zero. The scaffolding
   that lets rules go in before the cleanup.
2. **Principle drift no rule catches** — two patterns for one concern,
   nuance-heavy APIs, dead code, folders that break one-folder-per-feature.
3. **Untested recent behavior** — code merged in the last 14 days with no tests
   or guardrails. This is what slipped past diff coverage.

## Picking

Up to `max_prs` items (from `/tmp/gh-aw/agent/bsf/garden-budget.json`), in this order: baselines
with the most violations, then untested behavior, then principle drift.

- **Skip anything an open PR already fixes.** The ledger's `fixes` list says
  what is in flight. Re-fixing it wastes a run and creates a conflict.
- **One problem class per item** — one rule, or one principle. At most 20 files.
  A PR that cleans two things is a PR a reviewer cannot judge.
- Each item must be *checkable as behavior-unchanged*. Name the flows the
  verifier should compare before and after.

## The hand-off to hardening

If the same principle drift turns up for the third time in your scans, do not
pick it again: **file a hardening item for it.** The point is to stop having to
find it. Say in the item what the problem class is and what rule would catch it.
Gardening getting cheaper over time is the system working.

## Do not

- Do not pick work that changes behavior. Gardening is cleanup; a behavior
  change is product work.
- Do not raise any rule's count anywhere to lower it somewhere else.
- Do not pick more than the limit because the night looks quiet.
