// Local storage management for user profile and daily data
import { DEFAULT_USER, PROFILE_KEY, DAY_KEY } from './config.js';
import { todayKey, lastNightDefaultBed, defaultWakeFromBed } from './utils.js';

// Profile storage functions
export function readProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    const profile = saved ? JSON.parse(saved) : DEFAULT_USER;
    return profile;
  } catch (_error) {
    return DEFAULT_USER;
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (_error) {
    // noop
  }
}

// Daily data storage functions
export function readDay() {
  try {
    const saved = JSON.parse(localStorage.getItem(DAY_KEY) || 'null');
    if (!saved || saved.date !== todayKey()) {
      const bed = lastNightDefaultBed();
      const wake = defaultWakeFromBed(bed.toISOString());
      return {
        date: todayKey(),
        activities: [],
        foods: [],
        bedtimeISO: bed.toISOString(),
        waketimeISO: wake.toISOString(),
      };
    }
    if (!('foods' in saved)) saved.foods = [];
    return saved;
  } catch (_error) {
    const bed = lastNightDefaultBed();
    const wake = defaultWakeFromBed(bed.toISOString());
    return {
      date: todayKey(),
      activities: [],
      foods: [],
      bedtimeISO: bed.toISOString(),
      waketimeISO: wake.toISOString(),
    };
  }
}

export function saveDay(day) {
  try {
    localStorage.setItem(DAY_KEY, JSON.stringify(day));
  } catch (_error) {
    // noop
  }
}

export function createNewDay(existingDay) {
  return {
    date: todayKey(),
    activities: [],
    foods: existingDay.foods || [],
    bedtimeISO: existingDay.bedtimeISO,
    waketimeISO: existingDay.waketimeISO,
  };
}


