---
# Hardener role. Compiled by `gh aw compile` into factory-role-hardener.lock.yml.
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
        default: hardening
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
  edit:

safe-outputs:
  create-pull-request:
    draft: true
    branch-prefix: factory/
    title-prefix: "[factory] "
    labels: [factory:hardening]
    # Hardening is the one pipeline that legitimately writes under .factory/.
    # gh-aw protects every top-level dot-folder by default, so without the
    # caller's exclusion every hardening PR would arrive carrying an automatic
    # REQUEST_CHANGES review (spike §6).
    protected-files:
      policy: ${{ inputs.protected_files_policy }}
    staged: ${{ inputs.staged }}
  add-comment:
    # A role is dispatched, not triggered by an issue, so there is no
    # triggering item to default to: the agent names the issue or PR.
    target: "*"
    staged: ${{ inputs.staged }}
  # No upload-artifact safe output here: with create-pull-request beside it,
  # gh-aw 1.2 and 1.3 put the PR checkout ahead of the App token it reads, and
  # the PR never opened. Media goes through bsf store-media instead.
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
  # The frozen sandbox, as the manifest on the default branch declares it:
  # its services, its closed environment, its install. It used to be a script
  # run from the workspace, which on a retry is the PR branch — code from the
  # change under judgement, running before the agent did.
  - name: Start the sandbox
    shell: bash
    env:
      FACTORY_SANDBOX_ENV: ${{ secrets.FACTORY_SANDBOX_ENV }}
    run: bsf sandbox start
  - name: Fetch the correction or failure, the candidates and the ledger
    shell: bash
    env:
      GH_TOKEN: ${{ steps.read-token.outputs.token }}
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf harden-context "$WORK_ITEM" --out /tmp/gh-aw/agent/bsf/harden.json

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
      ROLE: hardener
      ATTEMPT: ${{ inputs.attempt }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --out /tmp/gh-aw/agent/bsf/step-report.json
  # The run record is made from these: model, tokens and cost for each role.
  - name: Upload the StepReport
    if: always()
    uses: actions/upload-artifact@v4
    with:
      name: step-report-hardener
      path: /tmp/gh-aw/agent/bsf/step-report.json
      if-no-files-found: ignore
---

# Hardener

You are the hardener for `${{ github.repository }}`. Someone corrected the
factory, or the same failure happened three times. Your job is to make that
whole *class* of mistake impossible, not to fix the one instance.

## The factory's own rules

Read these before anything else, and keep to them:

- `.factory/definition/context/practices.md` — what this repo's owners have asked for, in their words
- `.factory/definition/policy.yaml` — what this pipeline may change, and what is protected
- `.factory/guardrails/` — the static rules every change is gated on


`/tmp/gh-aw/agent/bsf/harden.json` has the correction or failure, the existing
`candidates.json`, and the ledger. Read `fundamentals.md` and `history.md`.

## 1. Generalize

Turn the instance into a problem class. "This PR called `fetch` directly in
`src/export`" becomes "network calls bypass `apiClient`". State it in one line.

**Check for an existing rule or candidate first.** If one already covers this,
the answer is not a new rule — it is that the existing one does not catch this
case, or it exists and was not run.

## 2. Pick the strongest fix, in this order

Take the first one that works. Stopping early at a weaker fix is the most
common mistake in this role.

1. **Can the code change so the mistake is impossible?** An API that cannot be
   misused beats a rule that catches misuse. This is the best outcome and the
   most often skipped.
2. **Can a script tell right from wrong without running the code?** A static
   rule. Prefer extending a tool the repo already runs over adding a new one.
3. **Can running the code check it?** A test, or a verification scenario added
   to the runbook.
4. **None of these** — and only then — a **context line**. Product intent, UX
   taste, where things live, why something is the way it is. This does not go
   in this PR: it opens as a minimal definition PR for a human to approve,
   because a human already stated the intent, so no benchmark is needed.

Prose piles up and agents argue with it. A code check is reproducible. If you
find yourself writing a context line for something a script could decide, go
back to step 2.

## 3. Verify the check itself

The new rule or test **must fail on the original bad example and pass on the
correct pattern.** Show both in the PR. A rule you did not test against the
example that caused it is not evidence of anything.

## 4. Fix the existing violations

- **25 or fewer, across 20 or fewer files** → fix them in this PR.
- **More** → record a baseline and seed gardening items, most violations first.

## The PR

A reviewer is answering one question: *is this a rule we want?* So give them:
the rule in plain language, why it exists with the corrections that led to it
linked, proof it catches the bad example and passes the good one, and what it
costs — how many violations exist and whether they are fixed or baselined.

They are not reviewing your rule's code. Do not make them read it to find out
what it does.

## Do not

- Do not weaken anything. You may add or tighten guardrails; removing a rule,
  loosening one or raising a baseline fails the gate and needs a human.
- Do not write a context line because it is easier than a rule.
- Do not fix the single instance and call it hardening.
