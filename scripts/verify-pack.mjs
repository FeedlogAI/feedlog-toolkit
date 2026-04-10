#!/usr/bin/env node
/**
 * Ensures publishable tarballs from each workspace package do not include
 * accidental paths (e.g. storybook build output, env files, tests).
 */

import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const PACKAGES = ['packages/core', 'packages/webcomponents', 'packages/react', 'packages/vue'];

/** Substrings that must not appear in any packed path (POSIX-style). */
const FORBIDDEN = [
  'storybook-static',
  '/.env',
  '.env.',
  '__tests__',
  '.spec.ts',
  '.spec.tsx',
  '/coverage/',
  'tsconfig',
  'jest.config',
  'playwright.config',
];

function listPackedFiles(packageDir) {
  const cwd = path.join(root, packageDir);
  let out;
  try {
    // Skip lifecycle scripts so prepack (e.g. stencil build) does not pollute stdout.
    out = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NPM_CONFIG_LOGLEVEL: 'silent' },
    });
  } catch (e) {
    const stderr = e.stderr?.toString?.() ?? '';
    throw new Error(`npm pack failed in ${packageDir}: ${e.message}\n${stderr}`);
  }

  let data;
  try {
    data = JSON.parse(out.trim());
  } catch {
    throw new Error(`npm pack --json returned non-JSON in ${packageDir}:\n${out.slice(0, 500)}`);
  }

  const entry = Array.isArray(data) ? data[0] : data;
  const files = entry?.files;
  if (!Array.isArray(files)) {
    throw new Error(`Unexpected npm pack JSON in ${packageDir}: missing files[]`);
  }

  return files.map(f => (typeof f === 'string' ? f : f.path || f.name || String(f)));
}

function main() {
  let failed = false;
  for (const pkg of PACKAGES) {
    const files = listPackedFiles(pkg);
    const hits = [];
    for (const file of files) {
      const normalized = file.replace(/\\/g, '/');
      for (const bad of FORBIDDEN) {
        if (normalized.includes(bad)) {
          hits.push({ file: normalized, bad });
        }
      }
    }
    if (hits.length) {
      failed = true;
      console.error(`\n❌ ${pkg}: forbidden path(s) in pack:`);
      for (const h of hits) {
        console.error(`   - ${h.file} (matched "${h.bad}")`);
      }
    } else {
      console.log(`✅ ${pkg}: ${files.length} paths, no forbidden patterns`);
    }
  }
  if (failed) {
    process.exit(1);
  }
}

main();
