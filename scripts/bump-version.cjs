#!/usr/bin/env node
/**
 * bump-version.js — Bump frontend and/or backend version (semver)
 *
 * Usage:
 *   node scripts/bump-version.js <target> <level>
 *
 *   target:  frontend | backend | both
 *   level:   major | minor | patch
 *
 * Examples:
 *   node scripts/bump-version.js frontend patch    # 1.0.0 → 1.0.1
 *   node scripts/bump-version.js backend minor     # 1.0.0 → 1.1.0
 *   node scripts/bump-version.js both major        # bumps both
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const [, , target, level] = process.argv;

if (!target || !level) {
  console.log('Usage: node scripts/bump-version.js <frontend|backend|both> <major|minor|patch>');
  process.exit(1);
}

if (!['frontend', 'backend', 'both'].includes(target)) {
  console.error("Error: target must be 'frontend', 'backend', or 'both'");
  process.exit(1);
}

if (!['major', 'minor', 'patch'].includes(level)) {
  console.error("Error: level must be 'major', 'minor', or 'patch'");
  process.exit(1);
}

function bump(relPath, label) {
  const absPath = path.join(root, relPath);
  const pkg = JSON.parse(fs.readFileSync(absPath, 'utf8'));
  const oldVer = pkg.version;
  const [major, minor, patch] = oldVer.split('.').map(Number);

  switch (level) {
    case 'major': pkg.version = `${major + 1}.0.0`; break;
    case 'minor': pkg.version = `${major}.${minor + 1}.0`; break;
    case 'patch': pkg.version = `${major}.${minor}.${patch + 1}`; break;
  }

  fs.writeFileSync(absPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`${label}: ${oldVer} → ${pkg.version}`);
}

if (target === 'frontend' || target === 'both') bump('package.json', 'Frontend');
if (target === 'backend' || target === 'both') bump('server/package.json', 'Backend');
console.log('Done.');
