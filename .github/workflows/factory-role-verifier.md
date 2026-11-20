---
# Verifier role. Compiled by `gh aw compile` into factory-role-verifier.lock.yml.
#
# Runs as its own workflow_call job, on its own runner. That is what makes
# "the verifier never sees the builder's transcript" structural rather than a
# rule bsf has to keep (spike §3): there is no filesystem path from here to it.
# It receives the spec and the result, and nothing else.
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
  allowed:
    - api.anthropic.com
    - registry.npmjs.org
    - pypi.org
    - files.pythonhosted.org

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
  - name: Start the devcontainer and any services the app needs
    shell: bash
    run: .factory/sandbox/start.sh
  - name: Check out the exact commit under verification
    shell: bash
    env:
      COMMIT: ${{ inputs.commit }}
    run: git checkout --detach "$COMMIT"
  - name: Fetch the spec only — never the builder's transcript
    shell: bash
    env:
      WORK_ITEM: ${{ inputs.work_item }}
    run: bsf fetch-work-item "$WORK_ITEM" --spec-only --out /tmp/gh-aw/agent/bsf/spec.json

post-steps:
  - name: Write the StepReport with memex
    shell: bash
    env:
      ROLE: verifier
      ATTEMPT: ${{ inputs.attempt }}
    run: bsf step-report --role "$ROLE" --attempt "$ATTEMPT" --out /tmp/gh-aw/agent/bsf/step-report.json
  - name: Store the reviewed media and upload the raw artifacts
    shell: bash
    run: bsf store-media --run-dir /tmp/gh-aw/agent/bsf/media
  - name: Upload the StepReport and evidence
    uses: actions/upload-artifact@v4
    with:
      name: verification-${{ inputs.attempt }}
      path: /tmp/gh-aw/agent/bsf/
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

## What to do

1. Start the app the way the runbook's `## Run` section says.
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

## Do not

- Do not fix the code. If something is broken, report it; the builder gets
  another attempt.
- Do not take a passing test suite as evidence that the behavior works. The
  tests are a separate gate. Your job is the running app.
- Do not describe evidence you did not capture.
