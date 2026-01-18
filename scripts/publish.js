#!/usr/bin/env node

/**
 * Publish script for Feedlog Toolkit monorepo
 * 
 * Publishes all packages to npm with public access.
 * Runs 'npm publish --access=public' in each package directory.
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

function publishPackage(packageName) {
  const packagePath = path.join('packages', packageName);
  console.log(`\nPublishing ${packageName}...`);
  
  try {
    execSync(`cd ${packagePath} && npm publish --access=public`, {
      stdio: 'inherit'
    });
    console.log(`✅ Successfully published ${packageName}`);
  } catch (error) {
    console.error(`❌ Failed to publish ${packageName}`);
    throw error;
  }
}

function main() {
  const packages = ['core', 'webcomponents', 'react', 'vue'];
  
  console.log('Starting publication of all packages...\n');

  for (const pkg of packages) {
    publishPackage(pkg);
  }

  console.log(`\n✅ All packages published successfully!`);
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  main();
}
