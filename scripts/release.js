#!/usr/bin/env node

/**
 * Release script for Feedlog Toolkit monorepo
 *
 * DEPRECATED: This script is deprecated in favor of Changesets.
 *
 * For automated releases, use:
 * 1. npm run changeset - to create changesets as you make changes
 * 2. Changesets bot will automatically create a "Version Packages" PR
 * 3. Merge the PR to trigger automated publishing
 *
 * This script is kept for reference/manual override purposes.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getCurrentVersion() {
  const corePkg = JSON.parse(fs.readFileSync('packages/core/package.json', 'utf8'));
  return corePkg.version;
}

function incrementVersion(version, type = 'patch') {
  const parts = version.split('.').map(Number);

  switch (type) {
    case 'major':
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case 'minor':
      parts[1]++;
      parts[2] = 0;
      break;
    case 'patch':
    default:
      parts[2]++;
      break;
  }

  return parts.join('.');
}

function updatePackageVersion(packagePath, newVersion) {
  const pkgPath = path.join(packagePath, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Updated ${packagePath} to version ${newVersion}`);
}

function main() {
  const args = process.argv.slice(2);
  const releaseType = args[0] || 'patch';

  if (!['patch', 'minor', 'major'].includes(releaseType)) {
    console.error('Usage: npm run release [patch|minor|major]');
    process.exit(1);
  }

  const currentVersion = getCurrentVersion();
  const newVersion = incrementVersion(currentVersion, releaseType);

  console.log(`Releasing version ${newVersion} (${releaseType})`);

  // Update all package versions
  const packages = ['core', 'webcomponents', 'react', 'vue'];
  packages.forEach(pkg => {
    updatePackageVersion(`packages/${pkg}`, newVersion);
  });

  // Commit changes
  execSync('git add .');
  execSync(`git commit -m "Release v${newVersion}"`);

  // Create tag
  execSync(`git tag v${newVersion}`);

  console.log(`\n✅ Release v${newVersion} prepared!`);
  console.log(`Run 'git push && git push --tags' to publish the release.`);
  console.log(`The GitHub Actions release workflow will automatically publish to npm.`);
}

if (require.main === module) {
  main();
}
