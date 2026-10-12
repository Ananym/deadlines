// Input -> expected output cases for the deadline calculation.
// Add a line per case; scripts/test.mjs checks every one against data.js.
//
//   state, county   which row in data.js
//   court           the date the notice must be published by (YYYY-MM-DD), or
//   sale            a Georgia foreclosure sale date (first Tuesday): the notice
//                   runs weekly for the 4 weeks before it and the deadline is
//                   for the first insertion
//   send            or: when the notice is sent, "YYYY-MM-DD HH:MM" (24h); finds
//                   the earliest issue whose deadline has not passed
//   publication     expected publication date (first insertion in sale mode)
//   deadline        expected submission date and time, "YYYY-MM-DD time"
//   movedFrom       (optional) nominal date before the weekend/holiday rollback
//   reason          (optional) first reason for the rollback, e.g. "Labor Day" or "Saturday"
//
// Reference: 2026-09-07 is Labor Day (Mon); 2026-11-26 Thanksgiving (Thu);
// 2026-12-25 Christmas (Fri); 2026-07-03 is Independence Day observed (Fri);
// 2027-01-18 MLK Day (Mon); 2027-05-31 Memorial Day (Mon).

export default [
  // Plain weekly paper, no adjustment.
  { state: 'Georgia', county: 'Appling', court: '2026-09-16', publication: '2026-09-16', deadline: '2026-09-11 4pm' },
  // Court date is not a publication day: use the last issue before it.
  { state: 'Georgia', county: 'Appling', court: '2026-09-15', publication: '2026-09-09', deadline: '2026-09-04 4pm' },
  // Fulton: Wednesday paper, Monday of the week before at noon; that Monday is Labor Day -> Friday.
  { state: 'Georgia', county: 'Fulton', court: '2026-09-16', publication: '2026-09-16', deadline: '2026-09-04 12pm', movedFrom: '2026-09-07', reason: 'Labor Day' },
  // Monday deadline on Labor Day -> Friday.
  { state: 'Georgia', county: 'Effingham', court: '2026-09-09', publication: '2026-09-09', deadline: '2026-09-04 12pm', movedFrom: '2026-09-07', reason: 'Labor Day' },
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
  // Long: Thursday paper, Tuesday of the same week at noon.
  { state: 'Georgia', county: 'Long', court: '2026-09-17', publication: '2026-09-17', deadline: '2026-09-15 12pm' },

  // ---- Sale mode: rows taken verbatim from the confirmed November 2026 sale report ----
  { state: 'Georgia', county: 'Fulton', sale: '2026-11-03', publication: '2026-10-07', deadline: '2026-09-28 12pm' },
  { state: 'Georgia', county: 'Johnson', sale: '2026-11-03', publication: '2026-10-06', deadline: '2026-09-30 9am' },
  { state: 'Georgia', county: 'Dekalb', sale: '2026-11-03', publication: '2026-10-08', deadline: '2026-09-30 12pm' },
  { state: 'Georgia', county: 'Lamar', sale: '2026-11-03', publication: '2026-10-06', deadline: '2026-10-01 10am' },
  { state: 'Georgia', county: 'Spalding', sale: '2026-11-03', publication: '2026-10-10', deadline: '2026-10-02 4pm' },
  { state: 'Georgia', county: 'Cobb', sale: '2026-11-03', publication: '2026-10-09', deadline: '2026-10-02 12pm' },
  { state: 'Georgia', county: 'Wilcox', sale: '2026-11-03', publication: '2026-10-07', deadline: '2026-10-05 3:30pm' },
  { state: 'Georgia', county: 'Laurens', sale: '2026-11-03', publication: '2026-10-10', deadline: '2026-10-08 9:30am' },
  { state: 'Georgia', county: 'Glynn', sale: '2026-11-03', publication: '2026-10-10', deadline: '2026-10-08 12pm' },
  { state: 'Georgia', county: 'Newton', sale: '2026-11-03', publication: '2026-10-10', deadline: '2026-10-07 12pm' },
  // December 2026 sale (1 Dec): Fulton's Monday-noon deadline is 26 Oct, an ordinary Monday.
  { state: 'Georgia', county: 'Fulton', sale: '2026-12-01', publication: '2026-11-04', deadline: '2026-10-26 12pm' },
  // January 2027 sale (5 Jan): a Saturday paper's first run is 12 Dec, deadline Fri 4 Dec.
  { state: 'Georgia', county: 'Spalding', sale: '2027-01-05', publication: '2026-12-12', deadline: '2026-12-04 4pm' },

  // ---- Earliest issue for a notice sent at a given moment ----
  // Appling: Wednesday paper, Friday 4pm cutoff. One minute either side of it.
  { state: 'Georgia', county: 'Appling', send: '2026-10-16 15:59', publication: '2026-10-21', deadline: '2026-10-16 4pm' },
  { state: 'Georgia', county: 'Appling', send: '2026-10-16 16:00', publication: '2026-10-21', deadline: '2026-10-16 4pm' },
  { state: 'Georgia', county: 'Appling', send: '2026-10-16 16:01', publication: '2026-10-28', deadline: '2026-10-23 4pm' },
  // Fulton on Columbus Day: the 21 Oct issue's Monday deadline rolled back to Fri 9 Oct, so it's gone already.
  { state: 'Georgia', county: 'Fulton', send: '2026-10-12 09:00', publication: '2026-10-28', deadline: '2026-10-19 12pm' },
  // Quitman: Wednesday paper, Tuesday noon cutoff, the day before.
  { state: 'Georgia', county: 'Quitman', send: '2026-10-13 11:00', publication: '2026-10-14', deadline: '2026-10-13 12pm' },
  // Thanksgiving week: Bleckley's Thu 26 Nov cutoff moves to Wed 25 Nov, which is missed late on the 25th.
  { state: 'Georgia', county: 'Bleckley', send: '2026-11-25 17:00', publication: '2026-12-10', deadline: '2026-12-03 4pm' },
];
