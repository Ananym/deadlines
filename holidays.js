// US federal (bank) holidays, with observed dates.
// A holiday on Saturday is observed on the preceding Friday; on Sunday, the
// following Monday. That is the OPM/federal rule, which is the more
// conservative choice for a deadline calculator (it can only move a deadline
// earlier).

const cache = new Map();

function nthWeekday(year, month, weekday, n) {
  // month 0-11, weekday 0=Sun..6=Sat, n>=1 for nth, n=-1 for last
  if (n > 0) {
    const first = new Date(year, month, 1);
    const offset = (weekday - first.getDay() + 7) % 7;
    return new Date(year, month, 1 + offset + (n - 1) * 7);
  }
  const last = new Date(year, month + 1, 0);
  const offset = (last.getDay() - weekday + 7) % 7;
  return new Date(year, month, last.getDate() - offset);
}

function observed(date) {
  const d = new Date(date);
  if (d.getDay() === 6) d.setDate(d.getDate() - 1);
  else if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d;
}

export function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Map of ISO date -> holiday name for a given year (observed dates). */
export function federalHolidays(year) {
  if (cache.has(year)) return cache.get(year);
  const fixed = (m, d, name) => [observed(new Date(year, m, d)), name];
  const list = [
    fixed(0, 1, "New Year's Day"),
    [nthWeekday(year, 0, 1, 3), 'Martin Luther King Jr. Day'],
    [nthWeekday(year, 1, 1, 3), "Presidents' Day"],
    [nthWeekday(year, 4, 1, -1), 'Memorial Day'],
    fixed(5, 19, 'Juneteenth'),
    fixed(6, 4, 'Independence Day'),
    [nthWeekday(year, 8, 1, 1), 'Labor Day'],
    [nthWeekday(year, 9, 1, 2), 'Columbus Day'],
    fixed(10, 11, 'Veterans Day'),
    [nthWeekday(year, 10, 4, 4), 'Thanksgiving Day'],
    fixed(11, 25, 'Christmas Day'),
  ];
  // New Year's Day of next year can be observed on Dec 31 of this year.
  const nextNY = observed(new Date(year + 1, 0, 1));
  if (nextNY.getFullYear() === year) list.push([nextNY, "New Year's Day (observed)"]);

  const map = new Map();
  for (const [date, name] of list) {
    const key = isoDate(date);
    const orig = name.endsWith('(observed)') ? name : name;
    map.set(key, orig);
  }
  cache.set(year, map);
  return map;
}

/** Returns the holiday name if the date is a federal holiday (observed), else null. */
export function holidayName(date) {
  return federalHolidays(date.getFullYear()).get(isoDate(date)) ?? null;
}

export function isWeekend(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

export function isBusinessDay(date) {
  return !isWeekend(date) && !holidayName(date);
}
