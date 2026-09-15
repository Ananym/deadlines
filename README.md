# Publication Deadline Calculator

Given a court deadline (the date a legal notice must have been published by) and a set of counties, this tells you when the notice must reach each county's official newspaper. Covers Georgia (159 counties, confirmed against the November 2026 sale report) and South Carolina (46 counties, 2022 data only partly verified).

**Live:** https://ananym.github.io/deadlines/

## How it works

**Publish by date** (both states):

1. Find the last day the paper publishes on or before the date given.
2. Subtract that paper's lead time (e.g. "5 days prior @ 4pm").
3. If that lands on a weekend or a US federal holiday, move back to the previous business day. A Monday holiday therefore gives a Friday deadline. A deadline the day *after* a holiday is not moved.

**Foreclosure sale** (Georgia): sales are held on the first Tuesday of the month and the notice must run once a week for the four weeks immediately before. The first insertion is the paper's first publication day on or after 28 days before the sale; the deadline shown is for that first insertion, with the same holiday rule. This mode reproduces the office's November 2026 sale report for all 159 counties.

Federal holidays use the observed-date rule (Saturday holidays observed Friday, Sunday holidays observed Monday). If a publication date itself is a holiday, the result carries a note to confirm the paper prints that day.

## Stack

No build step. `index.html` loads [Alpine.js](https://alpinejs.dev) from a CDN as an ES module; everything else is plain files:

| File | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | UI |
| `calc.js`, `holidays.js` | Pure logic, shared with the tests |
| `data.js` | Generated county data. Do not edit by hand |
| `data/*.csv` | Source data (pipe-delimited) |
| `scripts/build-data.mjs` | Regenerates `data.js` from the CSVs and reports inconsistent rows |
| `scripts/test.mjs` | Tests: `node --test scripts/test.mjs` |
| `scripts/cases.mjs` | Input-to-output cases for the calculation. Add a line to add a test |
| `data/review-notes.json` | Per-county cautions shown in the app, distilled from the verification report |
| `data/VERIFICATION.md` | What has been checked against live sources (Sept 2026) |

Run locally with any static server, e.g. `python -m http.server` or `npx serve`, then open `index.html`. Opening the file directly won't work because ES modules need HTTP.

## Updating the data

Edit the CSV in `data/`, then:

```
node scripts/build-data.mjs
node --test scripts/test.mjs
```

Georgia rows look like `COUNTY|Wednesday|friday Week prior @ 4:00 (5 days prior @ 4pm)` with an optional fourth column for a late deadline. The parenthetical summary is what the app uses, except that the weekday named in the prose wins when the summary's day count lands on a different weekday. Every disagreement is printed at build time and shown in the app as a "Data caution". Add or remove entries in `data/review-notes.json` to show or clear cautions for a county.

South Carolina rows look like `County|Wednesday, Friday|2 days prior @ 12pm`, with `Daily` for every day and `Tuesday-Friday: … / Saturday-Monday: Thursday @ 4pm` for per-day rules.

## Deployment

GitHub Pages serves the `main` branch root directly. Pushing to `main` deploys. The CI workflow only runs the tests.
