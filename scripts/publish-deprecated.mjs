#!/usr/bin/env node
/**
 * Local npm publish flows were replaced by GitHub Actions:
 * Changesets + npm Trusted Publishing (OIDC).
 *
 * Release process:
 * 1. npx changeset (on a branch) → PR → merge to main with .changeset/*.md
 * 2. The Changesets workflow opens/merges the "Version packages" PR
 * 3. When versions are ready, the same workflow runs changeset publish via OIDC
 *
 * @see .github/workflows/changesets.yml
 */
console.error('');
console.error('Publishing from this machine is disabled.');
console.error('Use GitHub Actions: .github/workflows/changesets.yml (OIDC trusted publishing).');
console.error('Add changesets with: npx changeset');
console.error('');
process.exit(1);
