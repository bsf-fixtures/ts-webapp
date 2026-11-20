---
# Builder role. Compiled by `gh aw compile` into factory-role-builder.lock.yml.
#
# A workflow_call reusable workflow, called as a job by factory-run (spike §3).
# Nothing dispatches and polls this: Actions sequences it, so no job is billed
# while waiting, and because this runs as its own job the verifier's runner has
# no filesystem path to this role's transcript.
on:
  workflow_call:
    inputs:
      model:
        description: This role's model, from factory.yaml, read by the caller with `bsf models`
        required: true
        type: string
      work_item:
        description: Work item id, e.g. wi_01JD8Z...
        required: true
        type: string
      pipeline:
        description: product_work | gardening | hardening | conflict
        required: true
        type: string
      attempt:
        description: Gate attempt number, 1..retry_cap
        required: false
        default: 1
        type: number
      pr_number:
        description: Set from attempt 2 onward, to push to the open draft PR
        required: false
        default: 0
        type: number
      gate_failures:
        description: Artifact id holding the previous attempt's gate failures
        required: false
        default: ''
        type: string
      protected_files_policy:
        description: >-
          gh-aw's protected-file policy for the calling pipeline. gh-aw protects
          every top-level dot-folder by default, .factory/ included, so the
          caller chooses this per pipeline (spike §6).
        required: false
        default: request-review
        type: string
      staged:
        description: Preview mode — emit step summaries instead of GitHub API calls
        required: false
        default: false
        type: boolean
    secrets:
      ANTHROPIC_API_KEY:
        required: true
      FACTORY_APP_PRIVATE_KEY:
        required: true

# One block at the top covers every nested github-app token minting, so safe
# outputs are applied with the factory App's token and their pushes start
# factory-gates (spike §2).
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

# gh-aw's firewall: the model API and package registries only.
network:
  allowed:
    - api.anthropic.com
    - registry.npmjs.org
    - pypi.org
    - files.pythonhosted.org

sandbox:
  agent:
    id: awf
    # The app's own environment is the devcontainer started in pre-agent-steps;
    # this mount is what lets the agent reach the workspace (spike §4b).
    mounts:
      - ${{ github.workspace }}:/workspace:rw

timeout-minutes: 45

tools:
  bash: [":*"]
  edit:

safe-outputs:
  # Attempt 1 opens the draft PR; later attempts push to its branch.
  create-pull-request:
    draft: true
    branch-prefix: factory/
    title-prefix: "[factory] "
    labels: [factory:in-progress]
    protected-files:
      policy: ${{ inputs.protected_files_policy }}
    staged: ${{ inputs.staged }}
    if-no-changes: error
  push-to-pull-request-branch:
    target: ${{ inputs.pr_number }}
    protected-files:
      policy: ${{ inputs.protected_files_policy }}
    staged: ${{ inputs.staged }}
  add-comment:
    staged: ${{ inputs.staged }}
  # Threat detection runs on every safe output before a separate job applies it.
  threat-detection:
    enabled: true
  upload-artifact:

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
  # Build and start the app's own environment. The agent stays in AWF's
  # container and reaches the app from there (spike §4b).
  - name: Start the devcontainer and any services the app needs
    shell: bash
    run: .factory/sandbox/start.sh
  - name: Fetch the work item and its spec from factory-data
    shell: bash
    env:
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf fetch-work-item "$WORK_ITEM" --out /tmp/gh-aw/agent/bsf/work-item.json
  - name: Fetch the previous attempt's gate failures, if any
    if: inputs.attempt > 1
    shell: bash
    env:
      GATE_FAILURES: ${{ inputs.gate_failures }}
    run: bsf fetch-artifact "$GATE_FAILURES" --out /tmp/gh-aw/agent/bsf/gate-failures.json

post-steps:
  # memex reads the harness's own session log for tokens and cost. The log is
  # the source of truth; agents' own cost reporting is uneven (doc 07).
  - name: Write the StepReport with memex
    id: report
    shell: bash
    env:
      ROLE: builder
      ATTEMPT: ${{ inputs.attempt }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --out /tmp/gh-aw/agent/bsf/step-report.json
  - name: Upload the StepReport
    uses: actions/upload-artifact@v4
    with:
      name: step-report-builder-${{ inputs.attempt }}
      path: /tmp/gh-aw/agent/bsf/step-report.json
---

# Builder

You are the builder for `${{ github.repository }}`.

Implement the spec in `/tmp/gh-aw/agent/bsf/work-item.json` with the **smallest correct
change**, plus tests for new behavior.

## Read first

- `.factory/definition/context/feature-map.md` — what exists and where
- `.factory/definition/context/runbook.md` — how to build, run and test
- `.factory/definition/context/fundamentals.md` — conventions no check enforces
- `.factory/definition/context/history.md` — lessons from past failures

## What to do

1. Read the spec. Change only the files it names, in the feature folders it names.
2. Follow the dominant pattern for each concern. The codebase is the largest
   input you get: copy the patterns already there, and do not introduce a second
   way of doing something that already has one.
3. Add tests for new or changed behavior. You may modify or delete an existing
   test **only if the spec's `tests_changed` lists it** — an undeclared edit
   fails the policy check, and new test files are always fine.
4. Run the repo's own fast checks as you go, from the runbook's `## Test` section.
5. Keep the change minimal. Unrequested refactors, new dependencies and new
   markdown files all fail review.

## If this is a retry

If `/tmp/gh-aw/agent/bsf/gate-failures.json` exists, the gates rejected the last
attempt and that file says why. Fix exactly those failures. Do not take the
opportunity to change anything else: each gate allows 3 attempts per work item,
and the third failure escalates to a human.


## Do not

- Write any markdown the spec did not ask for.
- Touch `.github/`, or anything under `.factory/` unless this pipeline's
  allowlist includes it.
- Weaken a guardrail. Removing or loosening a rule, raising a baseline,
  lowering the coverage floor or adding a skip without a reason all fail the
  gate and need a human.
- Report that the tests pass as evidence. The factory runs the gates itself, in
  a job you are not in; your own run of them is for your benefit, not the
  reviewer's.
