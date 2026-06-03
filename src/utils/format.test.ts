import test from 'node:test';
import assert from 'node:assert/strict';
import { fmt, pct, sLbl } from './format';

test('fmt compacts large numbers', () => {
  assert.equal(fmt(999), '999');
  assert.equal(fmt(1_500), '1.5K');
  assert.equal(fmt(2_300_000), '2.3M');
});

test('pct preserves sign and compacts very large values', () => {
  assert.equal(pct(12.345), '+12.3%');
  assert.equal(pct(-4.56), '-4.6%');
  assert.equal(pct(1_200), '+1.2K%');
});

test('sLbl buckets social change values', () => {
  assert.equal(sLbl(101), 'EXPLOSIVE');
  assert.equal(sLbl(21), 'Bullish');
  assert.equal(sLbl(-21), 'Bearish');
});
