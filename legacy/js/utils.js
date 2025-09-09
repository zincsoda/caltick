// Utility functions
export const $ = id => document.getElementById(id);

// Unit conversion helpers
export const toKg = (v, unit) => unit === 'lb' ? v * 0.45359237 : v;
export const toCm = (v, unit) => unit === 'in' ? v * 2.54 : v;

// Math helpers
export const clamp = (n, min, max) => Math.min(max, Math.max(min, isFinite(n) ? n : 0));

// Date helpers
export const todayKey = () => new Date().toISOString().slice(0, 10);
export const pad2 = n => String(n).padStart(2, '0');
export const toLocalDatetimeValue = d => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

// Default sleep time helpers
export function lastNightDefaultBed() {
  const now = new Date();
  const d = new Date(now);
  const hour = 22, min = 30; // 10:30 PM
  d.setHours(hour, min, 0, 0);
  if (now.getHours() < hour || (now.getHours() === hour && now.getMinutes() < min)) {
    d.setDate(d.getDate() - 1);
  }
  return d;
}

export function defaultWakeFromBed(bedISO) {
  const bed = new Date(bedISO);
  return new Date(bed.getTime() + 7.5 * 3600_000); // 7.5 hours
}

// Formatting helpers
export const fmtKcal2 = n => (Math.round(n * 100) / 100).toLocaleString(undefined, { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
}) + ' kcal';

export const fmtKcal0 = n => Math.round(n).toLocaleString(undefined) + ' kcal';

export const fmtH = h => (Math.round(h * 10) / 10).toFixed(1) + 'h';
