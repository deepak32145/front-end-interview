#!/usr/bin/env node
/**
 * nexus-preflight-vdi.js — zero-dependency, corporate-proxy-aware edition
 * Run from project root:  node nexus-preflight-vdi.js
 * Needs only Node 18+. No npm install. Reads proxy from env or ~/.npmrc automatically.
 * If behind SSL-inspecting proxy, start with:  set NODE_EXTRA_CA_CERTS=<path to corporate CA .pem>
 * (find it via: npm config get cafile)
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const https = require('https');
const tls = require('tls');
const { URL } = require('url');

const QUARANTINE_DAYS = 5;
const REGISTRY_HOST = 'registry.npmjs.org';
const CUTOFF = new Date(Date.now() - QUARANTINE_DAYS * 24 * 3600 * 1000);

/* ---------- proxy discovery: env vars, then .npmrc files ---------- */
function readNpmrc(file) {
  try {
    const out = {};
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = /^\s*(https-proxy|proxy|cafile|strict-ssl)\s*=\s*(.+?)\s*$/.exec(line);
      if (m) out[m[1]] = m[2].replace(/^"|"$/g, '');
    }
    return out;
  } catch { return {}; }
}
const npmrc = { ...readNpmrc(path.join(os.homedir(), '.npmrc')), ...readNpmrc(path.join(process.cwd(), '.npmrc')) };
const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy ||
                 process.env.HTTP_PROXY || process.env.http_proxy ||
                 npmrc['https-proxy'] || npmrc['proxy'] || null;
const strictSsl = npmrc['strict-ssl'] !== 'false';
if (npmrc['cafile'] && !process.env.NODE_EXTRA_CA_CERTS) {
  console.log(`NOTE: your .npmrc has cafile=${npmrc['cafile']}`);
  console.log(`      if you see certificate errors, restart with:  set NODE_EXTRA_CA_CERTS=${npmrc['cafile']}\n`);
}
console.log(proxyUrl ? `Using proxy: ${proxyUrl}` : 'No proxy configured — connecting directly.');

/* ---------- HTTPS GET through optional CONNECT tunnel ---------- */
let firstNetError = null;
function httpsGetJson(pathName) {
  return new Promise((resolve) => {
    const onError = (e) => { if (!firstNetError) firstNetError = e; resolve(null); };
    const reqOpts = {
      host: REGISTRY_HOST, port: 443, path: pathName, method: 'GET',
      headers: { 'host': REGISTRY_HOST, 'accept': 'application/json', 'user-agent': 'nexus-preflight' },
      rejectUnauthorized: strictSsl,
      timeout: 60000
    };
    const fire = (socketOpts) => {
      const req = https.request({ ...reqOpts, ...socketOpts }, (res) => {
        if (res.statusCode === 404) { res.resume(); return resolve(null); }
        if (res.statusCode !== 200) { res.resume(); return onError(new Error('HTTP ' + res.statusCode + ' for ' + pathName)); }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', c => body += c);
        res.on('end', () => { try { resolve(JSON.parse(body)); } catch (e) { onError(e); } });
      });
      req.on('timeout', () => { req.destroy(new Error('timeout')); });
      req.on('error', onError);
      req.end();
    };
    if (!proxyUrl) return fire({});
    // CONNECT tunnel through corporate proxy
    const p = new URL(proxyUrl);
    const connectReq = http.request({
      host: p.hostname, port: p.port || 8080, method: 'CONNECT',
      path: REGISTRY_HOST + ':443',
      headers: p.username ? { 'proxy-authorization': 'Basic ' + Buffer.from(decodeURIComponent(p.username) + ':' + decodeURIComponent(p.password || '')).toString('base64') } : {},
      timeout: 60000
    });
    connectReq.on('connect', (res, socket) => {
      if (res.statusCode !== 200) return onError(new Error('Proxy CONNECT failed: HTTP ' + res.statusCode));
      const tlsSocket = tls.connect({ socket, servername: REGISTRY_HOST, rejectUnauthorized: strictSsl }, () => {
        fire({ createConnection: () => tlsSocket });
      });
      tlsSocket.on('error', onError);
    });
    connectReq.on('timeout', () => connectReq.destroy(new Error('proxy timeout')));
    connectReq.on('error', onError);
    connectReq.end();
  });
}

