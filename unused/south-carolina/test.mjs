// South Carolina tests removed from scripts/test.mjs when the state was siloed.
// They only pass once South Carolina is back in data.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isoDate } from '../../holidays.js';
import { calcDeadline, parseLocalDate, publicationDateFor } from '../../calc.js';
import DATA from '../../data.js';

const d = parseLocalDate;
const county = (state, name) => DATA.find((s) => s.name === state).counties.find((c) => c.name === name);

test('publicationDateFor: a daily paper publishes on the court date itself', () => {
  const aiken = county('South Carolina', 'Aiken'); // Daily
  assert.equal(isoDate(publicationDateFor(aiken, d('2026-09-15'))), '2026-09-15');
});

test('Daily paper with a weekend nominal deadline rolls back to Friday', () => {
  // Aiken: daily, 3 days prior. Court date Tue 2026-09-15 -> nominal Sat 09-12 -> Fri 09-11
  const r = calcDeadline(county('South Carolina', 'Aiken'), d('2026-09-15'));
  assert.equal(isoDate(r.deadline.nominal), '2026-09-12');
  assert.equal(isoDate(r.deadline.date), '2026-09-11');
});

test('Per-day rules: Charleston weekend editions use Thursday @ 4pm', () => {
  const ch = county('South Carolina', 'Charleston');
  const sun = calcDeadline(ch, d('2026-09-13'));
  assert.equal(isoDate(sun.deadline.date), '2026-09-10');
  assert.equal(sun.deadline.time, '4pm');
  const wed = calcDeadline(ch, d('2026-09-16'));
  assert.equal(isoDate(wed.deadline.date), '2026-09-14');
  assert.equal(wed.deadline.time, '12pm');
});

test('Publication on Christmas Day produces a note', () => {
  const c = calcDeadline(county('South Carolina', 'Aiken'), d('2026-12-25'));
  assert.ok(c.notes.some((n) => n.includes('Christmas Day')));
});
