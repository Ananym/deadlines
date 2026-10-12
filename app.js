import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/module.esm.js';
import DATA from './data.js';
import { calcDeadline, calcEarliestPublication, calcSaleDeadline, firstTuesday, parseLocalDate } from './calc.js';
import { holidayName, isoDate } from './holidays.js';

const STORAGE_KEY = 'deadlines:v2';
const LEGACY_KEY = 'deadlines:v1'; // v1 saved mode 'publish' by default; v2 defaults to 'sale'
const DAY_ABBR = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
const fmtShort = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtLongF = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const fmtDay = new Intl.DateTimeFormat('en-GB', { weekday: 'long' });
const fmtClock = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

// Deadlines are Georgia wall-clock times, so "now" is read in US Eastern time
// and held as a plain local Date like every other date in the app.
const easternParts = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
});
function easternNow() {
  const p = Object.fromEntries(easternParts.formatToParts(new Date()).map((x) => [x.type, x.value]));
  return new Date(+p.year, p.month - 1, +p.day, +p.hour, +p.minute);
}

function load() {
  try {
    const v2 = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (v2) return v2;
    const { mode, ...v1 } = JSON.parse(localStorage.getItem(LEGACY_KEY)) ?? {};
    return v1;
  } catch { return {}; }
}

Alpine.data('app', () => ({
  data: DATA,
  stateIndex: 0,
  selectedByState: {}, // state name -> [county names]
  query: '',
  open: false,
  courtDate: '',
  mode: 'sale', // 'sale' (Georgia foreclosure: 4 weekly runs before a first-Tuesday sale) | 'publish' (legacy, unverified data)
  direction: 'target', // publish mode only: 'target' (publish-by date -> send by) | 'send' (send date -> earliest issue)
  sendDate: '', // '' means right now; not saved, so a reload always starts from now
  now: easternNow(), // ticks every 30s so cutoffs that pass while the page is open drop out
  debug: false, // set by ?debug=…; nothing is saved while true

  init() {
    const saved = load();
    const idx = DATA.findIndex((s) => s.name === saved.state);
    if (idx >= 0) this.stateIndex = idx;
    this.selectedByState = saved.selectedByState ?? {};
    this.courtDate = saved.courtDate ?? '';
    if (saved.mode === 'publish') this.mode = 'publish';
    if (saved.direction === 'send') this.direction = 'send';
    const debug = new URLSearchParams(location.search).get('debug');
    if (debug === 'holiday') this.setupHolidayDebug();
    this.$watch('stateIndex', () => { if (!this.saleModeAvailable) this.mode = 'publish'; this.save(); });
    this.$watch('mode', () => this.save());
    this.$watch('direction', () => this.save());
    setInterval(() => { this.now = easternNow(); }, 30000);
    this.$watch('selectedByState', () => this.save());
    this.$watch('courtDate', () => this.save());
  },
  save() {
    if (this.debug) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        state: this.state.name, selectedByState: this.selectedByState, courtDate: this.courtDate, mode: this.mode, direction: this.direction,
      }));
    } catch { /* private mode etc. */ }
  },

  get state() { return DATA[this.stateIndex]; },
  get selected() { return this.selectedByState[this.state.name] ?? []; },
  set selected(names) { this.selectedByState = { ...this.selectedByState, [this.state.name]: names }; },
  get filteredCounties() {
    const q = this.query.trim().toLowerCase();
    return this.state.counties
      .filter((c) => !q || c.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
  get court() { return this.courtDate ? parseLocalDate(this.courtDate) : null; },
  get saleModeAvailable() { return this.state.name === 'Georgia'; },
  get isSale() { return this.mode === 'sale' && this.saleModeAvailable; },
  get isEarliest() { return !this.isSale && this.direction === 'send'; },
  get today() { return new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()); },
  get sendIsNow() { return !this.sendDate || this.sendDate === isoDate(this.today); },
  // A future (or past) send date counts from the start of that day.
  get sendAt() { return this.sendIsNow ? this.now : parseLocalDate(this.sendDate); },
  calcFor(county) {
    if (this.isEarliest) return calcEarliestPublication(county, this.sendAt);
    return this.isSale ? calcSaleDeadline(county, this.court) : calcDeadline(county, this.court);
  },
  get results() {
    if (!(this.isEarliest || this.court) || !this.selected.length) return [];
    const today = this.today;
    const byDate = this.isEarliest ? (r) => r.calc.publicationDate : (r) => r.calc.deadline.date;
    return this.selected
      .map((name) => this.state.counties.find((c) => c.name === name))
      .filter(Boolean)
      .map((county) => {
        const calc = this.calcFor(county);
        if (!calc) return null;
        const daysLeft = Math.round((calc.deadline.date - today) / 86400000);
        // Name of the bank holiday that pushed this deadline earlier, if any.
        const holiday = calc.deadline.adjustments.map((a) => holidayName(a.from)).find(Boolean) ?? null;
        return { county, calc, daysLeft, holiday };
      })
      .filter(Boolean)
      .sort((a, b) => byDate(a) - byDate(b) || a.county.name.localeCompare(b.county.name));
  },
  get holidayCount() { return this.results.filter((r) => r.holiday).length; },

  // ?debug=holiday: Georgia, a few counties, and the nearest upcoming
  // publish-by date on which an upcoming deadline is moved by a bank holiday.
  setupHolidayDebug() {
    this.debug = true;
    this.stateIndex = Math.max(0, DATA.findIndex((s) => s.name === 'Georgia'));
    this.mode = 'publish';
    this.direction = 'target';
    const wanted = ['Fulton', 'Effingham', 'Bacon', 'Quitman', 'Bleckley'];
    this.selected = wanted.filter((n) => this.state.counties.some((c) => c.name === n));
    const d = new Date(this.today);
    for (let i = 0; i < 400; i++) {
      d.setDate(d.getDate() + 1);
      this.courtDate = isoDate(d);
      if (this.results.some((r) => r.holiday && r.daysLeft >= 0)) break;
    }
  },

  selectState(i) { this.stateIndex = i; this.query = ''; this.open = false; },
  isSelected(name) { return this.selected.includes(name); },
  toggle(name) {
    this.selected = this.isSelected(name) ? this.selected.filter((n) => n !== name) : [...this.selected, name];
  },
  pickFirst() {
    const first = this.filteredCounties[0];
    if (first && !this.isSelected(first.name)) this.toggle(first.name);
    this.query = '';
  },
  popLast() { if (this.selected.length) this.selected = this.selected.slice(0, -1); },
  isFirstTuesday(d) { return firstTuesday(d.getFullYear(), d.getMonth()).getTime() === d.getTime(); },
  nextSale() {
    const today = this.today;
    let t = firstTuesday(today.getFullYear(), today.getMonth());
    if (t < today) t = firstTuesday(today.getFullYear(), today.getMonth() + 1);
    return t;
  },
  setNextSale() {
    this.courtDate = isoDate(this.nextSale());
  },
  isoDate,

  dayShort(county) {
    return county.publicationDays.length === 7 ? 'Daily' : county.publicationDays.map((d) => DAY_ABBR[d]).join(' ');
  },
  fmt: (d) => fmtShort.format(d),
  fmtLong: (d) => fmtLongF.format(d),
  dayName: (d) => fmtDay.format(d),
  clock: (d) => fmtClock.format(d).toLowerCase().replace(' ', ''), // "3:42pm", matching the data's style
  isToday(d) { return d.getTime() === this.today.getTime(); },
  // "Labor Day" | "a Saturday" | "Christmas Day, and the weekend before it"
  adjustReason(deadline) {
    if (!deadline.adjustments.length) return '';
    const holiday = deadline.adjustments.map((a) => holidayName(a.from)).find(Boolean);
    if (!holiday) return `a ${deadline.adjustments[0].reason}`;
    return deadline.adjustments.length > 1 && holidayName(deadline.nominal) ? `${holiday}, and the weekend before it` : holiday;
  },
  pubHolidayNote(calc) {
    const h = holidayName(calc.publicationDate);
    return h ? `Publication date is ${h}. Confirm the paper prints that day.` : '';
  },
  cautions(county) { return county.warnings ?? []; },
}));

window.Alpine = Alpine;
Alpine.start();
