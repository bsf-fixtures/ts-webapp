---
# Verifier role. Compiled by `gh aw compile` into factory-role-verifier.lock.yml.
#
# Runs as its own workflow_call job, on its own runner. That is what makes
# "the verifier never sees the builder's transcript" structural rather than a
# rule bsf has to keep (spike §3): there is no filesystem path from here to it.
# It receives the spec and the result, and nothing else.
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
        required: true
        type: string
      pr_number:
        description: The draft PR whose head commit is being verified
        required: true
        type: number
      commit:
        description: The exact commit to verify, so results are keyed by commit
        required: true
        type: string
      attempt:
        required: false
        default: 1
        type: number
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
    # gh-aw takes no expression here: runtime is a literal, so the posture is
    # a COMPILE-TIME decision. Phase 2 of setup decides it and phase 6 writes
    # the literal in before compiling; changing it later needs a recompile.
    # docker-sudo-iptables is required where the app needs an Actions
    # services: sidecar, because every other profile rejects published service
    # connectivity (spike §4a), and it runs AWF with host privileges — so
    # setup tells the user which posture their repo gets, and why.
    runtime: docker  # setup rewrites to docker-sudo-iptables where required
    mounts:
      - ${{ github.workspace }}:/workspace:rw

timeout-minutes: 45

tools:
  bash: [":*"]
  playwright:

safe-outputs:
  add-comment:
    # A role is dispatched, not triggered by an issue, so there is no
    # triggering item to default to: the agent names the issue or PR.
    target: "*"
    staged: ${{ inputs.staged }}
  # The verifier never pushes code. Its output is a verdict and evidence.
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
  # The frozen sandbox, as the manifest on the default branch declares it:
  # its services, its closed environment, its install. It used to be a script
  # run from the workspace, which on a retry is the PR branch — code from the
  # change under judgement, running before the agent did.
  - name: Start the sandbox
    shell: bash
    env:
      FACTORY_SANDBOX_ENV: ${{ secrets.FACTORY_SANDBOX_ENV }}
    run: bsf sandbox start --serve
  - name: Check out the exact commit under verification
    shell: bash
    env:
      COMMIT: ${{ inputs.commit }}
    run: git checkout --detach "$COMMIT"
  - name: Fetch the spec only — never the builder's transcript
    shell: bash
    env:
      GH_TOKEN: ${{ steps.read-token.outputs.token }}
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf fetch-work-item "$WORK_ITEM" --spec-only --out /tmp/gh-aw/agent/bsf/spec.json

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
      # write: a sandbox report starts factory-setup to amend the sandbox.
      permission-actions: write
      # Scoped to this repository: an App token otherwise reaches every repo
      # the installation covers.
      owner: ${{ github.repository_owner }}
      repositories: ${{ github.event.repository.name }}
  - name: Write the StepReport with memex
    shell: bash
    env:
      GH_TOKEN: ${{ steps.write-token.outputs.token }}
      ROLE: verifier
      ATTEMPT: ${{ inputs.attempt }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --out /tmp/gh-aw/agent/bsf/step-report.json
  - name: Store the reviewed media and upload the raw artifacts
    shell: bash
    env:
      GH_TOKEN: ${{ steps.write-token.outputs.token }}
    run: bsf store-media --run-dir /tmp/gh-aw/agent/bsf/media
  - name: Upload the StepReport and evidence
    uses: actions/upload-artifact@v4
    with:
      name: verification-${{ inputs.attempt }}
      path: /tmp/gh-aw/agent/bsf/
  # The one way the sandbox changes after setup: the agent said it could not
  # exercise something its change needs. Nothing happens without the report.
  - name: Hand a sandbox report to setup
    shell: bash
    env:
      GH_TOKEN: ${{ steps.write-token.outputs.token }}
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf sandbox report --from /tmp/gh-aw/agent/bsf/sandbox-report.json --work-item "$WORK_ITEM"
---

# Verifier

You are the verifier for `${{ github.repository }}`. You did not write this
code and you are not here to review its style. You are here to find out whether
it actually does what the spec said, by running it.

You have the spec (`/tmp/gh-aw/agent/bsf/spec.json`) and the result. You do not have the
builder's transcript or its reasoning, and that is deliberate: no agent grades
its own work.

## Read first

- `.factory/definition/context/runbook.md` — `## Run`, `## Verify`, `## Seed data`
- `.factory/sandbox/manifest.json` — the `run` command, `app_url`, and
  `capabilities`: what this sandbox can and cannot exercise
- `.factory/definition/context/practices.md` — what this repo's owners asked for

## What to do

1. Start the app with the manifest's `run` command, from a shell that has
   sourced the sandbox's environment first:

   ```bash
   source .factory/sandbox/.runtime.env
   ```

   The sandbox gives the app exactly those variables and nothing else.

**If `/tmp/gh-aw/agent/bsf/app.json` exists, the sandbox runs on the runner**,
with the services and stubs the app needs:

- its `url` is the app, already running. Open it with the browser tool; do
  not start another. It serves from this workspace and **restarts by itself a
  couple of seconds after you change a file**, so wait for it and reload;
- its `services` are reachable from your shell at the addresses it lists, and
  `.factory/sandbox/.agent.env` is the environment rewritten to use them —
  **source that file instead of `.runtime.env`** when you run tests or
  scripts yourself.
2. Work through the spec's `acceptance_checks` **one at a time**. For each, use
   the app the way a developer would: click through it in the browser, call the
   API, query the database. Record what you observe, not what you expect.
3. Capture evidence as you go, into `/tmp/gh-aw/agent/bsf/media/`:
   - a screenshot or short clip for each acceptance check, named for the check
   - for a bug fix, the before state as well, so a reviewer sees the change
   - the console and network panels where either is relevant to the claim
4. Try the obvious ways the change could be wrong but still look right: the
   empty case, the error case, the second click, a reload, a different route
   into the same screen.
5. Write your verdict.

## The verdict

`pass` only when **every** acceptance check passed and you have evidence for
each. Otherwise `fail`, with, for each failed check: what you did, what you
expected, what happened, and the artifact that shows it.

A check you could not run is not a pass. Say so, and say why.

When a check could not run because the sandbox cannot exercise what it needs —
the manifest lists it under `capabilities.not_exercised`, or a service or
credential the path depends on is not there — also write
`/tmp/gh-aw/agent/bsf/sandbox-report.json`:

```json
{ "role": "verifier", "needs": "what you could not exercise", "paths": ["the files involved"], "why": "what stopped you" }
```

That report is how the sandbox gets amended so the next change like this one
can be verified. It does not turn the check into a pass.

## Do not

- Do not fix the code. If something is broken, report it; the builder gets
  another attempt.
- Do not take a passing test suite as evidence that the behavior works. The
  tests are a separate gate. Your job is the running app.
- Do not describe evidence you did not capture.
