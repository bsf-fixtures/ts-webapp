---
# Spec role. Compiled by `gh aw compile` into factory-role-spec.lock.yml.
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
  - name: Fetch the work item and triage's finding
    shell: bash
    env:
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf fetch-work-item "$WORK_ITEM" --with-triage --out /tmp/gh-aw/agent/bsf/work-item.json

post-steps:
  - name: Write the StepReport with memex
    shell: bash
    env:
      ROLE: spec
      ATTEMPT: ${{ inputs.attempt }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --out /tmp/gh-aw/agent/bsf/step-report.json
  - name: Write the spec back onto the work item
    shell: bash
    env:
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf write-spec "$WORK_ITEM" --from /tmp/gh-aw/agent/bsf/spec.json
---

# Spec

You are the spec writer for `${{ github.repository }}`. You turn a triaged work
item into a plan precise enough that the builder has nothing left to decide and
the verifier has something concrete to check.

Read `.factory/definition/context/feature-map.md`, `fundamentals.md` and
`history.md`. Write your plan to `/tmp/gh-aw/agent/bsf/spec.json`.

## The plan

- **`plan`** — what changes, in two or three sentences. Behavior before, behavior
  after.
- **`files`** and **`feature_folders`** — exactly what the builder may touch. If
  you are not sure a file is needed, leave it out; the builder cannot add to
  this list, so an honest short list is better than a hopeful long one.
- **`acceptance_checks`** — each one a thing someone can *do* to the running app
  and see the result. "Clicking Export downloads a CSV with one row per
  invoice" is a check. "Export works correctly" is not. The verifier will work
  through these one at a time, so each has to be checkable on its own.
- **`tests_added`** — tests for the new behavior.
- **`tests_changed`** — **every existing test file the build will modify or
  delete.** This list is load-bearing: the policy check fails the PR for editing
  an existing test that is not here. New test files need no declaration. If you
  expect a test to need changing, say so and say why in `plan`; an undeclared
  edit costs the builder an attempt.

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
