---
# Gardener role. Compiled by `gh aw compile` into factory-role-gardener.lock.yml.
# A workflow_call reusable workflow called as a job by factory-garden, once a night.
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
      budget_key:
        description: Where this step's budget hold is kept; the caller settles it with the same key
        required: false
        default: ''
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
    # Bounds on any one request, which is what the budget's margin is built
    # on: the 200k window instead of 1M, and Claude Code's default output cap
    # made explicit. Change one and the budget's ceilings are wrong.
    CLAUDE_CODE_DISABLE_1M_CONTEXT: "1"
    CLAUDE_CODE_MAX_OUTPUT_TOKENS: "32000"

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
# A ceiling per run, in gh-aw AI credits (1 credit = $0.01). A normal run is
# well under it; it stops a runaway before it costs a week's budget.
max-ai-credits: 150

tools:
  bash: [":*"]

safe-outputs:
  upload-artifact:
  threat-detection:
    enabled: true
    # The scan for injected or malicious output reads one diff and one
    # transcript: a small model does it, not the role's own.
    engine:
      id: claude
      model: claude-haiku-5-5
      max-turns: 3
      env:
        CLAUDE_CODE_DISABLE_1M_CONTEXT: "1"
        CLAUDE_CODE_MAX_OUTPUT_TOKENS: "32000"
    max-ai-credits: 50

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
  # The budget: this step starts only if what is spent this month, what
  # running steps hold, and the most this step can cost (its credit cap plus
  # one request past it, for the agent and for threat detection) all fit.
  # A refusal fails here, before the agent spends anything.
  - name: Mint a token for the budget record
    id: budget-token
    uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.FACTORY_APP_CLIENT_ID }}
      private-key: ${{ secrets.FACTORY_APP_PRIVATE_KEY }}
      permission-contents: write
      owner: ${{ github.repository_owner }}
      repositories: ${{ github.event.repository.name }}
  - name: Hold this step's budget
    shell: bash
    env:
      GH_TOKEN: ${{ steps.budget-token.outputs.token }}
      BUDGET_KEY: ${{ inputs.budget_key || format('{0}-{1}-gardener-{2}', github.run_id, github.run_attempt, inputs.attempt) }}
      PIPELINE: ${{ inputs.pipeline }}
      MODEL: ${{ inputs.model }}
    run: bsf budget reserve --key "$BUDGET_KEY" --pipeline "$PIPELINE" --role gardener --model "$MODEL" --cap 150 --detection-model claude-haiku-5-5 --detection-cap 50
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
  # What this step spent, for the caller's settle job: the agent's cost as
  # the session recorded it (or priced from its tokens at list price, if
  # higher), and the name of the threat-detection artifact, whose usage the
  # settle job prices. Runs even when the agent failed: a failed step spent
  # too, and a missing measure is charged at the ceiling.
  - name: Measure this step's cost for the budget
    if: always()
    shell: bash
    env:
      BUDGET_KEY: ${{ inputs.budget_key || format('{0}-{1}-gardener-{2}', github.run_id, github.run_attempt, inputs.attempt) }}
      MODEL: ${{ inputs.model }}
      DETECTION_ARTIFACT: ${{ needs.activation.outputs.artifact_prefix }}detection
      PIPELINE: ${{ inputs.pipeline }}
    run: bsf budget measure --key "$BUDGET_KEY" --pipeline "$PIPELINE" --model "$MODEL" --detection-artifact "$DETECTION_ARTIFACT" --out /tmp/gh-aw/bsf-budget/measure.json
  - name: Upload the budget measure
    if: always()
    uses: actions/upload-artifact@v4
    with:
      name: budget-${{ inputs.budget_key || format('{0}-{1}-x', github.run_id, github.run_attempt) }}
      path: /tmp/gh-aw/bsf-budget/measure.json
      if-no-files-found: ignore
  # Write access, only after the agent has exited, for the steps that store
  # what it produced on the factory's data ref.
  - name: Mint a token to store this step's results
    id: write-token
    uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.FACTORY_APP_CLIENT_ID }}
      private-key: ${{ secrets.FACTORY_APP_PRIVATE_KEY }}
      permission-contents: write
      permission-actions: write
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
      MODEL: ${{ inputs.model }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --model "$MODEL" --out /tmp/gh-aw/agent/bsf/step-report.json
  # The run record is made from these: model, tokens and cost for each role.
  - name: Upload the StepReport
    if: always()
    uses: actions/upload-artifact@v4
    with:
      name: step-report-gardener
      path: /tmp/gh-aw/agent/bsf/step-report.json
      if-no-files-found: ignore
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
- **Picks must not overlap.** No two picks, and no pick and an open gardening
  item, may change the same files. Each runs as its own PR at the same time,
  so overlapping picks race and conflict. List every file a pick will touch
  in its `files`; a pick with no `files` is taken as repo-wide and blocks the
  rest. Picks that overlap are dropped after the first.
- **A shared prerequisite is one pick.** If several picks would each need the
  same missing thing first (a test runner, a config, a helper), pick only that
  prerequisite tonight. The others become possible once it merges.
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
