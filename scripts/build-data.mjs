// Converts data/*.csv into data.js (the file the web app loads).
// Run:  node scripts/build-data.mjs
// Prints a warning for every row whose prose description disagrees with its
// "(N days prior @ time)" summary, so data problems surface at build time.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const warnings = [];
let rowWarnings = [];
const warn = (msg) => { warnings.push(msg); rowWarnings.push(msg.replace(/^GA [^:]+: /, '')); };

const dayIndex = (name) => {
  const i = DAYS.findIndex((d) => d.toLowerCase().startsWith(name.toLowerCase().slice(0, 2)) && d.toLowerCase().startsWith(name.toLowerCase()));
  if (i < 0) throw new Error(`Unknown day: ${name}`);
  return i;
};

// "4:30pm", "12 pm", "5:00" -> "4:30pm" | "12pm" | "5:00" (unknown meridiem left as-is)
function normalizeTime(raw) {
  const m = raw.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) throw new Error(`Bad time: ${raw}`);
  const [, h, min, mer] = m;
  return `${Number(h)}${min && min !== '00' ? ':' + min : ''}${mer ?? ''}`;
}

// Days from publication day back to the named weekday. "week of" means the
// named day falls in the same calendar week as publication (before it);
// "week prior" means it falls the week before.
function daysBackToWeekday(pubDay, targetDay, weekPrior) {
  let n = dayIndex(pubDay) - dayIndex(targetDay);
  if (weekPrior) n += 7; else if (n <= 0) n += 7;
  return n;
}

function readRows(file) {
  return readFileSync(join(root, 'data', file), 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split('|').map((c) => c.trim()));
}

const titleCase = (s) => s.toLowerCase().replace(/(^|[\s-])\S/g, (c) => c.toUpperCase()).replace(/\bMc(\w)/g, (_, c) => 'Mc' + c.toUpperCase());

// ---------- Georgia ----------
// "friday Week prior @ 4:00 (5 days prior @ 4pm)"
function parseGeorgiaDeadline(raw, pubDay, county, label) {
  const paren = raw.match(/\((\d+)\s*days?\s*prior\s*@\s*([^)]+)\)/i);
  const prose = raw.match(/^(\w+)\s+week\s+(prior|of)\s*@\s*([\d:]+)/i);
  let result;
  if (paren) result = { daysPrior: Number(paren[1]), time: normalizeTime(paren[2]) };
  if (prose) {
    const fromProse = daysBackToWeekday(pubDay, prose[1], prose[2].toLowerCase() === 'prior');
    if (!result) {
      // No summary; infer time meridiem: 1-7 => pm, 8-11 => am, 12 => pm.
      const t = normalizeTime(prose[3]);
      const h = Number(t.split(':')[0]);
      result = { daysPrior: fromProse, time: t + (h >= 8 && h <= 11 ? 'am' : 'pm') };
      warn(`GA ${county} ${label}: no "(N days prior)" summary, derived ${fromProse} days prior @ ${result.time} from "${raw}"`);
    } else if (fromProse !== result.daysPrior) {
      // Trust the weekday named in the prose: if the summary's count lands on
      // that weekday it is fine (the "week of/prior" wording is loose); if
      // not, the count is a typo and the named weekday wins.
      const summaryLandsOn = (dayIndex(pubDay) - result.daysPrior % 7 + 7) % 7;
      if (summaryLandsOn !== dayIndex(prose[1])) {
        warn(`GA ${county} ${label}: summary says ${result.daysPrior} days prior (a ${DAYS[summaryLandsOn]}) but the source names ${prose[1]}; using ${fromProse} days prior`);
        result.daysPrior = fromProse;
      }
    } else {
      const proseHour = Number(prose[3].split(':')[0]);
      const sumHour = Number(result.time.split(/[:apm]/)[0]);
      if (proseHour !== sumHour) warn(`GA ${county} ${label}: prose time ${prose[3]} disagrees with summary time ${result.time}; using summary`);
    }
  }
  if (!result) throw new Error(`GA ${county} ${label}: cannot parse "${raw}"`);
  return result;
}

function buildGeorgia() {
  const rows = readRows('Georgia.csv').slice(1); // header
  return rows.map(([county, pubDay, deadline, late]) => {
    const name = titleCase(county);
    rowWarnings = [];
    const d = parseGeorgiaDeadline(deadline, pubDay, name, 'deadline');
    const entry = {
      name,
      publicationDays: [pubDay],
      deadlines: { [pubDay]: d },
      source: { publicationDay: pubDay, deadline },
    };
    if (late) {
      entry.source.lateDeadline = late;
      const l = parseGeorgiaDeadline(late, pubDay, name, 'late deadline');
      if (l.daysPrior > d.daysPrior) warn(`GA ${name}: late deadline (${l.daysPrior} days prior) is earlier than the regular deadline (${d.daysPrior} days prior)`);
      if (l.daysPrior !== d.daysPrior || l.time !== d.time) entry.lateDeadlines = { [pubDay]: l };
    }
    if (rowWarnings.length) entry.warnings = [...rowWarnings];
    return entry;
  });
}

const data = [
  { name: 'Georgia', counties: buildGeorgia() },
];

// Cautions from data/VERIFICATION.md, keyed by state then county.
const reviewNotes = JSON.parse(readFileSync(join(root, 'data', 'review-notes.json'), 'utf8'));
for (const state of data) {
  for (const [name, note] of Object.entries(reviewNotes[state.name] ?? {})) {
    const county = state.counties.find((c) => c.name === name);
    if (!county) throw new Error(`review-notes.json: no county "${name}" in ${state.name}`);
    (county.warnings ??= []).push(note);
  }
}

const header = `// GENERATED by scripts/build-data.mjs from data/*.csv — do not edit by hand.
// Georgia: confirmed against the November 2026 sale deadline report (Sept 2026).
// South Carolina is siloed in unused/south-carolina/ until its data is verified.
`;
writeFileSync(join(root, 'data.js'), `${header}export const DATA_COMPILED = { Georgia: '2026-09' };\nexport default ${JSON.stringify(data, null, 1)};\n`);

const total = data.reduce((n, s) => n + s.counties.length, 0);
console.log(`Wrote data.js: ${data.map((s) => `${s.name} ${s.counties.length}`).join(', ')} (${total} counties)`);
if (warnings.length) {
  console.log(`\n${warnings.length} data warning(s):`);
  for (const w of warnings) console.log(' - ' + w);
}
