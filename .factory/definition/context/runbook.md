<!--
  How to build, run, test and verify this app. Written by setup's phase 2,
  with every command tested rather than copied from a README.

  This is the most load-bearing context file: a verifier agent that cannot
  start the app cannot verify anything, and then the factory produces
  confident unverified PRs.
-->

# Runbook — {{REPO_NAME}}

## Build

```bash
{{BUILD_COMMAND}}
```

{{BUILD_NOTES}}

## Run

```bash
{{RUN_COMMAND}}
```

The app is then at {{APP_URL}}.

## Test

```bash
{{TEST_COMMAND}}
```

{{TEST_NOTES}}

## Verify

How to see for yourself that the app works, as a developer would:

{{VERIFY_STEPS}}

## Seed data

```bash
{{SEED_COMMAND}}
```

{{SEED_NOTES}}

## Commands that change persistent state

These are kept out of the build path on purpose. Each one writes to something
that outlives the process, so running it against the wrong target is the kind
of mistake that cannot be undone by reverting a commit.

| Command | Writes to | Only when |
| --- | --- | --- |
{{STATEFUL_COMMAND_ROWS}}

## Services this app needs

| Service | How it starts | Reached at |
| --- | --- | --- |
{{SERVICE_ROWS}}

## The sandbox's environment

Built from this list, and from nothing else. It does not inherit a
developer's environment and it does not read any `.env` file, because a
documented build command that runs a migration would otherwise migrate
whatever a developer's credentials happen to point at.

| Variable | Value in the sandbox |
| --- | --- |
{{SANDBOX_ENV_ROWS}}
