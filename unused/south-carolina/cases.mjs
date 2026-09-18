// South Carolina rows removed from scripts/cases.mjs when the state was siloed.
export default [
  // Daily paper whose nominal deadline is a Saturday -> Friday.
  { state: 'South Carolina', county: 'Aiken', court: '2026-09-15', publication: '2026-09-15', deadline: '2026-09-11 4pm', movedFrom: '2026-09-12', reason: 'Saturday' },
  // Per-day rules: Charleston weekend editions use Thursday @ 4pm, weekdays 2 days prior @ 12pm.
  { state: 'South Carolina', county: 'Charleston', court: '2026-09-13', publication: '2026-09-13', deadline: '2026-09-10 4pm' },
  { state: 'South Carolina', county: 'Charleston', court: '2026-09-16', publication: '2026-09-16', deadline: '2026-09-14 12pm' },
  // Two publication days with different lead times.
  { state: 'South Carolina', county: 'Darlington', court: '2026-09-18', publication: '2026-09-18', deadline: '2026-09-15 5pm' },
  { state: 'South Carolina', county: 'Darlington', court: '2026-09-17', publication: '2026-09-16', deadline: '2026-09-11 5pm' },
];
