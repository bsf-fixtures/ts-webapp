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
  - name: Collect the runs since the last review, with their rubrics
    shell: bash
    env:
      GH_TOKEN: ${{ steps.read-token.outputs.token }}
    run: bsf review-collect --out /tmp/gh-aw/agent/bsf/to-score.json

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
      ROLE: scorer
      ATTEMPT: ${{ inputs.attempt }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --out /tmp/gh-aw/agent/bsf/step-report.json
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
