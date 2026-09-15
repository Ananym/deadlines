// Pure deadline arithmetic. No DOM, no globals: shared by the browser app and
// the Node tests.

import { holidayName, isWeekend, isBusinessDay } from './holidays.js';

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

/** Parse "YYYY-MM-DD" as a local date (no timezone shift). */
export function parseLocalDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Latest date on or before `courtDate` that the paper publishes.
 * Returns null if the county has no publication days (bad data).
 */
export function publicationDateFor(county, courtDate) {
  let d = new Date(courtDate);
  for (let i = 0; i < 7; i++) {
    if (county.publicationDays.includes(DAY_NAMES[d.getDay()])) return d;
    d = addDays(d, -1);
  }
  return null;
}

/**
 * Move a date back to the previous business day if it lands on a weekend or
 * US federal holiday. Returns { date, adjustments: [{ from, reason }] }.
 *
 * Rule from the business: "any paper with a Monday deadline will end up with a
 * Friday deadline in the event of a bank holiday." Generalised: a deadline on
 * a non-business day rolls back to the nearest prior business day, skipping
 * weekends and holidays together, so a Tuesday deadline after a Monday holiday
 * is untouched, and a Monday holiday preceded by a weekend lands on Friday.
 */
export function rollBackToBusinessDay(date) {
  const adjustments = [];
  let d = new Date(date);
  let guard = 0;
  while (!isBusinessDay(d) && guard++ < 10) {
    const reason = holidayName(d) ?? (isWeekend(d) ? DAY_NAMES[d.getDay()] : 'non-business day');
    adjustments.push({ from: d, reason });
    d = addDays(d, -1);
  }
  return { date: d, adjustments };
}

function buildDeadline(publicationDate, rule) {
  const nominal = addDays(publicationDate, -rule.daysPrior);
  const { date, adjustments } = rollBackToBusinessDay(nominal);
  return { date, time: rule.time, nominal, adjusted: adjustments.length > 0, adjustments };
}

/**
 * Georgia foreclosure sales happen on the first Tuesday of the month and the
 * notice must run once a week for the four weeks immediately preceding the
 * sale (O.C.G.A. 9-13-141). The first insertion is therefore the paper's
 * first publication day on or after (sale - 28 days); the fourth is 21 days
 * later. Returns the same shape as calcDeadline plus firstPublication /
 * lastPublication, with the deadline computed from the first insertion.
 */
export function calcSaleDeadline(county, saleDate) {
  const windowStart = addDays(saleDate, -28);
  let first = null;
  for (let i = 0; i < 7; i++) {
    const d = addDays(windowStart, i);
    if (county.publicationDays.includes(DAY_NAMES[d.getDay()])) { first = d; break; }
  }
  if (!first) return null;
  const base = calcDeadline(county, first);
  if (!base) return null;
  return { ...base, firstPublication: first, lastPublication: addDays(first, 21), saleDate };
}

/** First Tuesday of a month (Georgia foreclosure sale day). month is 0-11. */
export function firstTuesday(year, month) {
  const d = new Date(year, month, 1);
  return addDays(d, (2 - d.getDay() + 7) % 7);
}

/**
 * Compute everything the UI needs for one county and a court date.
 * Returns null when the county cannot be computed (no publication days).
 */
export function calcDeadline(county, courtDate) {
  const publicationDate = publicationDateFor(county, courtDate);
  if (!publicationDate) return null;
  const pubDay = DAY_NAMES[publicationDate.getDay()];
  const rule = county.deadlines[pubDay];
  if (!rule) return null;

  const deadline = buildDeadline(publicationDate, rule);
  const lateRule = county.lateDeadlines?.[pubDay];
  const lateDeadline = lateRule ? buildDeadline(publicationDate, lateRule) : null;

  const notes = [];
  const pubHoliday = holidayName(publicationDate);
  if (pubHoliday) notes.push(`Publication date falls on ${pubHoliday}. Confirm the paper prints that day.`);
  if (publicationDate.getTime() !== courtDate.getTime()) {
    const gap = Math.round((courtDate - publicationDate) / 86400000);
    notes.push(`Paper publishes on ${county.publicationDays.length === 7 ? 'every day' : county.publicationDays.join(', ')}; the last issue before the court date is ${gap} day${gap === 1 ? '' : 's'} earlier.`);
  }
  for (const w of county.warnings ?? []) notes.push(`Data caution: ${w}. Confirm with the paper.`);

  return { publicationDate, pubDay, rule, deadline, lateDeadline, notes };
}
