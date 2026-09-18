// South Carolina parser, siloed out of scripts/build-data.mjs (Sept 2026).
// The 2022 data was only partly verified (see data/VERIFICATION.md), so the
// state is not shipped for now. To re-enable:
//   1. git mv "unused/south-carolina/South Carolina.csv" data/
//   2. import buildSouthCarolina from this file in scripts/build-data.mjs and
//      add { name: 'South Carolina', counties: buildSouthCarolina(helpers) }
//      to the data array (helpers = { readRows, DAYS, dayIndex, normalizeTime,
//      daysBackToWeekday, titleCase }).
//   3. Merge review-notes.json here into data/review-notes.json, and cases.mjs
//      / test.mjs here into scripts/.
//
// Row formats:
// "2 days prior @ 5pm"
// "Tuesday-Friday: 2 days prior @ 12pm / Saturday-Monday: Thursday @ 4pm"
// "Wednesday: 5 days prior @ 5 pm / Friday: 3 days prior @ 5 pm"

export default function buildSouthCarolina({ readRows, DAYS, dayIndex, normalizeTime, daysBackToWeekday, titleCase }) {
  function parseRule(rule, pubDay) {
    let m = rule.match(/(\d+)\s*days?\s*prior\s*@\s*(.+)$/i);
    if (m) return { daysPrior: Number(m[1]), time: normalizeTime(m[2]) };
    m = rule.match(/^(\w+)\s*@\s*(.+)$/);
    if (m) return { daysPrior: daysBackToWeekday(pubDay, m[1], false), time: normalizeTime(m[2]) };
    throw new Error(`Cannot parse rule "${rule}"`);
  }

  function expandDayRange(spec) {
    const m = spec.match(/^(\w+)(?:-(\w+))?$/);
    if (!m) throw new Error(`Bad day spec "${spec}"`);
    const start = dayIndex(m[1]);
    if (!m[2]) return [DAYS[start]];
    const out = [];
    for (let i = start; ; i = (i + 1) % 7) {
      out.push(DAYS[i]);
      if (i === dayIndex(m[2])) break;
    }
    return out;
  }

  return readRows('South Carolina.csv').map(([county, pubDays, deadline]) => {
    const name = titleCase(county);
    const publicationDays = pubDays.toLowerCase() === 'daily'
      ? [...DAYS]
      : pubDays.split(',').map((d) => DAYS[dayIndex(d.trim())]);
    const deadlines = {};
    const parts = deadline.split('/').map((p) => p.trim());
    for (const part of parts) {
      const scoped = part.match(/^([\w-]+):\s*(.+)$/);
      const days = scoped ? expandDayRange(scoped[1]) : publicationDays;
      const rule = scoped ? scoped[2] : part;
      for (const day of days) {
        if (!publicationDays.includes(day)) continue;
        deadlines[day] = parseRule(rule, day);
      }
    }
    for (const day of publicationDays) {
      if (!deadlines[day]) throw new Error(`SC ${name}: no deadline for ${day}`);
    }
    return { name, publicationDays, deadlines, source: { publicationDay: pubDays, deadline } };
  });
}
