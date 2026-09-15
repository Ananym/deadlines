// Input -> expected output cases for the deadline calculation.
// Add a line per case; scripts/test.mjs checks every one against data.js.
//
//   state, county   which row in data.js
//   court           the date the notice must be published by (YYYY-MM-DD)
//   publication     expected publication date
//   deadline        expected submission date and time, "YYYY-MM-DD time"
//   late            (optional) expected late deadline, same format, or null for "none"
//   movedFrom       (optional) nominal date before the weekend/holiday rollback
//   reason          (optional) first reason for the rollback, e.g. "Labor Day" or "Saturday"
//
// Reference: 2026-09-07 is Labor Day (Mon); 2026-11-26 Thanksgiving (Thu);
// 2026-12-25 Christmas (Fri); 2026-07-03 is Independence Day observed (Fri);
// 2027-01-18 MLK Day (Mon); 2027-05-31 Memorial Day (Mon).

export default [
  // Plain weekly paper, no adjustment.
  { state: 'Georgia', county: 'Appling', court: '2026-09-16', publication: '2026-09-16', deadline: '2026-09-11 4pm', late: null },
  // Court date is not a publication day: use the last issue before it.
  { state: 'Georgia', county: 'Appling', court: '2026-09-15', publication: '2026-09-09', deadline: '2026-09-04 4pm' },
  // Georgia late deadline differs from the regular one.
  { state: 'Georgia', county: 'Fulton', court: '2026-09-17', publication: '2026-09-17', deadline: '2026-09-11 12pm', late: '2026-09-14 12pm' },
  // Monday deadline on Labor Day -> Friday.
  { state: 'Georgia', county: 'Hall', court: '2026-09-09', publication: '2026-09-09', deadline: '2026-09-04 5pm', movedFrom: '2026-09-07', reason: 'Labor Day' },
  // Tuesday deadline right after a Monday holiday is untouched.
  { state: 'Georgia', county: 'Quitman', court: '2026-09-09', publication: '2026-09-09', deadline: '2026-09-08 12pm' },
  // Thursday deadline on Thanksgiving -> Wednesday.
  { state: 'Georgia', county: 'Bleckley', court: '2026-12-03', publication: '2026-12-03', deadline: '2026-11-25 4pm', movedFrom: '2026-11-26', reason: 'Thanksgiving Day' },
  // Friday deadline on Christmas Day -> Thursday.
  { state: 'Georgia', county: 'Bacon', court: '2026-12-30', publication: '2026-12-30', deadline: '2026-12-24 5pm', movedFrom: '2026-12-25', reason: 'Christmas Day' },
  // Observed holiday: July 4 2026 is a Saturday, observed Friday July 3, so a Friday deadline -> Thursday.
  { state: 'Georgia', county: 'Bacon', court: '2026-07-08', publication: '2026-07-08', deadline: '2026-07-02 5pm', movedFrom: '2026-07-03', reason: 'Independence Day' },
  // MLK Day 2027 for a Monday-deadline paper.
  { state: 'Georgia', county: 'Effingham', court: '2027-01-20', publication: '2027-01-20', deadline: '2027-01-15 12pm', movedFrom: '2027-01-18', reason: 'Martin Luther King Jr. Day' },
  // Memorial Day 2027.
  { state: 'Georgia', county: 'Sumter', court: '2027-06-02', publication: '2027-06-02', deadline: '2027-05-28 9am', movedFrom: '2027-05-31', reason: 'Memorial Day' },
  // Daily paper whose nominal deadline is a Saturday -> Friday.
  { state: 'South Carolina', county: 'Aiken', court: '2026-09-15', publication: '2026-09-15', deadline: '2026-09-11 4pm', movedFrom: '2026-09-12', reason: 'Saturday' },
  // Per-day rules: Charleston weekend editions use Thursday @ 4pm, weekdays 2 days prior @ 12pm.
  { state: 'South Carolina', county: 'Charleston', court: '2026-09-13', publication: '2026-09-13', deadline: '2026-09-10 4pm' },
  { state: 'South Carolina', county: 'Charleston', court: '2026-09-16', publication: '2026-09-16', deadline: '2026-09-14 12pm' },
  // Two publication days with different lead times.
  { state: 'South Carolina', county: 'Darlington', court: '2026-09-18', publication: '2026-09-18', deadline: '2026-09-15 5pm' },
  { state: 'South Carolina', county: 'Darlington', court: '2026-09-17', publication: '2026-09-16', deadline: '2026-09-11 5pm' },
  // Long: the CSV's "9 days prior" was corrected to the Wednesday named in the source (5 days).
  { state: 'Georgia', county: 'Long', court: '2026-09-14', publication: '2026-09-14', deadline: '2026-09-09 5pm' },
];