/* ---------- minimal semver (inline) ---------- */
function parse(v) {
  const m = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-.]+))?/.exec(v);
  return m ? { maj: +m[1], min: +m[2], pat: +m[3], pre: m[4] || null } : null;
}
function cmp(a, b) {
  const A = parse(a), B = parse(b);
  if (A.maj !== B.maj) return A.maj - B.maj;
  if (A.min !== B.min) return A.min - B.min;
  if (A.pat !== B.pat) return A.pat - B.pat;
  if (!A.pre && B.pre) return 1;
  if (A.pre && !B.pre) return -1;
  return 0;
}
function cmpTuple(p, t) {
  if (p.maj !== t[0]) return p.maj - t[0];
  if (p.min !== t[1]) return p.min - t[1];
  return p.pat - t[2];
}
function satisfiesComparator(v, c) {
  const p = parse(v);
  if (!p || p.pre) return false;
  c = c.trim();
  if (!c || c === '*' || c === 'x' || c === 'latest') return true;
  let op = '';
  const opMatch = /^(>=|<=|>|<|=|\^|~)/.exec(c);
  if (opMatch) { op = opMatch[1]; c = c.slice(op.length).trim(); }
  const parts = c.replace(/\.x$/i, '').replace(/\.x\./i, '.').split('.');
  const maj = parseInt(parts[0], 10);
  const min = parts.length > 1 && /^\d+$/.test(parts[1]) ? parseInt(parts[1], 10) : null;
  const pat = parts.length > 2 && /^\d+$/.test(parts[2]) ? parseInt(parts[2], 10) : null;
  if (isNaN(maj)) return true;
  const lo = [maj, min ?? 0, pat ?? 0];
  if (op === '^') {
    let hi;
    if (maj > 0) hi = [maj + 1, 0, 0];
    else if ((min ?? 0) > 0) hi = [0, (min ?? 0) + 1, 0];
    else hi = [0, 0, (pat ?? 0) + 1];
    return cmpTuple(p, lo) >= 0 && cmpTuple(p, hi) < 0;
  }
  if (op === '~') {
    const hi = min === null ? [maj + 1, 0, 0] : [maj, min + 1, 0];
    return cmpTuple(p, lo) >= 0 && cmpTuple(p, hi) < 0;
  }
  if (op === '>=') return cmpTuple(p, lo) >= 0;
  if (op === '>')  return cmpTuple(p, lo) > 0;
  if (op === '<=') return cmpTuple(p, lo) <= 0;
  if (op === '<')  return cmpTuple(p, lo) < 0;
  if (pat !== null) return p.maj === maj && p.min === min && p.pat === pat;
  if (min !== null) return p.maj === maj && p.min === min;
  return p.maj === maj;
}
function satisfies(v, range) {
  if (!parse(v) || parse(v).pre) return false;
  return String(range).split('||').some(alt =>
    alt.trim().split(/\s+/).every(c => satisfiesComparator(v, c))
  );
}
function maxSatisfying(versions, range) {
  return versions.filter(v => satisfies(v, range)).sort(cmp).pop() || null;
}
/* ------------------------------------------------------------ */

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
const overrides = pkg.overrides || {};
const roots = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

const metaCache = new Map();
const visited = new Set();
const blocked = new Map();
const notFound = new Set();
let nodes = 0;

async function getMeta(name) {
  if (metaCache.has(name)) return metaCache.get(name);
  const data = await httpsGetJson('/' + name.replace('/', '%2f'));
  metaCache.set(name, data);
  return data;
}

async function walk(name, range, chain) {
  if (overrides[name]) range = overrides[name];
  const meta = await getMeta(name);
  if (!meta || !meta.versions) { notFound.add(name + '@' + range); return; }
  let resolved = maxSatisfying(Object.keys(meta.versions), range);
  if (!resolved) resolved = meta['dist-tags'] && meta['dist-tags'].latest;
  if (!resolved || !meta.versions[resolved]) { notFound.add(name + '@' + range); return; }
  const key = name + '@' + resolved;
  nodes++;
  const pub = new Date(meta.time[resolved]);
  if (pub >= CUTOFF && !blocked.has(key)) {
    const safe = Object.keys(meta.versions)
      .filter(v => satisfies(v, range) && new Date(meta.time[v]) < CUTOFF)
      .sort(cmp).pop();
    blocked.set(key, {
      name, resolved, range,
      published: meta.time[resolved].slice(0, 10),
      safe: safe || 'NONE IN RANGE (pin the parent shown in path)',
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
  console.log(`Quarantine window: last ${QUARANTINE_DAYS} days (cutoff ${CUTOFF.toISOString().slice(0, 10)})`);
  // connectivity self-test BEFORE walking, so we never fake-clear again
  process.stdout.write('Connectivity check... ');
  const test = await httpsGetJson('/semver');
  if (!test) {
    console.log('FAILED.\n');
    console.log('Cannot reach registry.npmjs.org. First error was:');
    console.log('  ' + (firstNetError ? firstNetError.message : 'unknown'));
    console.log('\nFixes to try:');
    console.log('  1. Certificate error -> set NODE_EXTRA_CA_CERTS to your corporate CA (npm config get cafile), restart terminal, rerun.');
    console.log('  2. Connection refused/timeout -> verify proxy: npm config get https-proxy, then set HTTPS_PROXY env var to it and rerun.');
    process.exit(1);
  }
  console.log('OK\n');
  console.log('Walking tree (VDI is slow — let it run)...\n');
  for (const [n, r] of Object.entries(roots)) {
    process.stdout.write('.');
    await walk(n, r, []);
  }
  console.log(`\n\nChecked ${nodes} nodes (${visited.size} unique package@version).\n`);
  if (nodes === 0) {
    console.log('ERROR: zero packages checked — network failed mid-run. Do NOT trust this result.');
    if (firstNetError) console.log('First error: ' + firstNetError.message);
    process.exit(1);
  }
  if (!blocked.size) {
    console.log('ALL CLEAR — nothing resolves to a quarantined version. Safe to push.');
  } else {
    console.log(`=== ${blocked.size} BLOCKED — Nexus will reject these ===\n`);
    for (const b of blocked.values()) {
      console.log(`${b.name}@${b.resolved}  (published ${b.published}, via range "${b.range}")`);
      console.log(`   path: ${b.chain}`);
      console.log(`   fix:  "${b.name}": "${b.safe}"\n`);
    }
    console.log('--- paste-ready overrides additions ---');
    console.log([...blocked.values()]
      .filter(b => !b.safe.startsWith('NONE'))
      .map(b => `    "${b.name}": "${b.safe}"`).join(',\n'));
    const parents = [...blocked.values()].filter(b => b.safe.startsWith('NONE'));
    if (parents.length) {
      console.log('\nExact-pinned by parent — pin the parent instead:');
      parents.forEach(b => console.log(`  ${b.name}@${b.resolved}  <- ${b.chain.split(' > ').pop()}`));
    }
  }
  if (notFound.size) console.log('\nSkipped (private/unresolvable): ' + [...notFound].join(', '));
  if (firstNetError) console.log('\nWARNING: some requests failed (' + firstNetError.message + ') — results may be incomplete.');
})();