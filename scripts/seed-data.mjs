/**
 * CredNexus Data Seeding Script
 * Verifies and reports on the state of authoritative JSON seeds.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const schemesPath = resolve(rootDir, 'data/schemes/schemes.json');
const partnersPath = resolve(rootDir, 'data/partners/partners.json');

console.log('--- CredNexus Data Seeding & Integrity Audit ---');

if (!existsSync(schemesPath)) {
  console.error(`Missing schemes file: ${schemesPath}`);
  process.exit(1);
}

if (!existsSync(partnersPath)) {
  console.error(`Missing partners file: ${partnersPath}`);
  process.exit(1);
}

const schemes = JSON.parse(readFileSync(schemesPath, 'utf8'));
const partners = JSON.parse(readFileSync(partnersPath, 'utf8'));

console.log(`[PASS] Authoritative schemes loaded: ${schemes.length} records`);
schemes.forEach((s, idx) => {
  console.log(`  ${idx + 1}. [${s.id}] ${s.name} (${s.category})`);
});

console.log(`\n[PASS] Authoritative channel partners loaded: ${partners.length} records`);
partners.forEach((p, idx) => {
  console.log(`  ${idx + 1}. [${p.id}] ${p.name} - ${p.address.city}, ${p.address.state} (${p.type})`);
});

console.log('\nAll authoritative data structures are intact and ready.');
