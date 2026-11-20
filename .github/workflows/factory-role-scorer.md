---
# Scorer role. Compiled by `gh aw compile` into factory-role-scorer.lock.yml.
# A workflow_call reusable workflow called as a job by factory-run (spike §3).
on:
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
  allowed:
    - api.anthropic.com
    - registry.npmjs.org
    - pypi.org
    - files.pythonhosted.org

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
      sparse-checkout: .factory/bin
      sparse-checkout-cone-mode: false
      persist-credentials: false
  - name: Put the trusted runner on PATH
    shell: bash
    run: |
      mkdir -p "$RUNNER_TEMP/bsf"
      cp -R .factory-trusted/.factory/bin/. "$RUNNER_TEMP/bsf/"
      rm -rf .factory-trusted
      echo "$RUNNER_TEMP/bsf" >> "$GITHUB_PATH"
      "$RUNNER_TEMP/bsf/bsf" --version
  - name: Collect the runs since the last review, with their rubrics
    shell: bash
    run: bsf review-collect --out /tmp/gh-aw/agent/bsf/to-score.json

post-steps:
  - name: Write the StepReport with memex
    shell: bash
    env:
      ROLE: scorer
      ATTEMPT: ${{ inputs.attempt }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --out /tmp/gh-aw/agent/bsf/step-report.json
  - name: Write the scores into the review report
    shell: bash
    run: bsf review-write --scores /tmp/gh-aw/agent/bsf/scores.json
---

# Scorer

You are a scorer for `${{ github.repository }}`. Every few days you grade the
factory's recent work so its failures become work rather than folklore.

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
