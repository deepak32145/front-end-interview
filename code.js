#!/usr/bin/env node
/**
 * nexus-preflight.js
 * Run from your project root (where package.json lives):  node nexus-preflight.js
 * Requires: npm install semver  (or run from a folder that has semver available)
 *
 * Walks your entire dependency tree (dependencies + devDependencies + peers),
 * honors your overrides, resolves every range against registry.npmjs.org the
 * same way npm would, and reports every package version published within the
 * quarantine window — with the newest safe version to pin.
 */
const fs = require('fs');
const path = require('path');
const semver = require('semver');

const QUARANTINE_DAYS = 5;            // match your Nexus policy
const REGISTRY = 'https://registry.npmjs.org/';
const CUTOFF = new Date(Date.now() - QUARANTINE_DAYS * 24 * 3600 * 1000);

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
const overrides = pkg.overrides || {};
const roots = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

const metaCache = new Map();
const visited = new Set();
const blocked = new Map();   // key -> info
const notFound = new Set();
let nodes = 0;

async function getMeta(name) {
  if (metaCache.has(name)) return metaCache.get(name);
  try {
    const res = await fetch(REGISTRY + name.replace('/', '%2f'));
    const data = res.ok ? await res.json() : null;
    metaCache.set(name, data);
    return data;
  } catch { metaCache.set(name, null); return null; }
}

async function walk(name, range, chain) {
  // overrides win over declared ranges, exactly like npm
  if (overrides[name]) range = overrides[name];
  const meta = await getMeta(name);
  if (!meta || !meta.versions) { notFound.add(name + '@' + range); return; }
  let resolved = semver.maxSatisfying(Object.keys(meta.versions), range, { includePrerelease: false });
  if (!resolved) resolved = meta['dist-tags'] && meta['dist-tags'].latest;
  if (!resolved || !meta.versions[resolved]) { notFound.add(name + '@' + range); return; }
  const key = name + '@' + resolved;
  nodes++;
  const pub = new Date(meta.time[resolved]);
  if (pub >= CUTOFF && !blocked.has(key)) {
    const safe = Object.keys(meta.versions)
      .filter(v => semver.satisfies(v, range, { includePrerelease: false }) && new Date(meta.time[v]) < CUTOFF)
      .sort(semver.rcompare)[0];
    blocked.set(key, {
      name, resolved, range,
      published: meta.time[resolved].slice(0, 10),
      safe: safe || 'NONE IN RANGE (pin the parent instead)',
      chain: chain.length ? chain.join(' > ') : '(direct)'
    });
  }
  if (visited.has(key)) return;
  visited.add(key);
  const vm = meta.versions[resolved];
  const next = { ...(vm.dependencies || {}) };
  const peers = vm.peerDependencies || {};
  const pMeta = vm.peerDependenciesMeta || {};
  for (const [pn, pr] of Object.entries(peers))
    if (!(pMeta[pn] && pMeta[pn].optional)) next[pn] = next[pn] || pr;
  for (const [dn, dr] of Object.entries(next)) await walk(dn, dr, [...chain, key]);
}

(async () => {
  console.log(`Quarantine window: last ${QUARANTINE_DAYS} days (cutoff ${CUTOFF.toISOString().slice(0,10)})`);
  console.log('Walking tree (this takes a minute on first run)...\n');
  for (const [n, r] of Object.entries(roots)) {
    process.stdout.write('.');
    await walk(n, r, []);
  }
  console.log(`\n\nChecked ${nodes} nodes (${visited.size} unique package@version).\n`);

  if (!blocked.size) {
    console.log('ALL CLEAR — nothing in your tree resolves to a quarantined version. Safe to push.');
  } else {
    console.log(`=== ${blocked.size} BLOCKED — Nexus will reject these ===\n`);
    for (const b of blocked.values()) {
      console.log(`${b.name}@${b.resolved}  (published ${b.published}, via range "${b.range}")`);
      console.log(`   path: ${b.chain}`);
      console.log(`   fix:  "${b.name}": "${b.safe}"\n`);
    }
    console.log('--- paste-ready overrides additions ---');
    const adds = [...blocked.values()].filter(b => !b.safe.startsWith('NONE'));
    console.log(adds.map(b => `    "${b.name}": "${b.safe}"`).join(',\n'));
    const parents = [...blocked.values()].filter(b => b.safe.startsWith('NONE'));
    if (parents.length) {
      console.log('\nNOTE: these are exact-pinned by their parent — pin the parent package shown in "path" to an older version instead:');
      parents.forEach(b => console.log(`  ${b.name}@${b.resolved}  <- ${b.chain.split(' > ').pop()}`));
    }
  }
  if (notFound.size) {
    console.log('\nSkipped (private/unresolvable): ' + [...notFound].join(', '));
  }
})();