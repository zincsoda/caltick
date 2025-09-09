// Configuration constants and default values
export const DEFAULT_USER = {
  age: 44,
  sex: 'male',
  height: 178,
  weight: 102,
  heightUnit: 'cm',
  weightUnit: 'kg',
  activityFactor: 1.2, // Sedentary
  sleepFactor: 0.95,
  includeRMR: 'yes',
  // No goal awake hours - next sleep is always 24 hours from bedtime
};

// Activity factor presets with descriptions
export const ACTIVITY_FACTOR_PRESETS = [
  { value: 1.2, label: 'Sedentary (1.2)', description: 'Little or no exercise, desk job' },
  { value: 1.375, label: 'Lightly Active (1.375)', description: 'Light exercise/sports 1-3 days/week' },
  { value: 1.55, label: 'Moderately Active (1.55)', description: 'Moderate exercise/sports 3-5 days/week' },
  { value: 1.725, label: 'Very Active (1.725)', description: 'Hard exercise/sports 6-7 days a week' },
  { value: 1.9, label: 'Extremely Active (1.9)', description: 'Very hard exercise, physical job' }
];

// MET values for different activities
export const METS = {
  walking: 3.5,
  running: 9.8,
  cycling: 7.5,
  strength: 6.0,
  hiit: 10.0,
  swimming: 6.0,
  yoga: 3.0
};

// Storage keys
export const PROFILE_KEY = 'cb_profile_v6_food';
export const DAY_KEY = 'cb_day_sleepwake_v3_food';

// Default sleep schedule (10:30 PM to 6:30 AM)
export const DEFAULT_BEDTIME_HOUR = 22; // 10 PM
export const DEFAULT_BEDTIME_MINUTE = 30;
export const DEFAULT_WAKETIME_HOUR = 6; // 6 AM
export const DEFAULT_WAKETIME_MINUTE = 30;
export const DEFAULT_SLEEP_DURATION_HOURS = 7.5; // 7.5 hours
