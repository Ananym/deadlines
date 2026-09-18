// Run: node --test scripts/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { federalHolidays, holidayName, isoDate } from '../holidays.js';
import { calcDeadline, calcSaleDeadline, firstTuesday, rollBackToBusinessDay, parseLocalDate, publicationDateFor } from '../calc.js';
import DATA from '../data.js';
import CASES from './cases.mjs';

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
});

test('Georgia weekly paper: 5 days prior from Wednesday is Friday before', () => {
  const r = calcDeadline(county('Georgia', 'Appling'), d('2026-09-16'));
  assert.equal(isoDate(r.publicationDate), '2026-09-16');
  assert.equal(isoDate(r.deadline.date), '2026-09-11');
  assert.equal(r.deadline.time, '4pm');
  assert.equal(r.deadline.adjusted, false);
  assert.equal(r.lateDeadline, null); // same as regular, so omitted
});

test('late deadline is exposed when a county defines one', () => {
  const synthetic = { name: 'X', publicationDays: ['Thursday'], deadlines: { Thursday: { daysPrior: 6, time: '12pm' } }, lateDeadlines: { Thursday: { daysPrior: 3, time: '12pm' } } };
  const r = calcDeadline(synthetic, d('2026-09-17')); // Thursday
  assert.equal(isoDate(r.deadline.date), '2026-09-11');
  assert.equal(isoDate(r.lateDeadline.date), '2026-09-14');
  assert.equal(r.lateDeadline.time, '12pm');
});

test('Monday deadline on Labor Day rolls back to Friday', () => {
  // Effingham publishes Wednesday, 2 days prior -> Monday 2026-09-07 (Labor Day)
  const r = calcDeadline(county('Georgia', 'Effingham'), d('2026-09-09'));
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

test('Publication on a holiday produces a note', () => {
  // Newton publishes Saturday; Jul 4 2026 is a Saturday but observed Friday, so the Saturday itself is not flagged.
  const r = calcDeadline(county('Georgia', 'Newton'), d('2026-07-04'));
  assert.equal(isoDate(r.publicationDate), '2026-07-04');
  assert.ok(!r.notes.some((n) => n.startsWith('Publication date falls')));
  // Cobb publishes Friday; Christmas Day 2026 is a Friday.
  const c = calcDeadline(county('Georgia', 'Cobb'), d('2026-12-25'));
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

test('firstTuesday', () => {
  assert.equal(isoDate(firstTuesday(2026, 10)), '2026-11-03');
  assert.equal(isoDate(firstTuesday(2026, 11)), '2026-12-01');
  assert.equal(isoDate(firstTuesday(2027, 5)), '2027-06-01');
});

test('sale mode: every Georgia county starts its 4-week run inside the 28 days before the sale', () => {
  const sale = d('2026-11-03');
  for (const c of DATA[0].counties) {
    const r = calcSaleDeadline(c, sale);
    assert.ok(r, c.name);
    const daysBefore = Math.round((sale - r.firstPublication) / 86400000);
    assert.ok(daysBefore <= 28 && daysBefore >= 22, `${c.name} first publication ${isoDate(r.firstPublication)}`);
    assert.equal(Math.round((r.lastPublication - r.firstPublication) / 86400000), 21);
    assert.ok(r.lastPublication < sale, `${c.name} last run ${isoDate(r.lastPublication)} not before sale`);
  }
});

// ---------- Table-driven cases from scripts/cases.mjs ----------
const stamp = (dl) => `${isoDate(dl.date)} ${dl.time}`;
for (const c of CASES) {
  const label = c.sale ? `sale on ${c.sale}` : `published by ${c.court}`;
  test(`${c.state}/${c.county} ${label} -> ${c.deadline}`, () => {
    const county = DATA.find((s) => s.name === c.state)?.counties.find((x) => x.name === c.county);
    assert.ok(county, `no county ${c.state}/${c.county}`);
    const r = c.sale ? calcSaleDeadline(county, d(c.sale)) : calcDeadline(county, d(c.court));
    assert.ok(r, 'no result');
    assert.equal(isoDate(r.publicationDate), c.publication, 'publication date');
    assert.equal(stamp(r.deadline), c.deadline, 'deadline');
    if ('late' in c) assert.equal(r.lateDeadline ? stamp(r.lateDeadline) : null, c.late, 'late deadline');
    if ('movedFrom' in c) {
      assert.equal(r.deadline.adjusted, true, 'expected a rollback');
      assert.equal(isoDate(r.deadline.nominal), c.movedFrom, 'nominal date');
      if ('reason' in c) assert.equal(r.deadline.adjustments[0].reason, c.reason, 'reason');
    } else {
      assert.equal(r.deadline.adjusted, false, `unexpected rollback from ${isoDate(r.deadline.nominal)} (${r.deadline.adjustments.map((a) => a.reason).join(', ')})`);
    }
  });
}
