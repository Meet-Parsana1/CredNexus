/**
 * CredNexus Data Validation Script
 * Validates schemas and foreign keys for schemes and partners.
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const schemes = JSON.parse(readFileSync(resolve(rootDir, 'data/schemes/schemes.json'), 'utf8'));
const partners = JSON.parse(readFileSync(resolve(rootDir, 'data/partners/partners.json'), 'utf8'));

let errors = 0;

console.log('Validating schemes...');
const schemeCodes = new Set(schemes.map(s => s.code));
schemes.forEach(s => {
  if (!s.id || !s.code || !s.name || !s.category || !s.maxLoanAmount) {
    console.error(`Invalid scheme schema: ${s.id || 'unknown'}`);
    errors++;
  }
  if (s.minLoanAmount > s.maxLoanAmount) {
    console.error(`Scheme ${s.id}: minLoanAmount > maxLoanAmount`);
    errors++;
  }
});

console.log('Validating channel partners...');
partners.forEach(p => {
  const hasValidCoords = (typeof p.lat === 'number' && typeof p.lng === 'number') || (p.lat === null && p.lng === null);
  if (!p.id || !p.code || !p.name || !p.type || !hasValidCoords) {
    console.error(`Invalid partner schema: ${p.id || 'unknown'}`);
    errors++;
  }
  if (p.coordinatePrecision === 'UNAVAILABLE' && (p.lat !== null || p.lng !== null)) {
    console.error(`Partner ${p.id} has UNAVAILABLE precision but non-null coordinates`);
    errors++;
  }
  if ((p.coordinatePrecision === 'EXACT' || p.coordinatePrecision === 'ADDRESS_GEOCODED') && (typeof p.lat !== 'number' || typeof p.lng !== 'number')) {
    console.error(`Partner ${p.id} has ${p.coordinatePrecision} precision but missing numeric coordinates`);
    errors++;
  }
  if (Array.isArray(p.supportedSchemeCodes)) {
    p.supportedSchemeCodes.forEach(code => {
      if (!schemeCodes.has(code)) {
        console.warn(`Partner ${p.id} references non-existent scheme code: ${code}`);
      }
    });
  }
});

if (errors > 0) {
  console.error(`\nValidation completed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log(`\nValidation successful: 0 errors detected across ${schemes.length} schemes and ${partners.length} partners.`);
}
