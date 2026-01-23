#!/usr/bin/env node

/**
 * Bump patch version script for Feedlog Toolkit monorepo
 *
 * Increments the patch version of all packages by one.
 * Example: 0.0.1 -> 0.0.2
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function getCurrentVersion() {
  const corePkg = JSON.parse(fs.readFileSync('packages/core/package.json', 'utf8'));
  return corePkg.version;
}

function bumpPatchVersion(version) {
  const parts = version.split('.').map(Number);
  parts[2]++; // Increment patch version
  return parts.join('.');
}

function updatePackageVersion(packagePath, newVersion) {
  const pkgPath = path.join(packagePath, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = newVersion;

  // Update internal dependencies to match the new version
  updateInternalDependencies(pkg, newVersion);

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Updated ${packagePath} to version ${newVersion}`);
}

function updateInternalDependencies(pkg, newVersion) {
  const internalPackages = [
    '@feedlog-ai/core',
    '@feedlog-ai/webcomponents',
    '@feedlog-ai/react',
    '@feedlog-ai/vue',
  ];

  if (pkg.dependencies) {
    internalPackages.forEach(pkgName => {
      if (pkg.dependencies[pkgName]) {
        pkg.dependencies[pkgName] = `^${newVersion}`;
      }
    });
  }

  if (pkg.peerDependencies) {
    internalPackages.forEach(pkgName => {
      if (pkg.peerDependencies[pkgName]) {
        pkg.peerDependencies[pkgName] = `^${newVersion}`;
      }
    });
  }

  if (pkg.devDependencies) {
    internalPackages.forEach(pkgName => {
      if (pkg.devDependencies[pkgName]) {
        pkg.devDependencies[pkgName] = `^${newVersion}`;
      }
    });
  }
}

function main() {
  const currentVersion = getCurrentVersion();
  const newVersion = bumpPatchVersion(currentVersion);

  console.log(`Bumping patch version from ${currentVersion} to ${newVersion}`);

  // Update all package versions
  const packages = ['core', 'webcomponents', 'react', 'vue'];
  packages.forEach(pkg => {
    updatePackageVersion(`packages/${pkg}`, newVersion);
  });

  console.log(`\n✅ All packages bumped to version ${newVersion}!`);
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  main();
}
