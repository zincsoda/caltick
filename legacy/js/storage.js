// Local storage management for user profile and daily data
import { DEFAULT_USER, PROFILE_KEY, DAY_KEY } from './config.js';
import { todayKey, lastNightDefaultBed, defaultWakeFromBed } from './utils.js';

// Profile storage functions
export function readProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    console.log('Reading profile from storage:', saved);
    const profile = saved ? JSON.parse(saved) : DEFAULT_USER;
    console.log('Returning profile:', profile);
    return profile;
  } catch (error) {
    console.error('Error reading profile:', error);
    return DEFAULT_USER;
  }
}

export function saveProfile(profile) {
  try {
    console.log('Saving profile to storage:', profile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
}

// Daily data storage functions
export function readDay() {
  try {
    const saved = JSON.parse(localStorage.getItem(DAY_KEY) || 'null');
    console.log('Reading day from storage:', saved);
    
    if (!saved || saved.date !== todayKey()) {
      // Create new day with default sleep schedule
      const bed = lastNightDefaultBed();
      const wake = defaultWakeFromBed(bed.toISOString());
      
      const newDay = {
        date: todayKey(),
        activities: [],
        foods: [],
        bedtimeISO: bed.toISOString(),
        waketimeISO: wake.toISOString(),

      };
      
      console.log('Created new day:', newDay);
      return newDay;
    }
    
    // Ensure all required fields exist
    if (!('foods' in saved)) saved.foods = [];
    
    console.log('Returning existing day:', saved);
    return saved;
  } catch (error) {
    console.error('Error reading day:', error);
    // Fallback to default day
    const bed = lastNightDefaultBed();
    const wake = defaultWakeFromBed(bed.toISOString());
    
    const fallbackDay = {
      date: todayKey(),
      activities: [],
      foods: [],
      bedtimeISO: bed.toISOString(),
      waketimeISO: wake.toISOString(),

    };
    
    console.log('Returning fallback day:', fallbackDay);
    return fallbackDay;
  }
}

export function saveDay(day) {
  try {
    console.log('Saving day to storage:', day);
    localStorage.setItem(DAY_KEY, JSON.stringify(day));
  } catch (error) {
    console.error('Failed to save day:', error);
  }
}

// Create a new day (for reset functionality)
export function createNewDay(existingDay) {
  const newDay = {
    date: todayKey(),
    activities: [],
    foods: existingDay.foods || [],
    bedtimeISO: existingDay.bedtimeISO,
    waketimeISO: existingDay.waketimeISO,

  };
  
  console.log('Created new day from existing:', newDay);
  return newDay;
}
