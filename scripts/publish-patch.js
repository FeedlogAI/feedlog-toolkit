#!/usr/bin/env node

/**
 * Publish Patch script for Feedlog Toolkit monorepo
 *
 * Combines bumping patch version, npm login, building, and publishing all packages
 * Increments the patch version of all packages, logs into npm, builds, and publishes to npm with public access.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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

function npmLogin() {
  console.log('\n🔐 Logging into npm...');
  try {
    execSync('npm login', {
      stdio: 'inherit',
    });
    console.log('✅ Successfully logged into npm');
  } catch (error) {
    console.error('❌ npm login failed');
    throw error;
  }
}

function publishPackage(packageName) {
  const packagePath = path.join('packages', packageName);
  console.log(`\nPublishing ${packageName}...`);

  try {
    execSync(`cd ${packagePath} && npm publish --access=public`, {
      stdio: 'inherit',
    });
    console.log(`✅ Successfully published ${packageName}`);
  } catch (error) {
    console.error(`❌ Failed to publish ${packageName}`);
    throw error;
  }
}

function main() {
  const packages = ['core', 'webcomponents', 'react', 'vue'];

  // Step 1: Bump patch version
  const currentVersion = getCurrentVersion();
  const newVersion = bumpPatchVersion(currentVersion);
  console.log(`📦 Bumping patch version from ${currentVersion} to ${newVersion}`);
  packages.forEach(pkg => {
    updatePackageVersion(`packages/${pkg}`, newVersion);
  });
  console.log(`✅ All packages bumped to version ${newVersion}!\n`);

  // Step 2: npm login
  npmLogin();

  // Step 3: Build all packages
  console.log('\n🔨 Starting build of all packages...\n');
  try {
    execSync('npm run build', {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('❌ Build failed');
    throw error;
  }

  // Step 4: Publish all packages
  console.log('\n📤 Starting publication of all packages...\n');
  for (const pkg of packages) {
    publishPackage(pkg);
  }

  console.log(`\n✅ All packages published successfully!`);
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  main();
}
