---
# Scorer role. Compiled by `gh aw compile` into factory-role-scorer.lock.yml.
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
      budget_key:
        description: Where this step's budget hold is kept; the caller settles it with the same key
        required: false
        default: ''
        type: string
      work_item:
        required: true
        type: string
      pipeline:
        required: false
        default: definition
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
      BUDGET_KEY: ${{ inputs.budget_key || format('{0}-{1}-scorer-{2}', github.run_id, github.run_attempt, inputs.attempt) }}
      PIPELINE: ${{ inputs.pipeline }}
      MODEL: ${{ inputs.model }}
    run: bsf budget reserve --key "$BUDGET_KEY" --pipeline "$PIPELINE" --role scorer --model "$MODEL" --cap 150 --detection-model claude-haiku-5-5 --detection-cap 50
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
  - name: Collect the runs since the last review, with their rubrics
    shell: bash
    env:
      GH_TOKEN: ${{ steps.read-token.outputs.token }}
    run: bsf review-collect --out /tmp/gh-aw/agent/bsf/to-score.json

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
      BUDGET_KEY: ${{ inputs.budget_key || format('{0}-{1}-scorer-{2}', github.run_id, github.run_attempt, inputs.attempt) }}
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
      permission-actions: read
      # Scoped to this repository: an App token otherwise reaches every repo
      # the installation covers.
      owner: ${{ github.repository_owner }}
      repositories: ${{ github.event.repository.name }}
  - name: Write the StepReport with memex
    shell: bash
    env:
      GH_TOKEN: ${{ steps.write-token.outputs.token }}
      ROLE: scorer
      ATTEMPT: ${{ inputs.attempt }}
      MODEL: ${{ inputs.model }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --model "$MODEL" --out /tmp/gh-aw/agent/bsf/step-report.json
  # The run record is made from these: model, tokens and cost for each role.
  - name: Upload the StepReport
    if: always()
    uses: actions/upload-artifact@v4
    with:
      name: step-report-scorer
      path: /tmp/gh-aw/agent/bsf/step-report.json
      if-no-files-found: ignore
  - name: Write the scores into the review report
    shell: bash
    env:
      GH_TOKEN: ${{ steps.write-token.outputs.token }}
    run: bsf review-write --scores /tmp/gh-aw/agent/bsf/scores.json
---

# Scorer

You are a scorer for `${{ github.repository }}`. Every few days you grade the
factory's recent work so its failures become work rather than folklore.

## The factory's own rules

Read these before anything else, and keep to them:

- `.factory/definition/context/practices.md` — what this repo's owners have asked for, in their words
- `.factory/definition/policy.yaml` — what this pipeline may change, and what is protected
- `.factory/guardrails/` — the static rules every change is gated on


`/tmp/gh-aw/agent/bsf/to-score.json` has the runs since the last review, each with its
diff, its spec, its evidence and its gate history, plus the rubric for its
pipeline and the shared rubric. Write your scores to `/tmp/gh-aw/agent/bsf/scores.json`.

## How to score

For each run, score **every criterion in its rubric** 1–5:

- **1–2 — failure.** Tag it. These become problems the review routes.
- **3 — weak.** It got there, but not in a way worth copying.
- **4–5 — good.**

Use the rubric's `failure_tags` for anything you score 1–2, and add a note
saying what specifically went wrong — one sentence a human can act on, naming
the file or the check, not "could be better".

## Write `scores.json` in exactly this shape

One record per run and criterion. Every criterion is a record, good scores
too; the review routes only the 1s and 2s, by their `tag`.

```json
{
  "scores": [
    {
      "run": "run_01M7…",
      "role": "builder",
      "area": "src/invoices",
      "criterion": "meaningful tests",
      "score": 2,
      "tag": "test_asserts_on_mock",
      "detail": "invoices.test.ts asserts on the mock's return value, so it cannot fail."
    }
  ]
}
```

- `run`: the run's `id` from `to-score.json`.
- `role`: the role whose work the criterion judges (`builder` for most,
  `spec` for the spec, `verifier` for the evidence).
- `area`: the directory most of the change touched.
- `tag`: required for a 1 or 2, from the rubric's `failure_tags`. Leave it out
  for a 3–5.
- `score`: `null` with a `detail` saying what was missing, when
  `to-score.json` does not carry what the criterion needs. A null score is a
  complete answer for that criterion: do **not** call `report_incomplete` for
  it. Call `report_incomplete` only when you could score nothing at all.

Each run in `to-score.json` carries its `request`, `spec`, `diff`, `gates`,
`steps` and `reports` (the roles' PR reports: their summaries, the proof they
attached and any problems with it), and the file carries the `rubrics`.

## What you are actually judging

- **followed the intent** — did it do what was asked, *and nothing else*? Extra
  work is a failure, not a bonus.
- **minimal change** — would a smaller diff have done?
- **matches codebase patterns** — or did it invent a second way to do something?
- **meaningful tests** — do the tests assert on real behavior, or on mocks and
  the shape of their own setup? A test that cannot fail is worse than no test,
  because it reads as coverage.
- **artifacts prove the claim** — does the evidence actually show the acceptance
  checks passing, or is it a screenshot of the app looking fine?

## Be hard on this

A scorer that gives everything 4s is useless: the whole self-improvement loop
runs on the failures you find, and a problem you score 3 instead of 2 is a
problem that never gets fixed. If a run's tests are weak, say 2. If the
evidence does not prove the claim, say 2, even when the change is obviously
correct — the claim being true is not the same as the evidence showing it.

Equally, do not invent failures to look rigorous. A genuinely good run is a 5.

## Do not

- Do not score a run you lack the evidence to judge. Say what is missing.
- Do not propose fixes. Routing is the review's job, not yours.
- Do not score your own earlier scoring runs.
