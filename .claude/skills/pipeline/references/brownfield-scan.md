# Brownfield RECOVERY scan — detect, cite, confirm

Run the whole scan BEFORE asking the user anything. Every proposed row carries a
`file:line` citation; a control no probe finds is proposed as `missing` (a gap-row
candidate), never silently assumed present or absent without the probe having run.
**Reuse, don't re-scan:** `/environments` RECOVERY already cited the CI workflow and
deploy-config files for env-vars + per-env deploy mechanisms — start from
`.ai/environments.md`'s citations and read those files only for what it didn't
classify (gates, triggers, blocking status, supply-chain steps).
Org-level facts no file can show (branch protection, provider-native secret scanning,
registry settings) become direct questions, then Open questions — never guesses.

## 1. CI provider + workflows

Probe (first hit wins for `ci_provider`; scan all hits for gates):

```
.github/workflows/*.yml        → github-actions
.gitlab-ci.yml                 → gitlab-ci
Jenkinsfile                    → jenkins
.circleci/config.yml           → circleci
azure-pipelines.yml            → azure
bitbucket-pipelines.yml        → bitbucket
cloudbuild.yaml                → cloud-build
.buildkite/                    → buildkite
none of the above              → ci_provider: none (every mandatory gate is a gap row)
```

Per workflow file, classify each job into a gate row: **trigger** (map the provider's
event — `pull_request`/MR → pre-merge, push-to-trunk → post-merge, tag/release →
release, cron → scheduled) · **what runs** (lint, typecheck, unit, E2E, audit, build,
deploy) · **blocking?** (required check vs advisory / `continue-on-error`). Cite the
job's `file:line`.

## 2. Deploy wiring

- Deploy jobs inside the workflows above (steps invoking the host CLI, `kubectl`, helm,
  terraform, a registry push) — cite and match each to an environment from
  `.ai/environments.md`'s roster; a deploy to an env the roster doesn't name is a
  contradiction to surface, not to fix.
- Platform configs that imply deploy mechanics: `fly.toml`, `vercel.json`,
  `netlify.toml`, `render.yaml`, `Procfile`, `app.yaml`, `helm/`, `k8s/`, `infra/`.
- Release automation: `.goreleaser*`, `semantic-release` config, `.changeset/`,
  `release-please` config → feeds the deploy-vs-release stance and
  `anchor.release_policy` consistency check (a mismatch is surfaced, anchor wins).

## 3. Supply chain

- **Dependency updates:** `renovate.json`, `renovate.json5`, `.github/renovate.json*`,
  `.github/dependabot.yml` → `dep_update_tool` + cadence/automerge from the config body.
- **Secrets scanning:** a scanner step in CI (gitleaks, trufflehog, detect-secrets), a
  `.gitleaks.toml`, or pre-commit hook config; provider-native scanning is an ASK.
- **Pinning:** lockfile present + CI installs with it (`--frozen-lockfile`, `npm ci`,
  `--locked`); workflow action/image refs by tag vs SHA (note, don't moralize).
- **Audit:** an audit/scan step (`npm audit`, `pip-audit`, `cargo audit`, osv-scanner,
  trivy, grype) — and whether it can fail the run (blocking) or is `|| true` (advisory).
- **SBOM/provenance:** syft/cyclonedx/spdx steps, cosign/sigstore signing,
  attestation/provenance steps in release workflows.

## 4. Monitoring as code

In-repo alert rules or dashboards: `*.rules.yml`, `alerts/`, `grafana/`, `dashboards/`,
terraform monitoring resources — plus the workflow/apply step that ships them. Found
without an apply step → cite the files, flag the apply as the gap.

## 5. Always-ask (no file can answer)

1. Branch protection on trunk — which checks are required, are direct pushes blocked?
2. Provider-native secret scanning / push protection enabled?
3. Anything deploy-relevant that runs OUTSIDE this repo (an org-level pipeline, a
   separate infra repo, a manual runbook step)? Cite it as `external` rather than
   pretending the repo is the whole truth.
