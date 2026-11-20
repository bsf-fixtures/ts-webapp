---
# Builder role. Compiled by `gh aw compile` into factory-role-builder.lock.yml.
#
# A workflow_call reusable workflow, called as a job by factory-run (spike §3).
# Nothing dispatches and polls this: Actions sequences it, so no job is billed
# while waiting, and because this runs as its own job the verifier's runner has
# no filesystem path to this role's transcript.
on:
  # One block at the top covers every nested github-app token minting, so safe
  # outputs are applied with the factory App's token and their pushes start
  # factory-gates (spike §2).
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
      FACTORY_SANDBOX_ENV:
        required: false

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
  # Every common package ecosystem, so installing dependencies works in any
  # repo. A repo whose sandbox manifest needs more hosts is recompiled at
  # setup with them added; this is a compile-time literal.
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
    # The app's own environment is the devcontainer started in pre-agent-steps;
    # this mount is what lets the agent reach the workspace (spike §4b).
    mounts:
      - ${{ github.workspace }}:/workspace:rw

# Long enough for a real write, run, look, fix loop on a slow build; a
# builder that times out mid-loop ships a worse diff than one that never looped.
timeout-minutes: 75

tools:
  bash: [":*"]
  edit:
  # The builder looks at what it builds. It does not certify it — the
  # verifier does that in a job with no path to this transcript — but a
  # builder that never loads the page finds a visual break one full gate
  # cycle late.
  playwright:

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
  # The frozen sandbox, as the manifest on the default branch declares it:
  # its services, its closed environment, its install. It used to be a script
  # run from the workspace, which on a retry is the PR branch — code from the
  # change under judgement, running before the agent did.
  - name: Start the sandbox
    shell: bash
    env:
      FACTORY_SANDBOX_ENV: ${{ secrets.FACTORY_SANDBOX_ENV }}
    run: bsf sandbox start
  - name: Fetch the work item and its spec from factory-data
    shell: bash
    env:
      GH_TOKEN: ${{ steps.read-token.outputs.token }}
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf fetch-work-item "$WORK_ITEM" --out /tmp/gh-aw/agent/bsf/work-item.json
  - name: Fetch the previous attempt's gate failures, if any
    if: inputs.attempt > 1
    shell: bash
    env:
      GH_TOKEN: ${{ steps.read-token.outputs.token }}
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf fetch-gate-failures "$WORK_ITEM" --out /tmp/gh-aw/agent/bsf/gate-failures.json

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
  # memex reads the harness's own session log for tokens and cost. The log is
  # the source of truth; agents' own cost reporting is uneven (doc 07).
  - name: Write the StepReport with memex
    id: report
    shell: bash
    env:
      GH_TOKEN: ${{ steps.write-token.outputs.token }}
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

Implement the spec in `/tmp/gh-aw/agent/bsf/work-item.json` with the **smallest
correct change**, plus tests for new behavior.

## Read first

- `.factory/definition/context/feature-map.md` — what exists and where
- `.factory/definition/context/runbook.md` — how to build, run and test
- `.factory/definition/context/fundamentals.md` — conventions no check enforces
- `.factory/definition/context/practices.md` — what this repo's owners have asked for, in their words
- `.factory/definition/context/history.md` — lessons from past failures
- `.factory/definition/policy.yaml` — which paths this pipeline may change, and which are protected
- `.factory/guardrails/` — the static rules your change is gated on, and their baselines
- `.factory/sandbox/manifest.json` — how the app runs here, and what this sandbox can and cannot exercise

The guardrails and the policy are not suggestions. A change that breaks one
fails the gate after you have finished; reading them first is cheaper.

## The app is already set up

The sandbox has installed the app's dependencies and started any services it
needs. Its environment is in `.factory/sandbox/.runtime.env`: **source it in
every shell you start the app from**, because the sandbox gives the app exactly
those variables and nothing else.

```bash
source .factory/sandbox/.runtime.env
```

The manifest's `commands` say how to build, run and test, and `app_url` says
where the running app answers.

## How to work

1. Read the spec. Change only the files it names, in the feature folders it names.
2. Follow the dominant pattern for each concern. The codebase is the largest
   input you get: copy the patterns already there, and do not introduce a second
   way of doing something that already has one.
3. Work in a loop, the way a developer does:
   - make a change;
   - run the repo's fast checks — the manifest's `test` command, plus any lint
     or type check the runbook names;
   - **if the change is visible, start the app and look at it.** Run the
     manifest's `run` command in the background, open `app_url` with the
     browser tool, and go to the screen the spec is about. Do what a user would
     do there. Check the console for errors;
   - when what you see is not what the spec asks for, fix it and look again.

   Stop when your own checks pass and the screen does what the spec says. Do
   not stop at "the tests pass" for a change someone will look at.
4. Add tests for new or changed behavior. You may modify or delete an existing
   test **only if the spec's `tests_changed` lists it** — an undeclared edit
   fails the policy check, and new test files are always fine.
5. Keep the change minimal. Unrequested refactors, new dependencies and new
   markdown files all fail review.

Your own looking is for you. The verifier checks the result separately, in a
job with no access to anything you did here, and the gates re-run everything.
That is why you are free to look as much as you like: looking is not
certifying.

## If this work item is a practice

A work item titled `Practice: …` in the `definition` pipeline is a standing
instruction from one of this repo's maintainers. Every agent will follow it
from now on, so record it exactly and enforce it where a rule can:

1. Add one row to `.factory/definition/context/practices.md`: the practice in
   their words, who stated it (the work item's `source.actor`), today's date,
   and how it is enforced.
2. If a static rule can check it — a naming pattern, a forbidden import, a
   required header — add it to `.factory/guardrails/candidates.json` as a
   candidate whose source is `{ "kind": "user_declared" }`, with the practice
   as its quote, and write "rule candidate" in the row's last column. The
   factory's rule promotion turns it into a checked rule.
3. If it takes judgement, write "read by every role" in that column instead.
4. Do not change any code to comply with it in this PR. Bringing existing code
   into line is separate work, which gardening will pick up.

Nothing else in the definition changes in a practice PR.

## If this is a retry

If `/tmp/gh-aw/agent/bsf/gate-failures.json` exists, the gates rejected the last
attempt and that file says why. Fix exactly those failures. Do not take the
opportunity to change anything else: each gate allows 3 attempts per work item,
and the third failure escalates to a human.

## If the sandbox cannot run what you need

If the change touches something the manifest lists under
`capabilities.not_exercised`, or the app cannot do what the spec needs because
a service or credential it relies on is not in the sandbox, do the change
anyway, and write `/tmp/gh-aw/agent/bsf/sandbox-report.json`:

```json
{ "role": "builder", "needs": "what you could not exercise", "paths": ["the files involved"], "why": "what stopped you" }
```

That report is how the sandbox gets amended. Do not work around a missing
service by editing the sandbox, the manifest or the runtime environment
yourself.

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
