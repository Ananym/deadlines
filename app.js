import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/dist/module.esm.js';
import DATA from './data.js';
import { calcDeadline, parseLocalDate } from './calc.js';

const STORAGE_KEY = 'deadlines:v1';
const DAY_ABBR = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
const fmtShort = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtLongF = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}; } catch { return {}; }
}

Alpine.data('app', () => ({
  data: DATA,
  stateIndex: 0,
  selectedByState: {}, // state name -> [county names]
  query: '',
  courtDate: '',

  init() {
    const saved = load();
    const idx = DATA.findIndex((s) => s.name === saved.state);
    if (idx >= 0) this.stateIndex = idx;
    this.selectedByState = saved.selectedByState ?? {};
    this.courtDate = saved.courtDate ?? '';
    this.$watch('stateIndex', () => this.save());
    this.$watch('selectedByState', () => this.save());
    this.$watch('courtDate', () => this.save());
  },
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        state: this.state.name, selectedByState: this.selectedByState, courtDate: this.courtDate,
      }));
    } catch { /* private mode etc. */ }
  },

  get state() { return DATA[this.stateIndex]; },
  get selected() { return this.selectedByState[this.state.name] ?? []; },
  set selected(names) { this.selectedByState = { ...this.selectedByState, [this.state.name]: names }; },
  get countyCount() { return DATA.reduce((n, s) => n + s.counties.length, 0); },
  get filteredCounties() {
    const q = this.query.trim().toLowerCase();
    return this.state.counties.filter((c) => !q || c.name.toLowerCase().includes(q));
  },
  get court() { return this.courtDate ? parseLocalDate(this.courtDate) : null; },
  get results() {
    if (!this.court || !this.selected.length) return [];
    const today = parseLocalDate(todayIso());
    return this.selected
      .map((name) => this.state.counties.find((c) => c.name === name))
      .filter(Boolean)
      .map((county) => {
        const calc = calcDeadline(county, this.court);
        const daysLeft = calc ? Math.round((calc.deadline.date - today) / 86400000) : NaN;
        return { county, calc, daysLeft };
      })
      .filter((r) => r.calc)
      .sort((a, b) => a.calc.deadline.date - b.calc.deadline.date || a.county.name.localeCompare(b.county.name));
  },

  selectState(i) { this.stateIndex = i; this.query = ''; },
  isSelected(name) { return this.selected.includes(name); },
  toggle(name) {
    this.selected = this.isSelected(name) ? this.selected.filter((n) => n !== name) : [...this.selected, name];
  },
  pickFirst() {
    const first = this.filteredCounties[0];
    if (first && !this.isSelected(first.name)) this.toggle(first.name);
    this.query = '';
  },
  selectAllFiltered() {
    const names = new Set([...this.selected, ...this.filteredCounties.map((c) => c.name)]);
    this.selected = [...names];
  },
  clearSelection() { this.selected = []; },
  setToday() { this.courtDate = todayIso(); },

  dayShort(county) {
    return county.publicationDays.length === 7 ? 'Daily' : county.publicationDays.map((d) => DAY_ABBR[d]).join(' ');
  },
  fmt: (d) => fmtShort.format(d),
  fmtLong: (d) => fmtLongF.format(d),
  countdown(n) {
    if (Number.isNaN(n)) return '';
    if (n < 0) return `${-n} day${n === -1 ? '' : 's'} ago`;
    if (n === 0) return 'Today';
    if (n === 1) return 'Tomorrow';
    return `in ${n} days`;
  },
}));

window.Alpine = Alpine;
Alpine.start();
