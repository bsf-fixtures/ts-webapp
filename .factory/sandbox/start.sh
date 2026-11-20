#!/usr/bin/env bash
# Sandbox for bsf-fixtures/ts-webapp. Tier: renders (the app has no services
# and reads no environment variables, so nothing here is faked).
#
# Runs on the runner before the agent starts. It prepares the workspace the
# agent's sandbox mounts; the agent starts the dev server itself, per the
# runbook's Run section, so the app and the agent's browser share a network.
set -euo pipefail
cd "$GITHUB_WORKSPACE"
npm ci --no-audit --no-fund
