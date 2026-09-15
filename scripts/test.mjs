// Run: node --test scripts/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { federalHolidays, holidayName, isoDate } from '../holidays.js';
import { calcDeadline, rollBackToBusinessDay, parseLocalDate, publicationDateFor } from '../calc.js';
import DATA from '../data.js';

const d = parseLocalDate;
const county = (state, name) => DATA.find((s) => s.name === state).counties.find((c) => c.name === name);

test('federal holidays 2026 land on the right dates', () => {
  const h = federalHolidays(2026);
  assert.equal(h.get('2026-01-01'), "New Year's Day");
  assert.equal(h.get('2026-01-19'), 'Martin Luther King Jr. Day');
  assert.equal(h.get('2026-02-16'), "Presidents' Day");
  assert.equal(h.get('2026-05-25'), 'Memorial Day');
  assert.equal(h.get('2026-06-19'), 'Juneteenth');
  assert.equal(h.get('2026-07-03'), 'Independence Day'); // Jul 4 2026 is a Saturday -> observed Friday
  assert.equal(h.get('2026-09-07'), 'Labor Day');
  assert.equal(h.get('2026-10-12'), 'Columbus Day');
  assert.equal(h.get('2026-11-11'), 'Veterans Day');
  assert.equal(h.get('2026-11-26'), 'Thanksgiving Day');
  assert.equal(h.get('2026-12-25'), 'Christmas Day');
  assert.equal(h.size, 11);
});

test('Sunday holidays are observed on Monday; Dec 31 can host next New Year', () => {
  assert.equal(holidayName(d('2027-12-31')), "New Year's Day (observed)"); // Jan 1 2028 is a Saturday
  assert.equal(holidayName(d('2028-12-25')), 'Christmas Day');
  assert.equal(holidayName(d('2022-12-26')), 'Christmas Day'); // Dec 25 2022 was a Sunday
  assert.equal(holidayName(d('2026-09-15')), null);
});

test('rollBackToBusinessDay: Monday holiday -> Friday, with reasons', () => {
  const { date, adjustments } = rollBackToBusinessDay(d('2026-09-07')); // Labor Day
  assert.equal(isoDate(date), '2026-09-04');
  assert.deepEqual(adjustments.map((a) => a.reason), ['Labor Day', 'Sunday', 'Saturday']);
});

test('rollBackToBusinessDay: business day unchanged', () => {
  const { date, adjustments } = rollBackToBusinessDay(d('2026-09-08'));
  assert.equal(isoDate(date), '2026-09-08');
  assert.equal(adjustments.length, 0);
});

test('publicationDateFor picks the last publication day on or before the court date', () => {
  const appling = county('Georgia', 'Appling'); // Wednesday
  assert.equal(isoDate(publicationDateFor(appling, d('2026-09-15'))), '2026-09-09'); // Tue -> prior Wed
  assert.equal(isoDate(publicationDateFor(appling, d('2026-09-16'))), '2026-09-16'); // Wed -> same day
  const aiken = county('South Carolina', 'Aiken'); // Daily
  assert.equal(isoDate(publicationDateFor(aiken, d('2026-09-15'))), '2026-09-15');
});

test('Georgia weekly paper: 5 days prior from Wednesday is Friday before', () => {
  const r = calcDeadline(county('Georgia', 'Appling'), d('2026-09-16'));
  assert.equal(isoDate(r.publicationDate), '2026-09-16');
  assert.equal(isoDate(r.deadline.date), '2026-09-11');
  assert.equal(r.deadline.time, '4pm');
  assert.equal(r.deadline.adjusted, false);
  assert.equal(r.lateDeadline, null); // same as regular, so omitted
});

test('Georgia late deadline is exposed when it differs', () => {
  const r = calcDeadline(county('Georgia', 'Fulton'), d('2026-09-17')); // Thursday
  assert.equal(isoDate(r.deadline.date), '2026-09-11'); // 6 days prior
  assert.equal(isoDate(r.lateDeadline.date), '2026-09-14'); // 3 days prior
  assert.equal(r.lateDeadline.time, '12pm');
});

test('Monday deadline on Labor Day rolls back to Friday', () => {
  // Hall County publishes Wednesday, 2 days prior -> Monday 2026-09-07 (Labor Day)
  const r = calcDeadline(county('Georgia', 'Hall'), d('2026-09-09'));
  assert.equal(isoDate(r.deadline.nominal), '2026-09-07');
  assert.equal(isoDate(r.deadline.date), '2026-09-04');
  assert.equal(r.deadline.adjusted, true);
  assert.equal(r.deadline.adjustments[0].reason, 'Labor Day');
});

test('Tuesday deadline after a Monday holiday is untouched', () => {
  // Quitman: Wednesday, 1 day prior -> Tuesday 2026-09-08
  const r = calcDeadline(county('Georgia', 'Quitman'), d('2026-09-09'));
  assert.equal(isoDate(r.deadline.date), '2026-09-08');
  assert.equal(r.deadline.adjusted, false);
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

test('Publication on a holiday produces a note', () => {
  // Newton publishes Sunday; Christmas 2022 was a Sunday (observed Monday). Use Jul 4 2027 (Sunday).
  const r = calcDeadline(county('Georgia', 'Newton'), d('2027-07-04'));
  assert.equal(isoDate(r.publicationDate), '2027-07-04');
  // Jul 4 2027 is Sunday -> observed Monday Jul 5, so the Sunday itself is not flagged.
  assert.ok(!r.notes.some((n) => n.startsWith('Publication date falls')));
  const c = calcDeadline(county('South Carolina', 'Aiken'), d('2026-12-25'));
  assert.ok(c.notes.some((n) => n.includes('Christmas Day')));
});

test('every county in data.js computes for every day of a week', () => {
  for (const state of DATA) {
    for (const c of state.counties) {
      for (let i = 14; i < 21; i++) {
        const r = calcDeadline(c, d(`2026-09-${i}`));
        assert.ok(r, `${state.name}/${c.name} on 2026-09-${i}`);
        assert.ok(r.deadline.date <= r.publicationDate);
        assert.match(r.deadline.time, /^\d{1,2}(:\d{2})?(am|pm)$/, `${c.name} time ${r.deadline.time}`);
      }
    }
  }
});
