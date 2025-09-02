// Calorie and RMR calculation functions

// Calculate Resting Metabolic Rate using Mifflin-St Jeor equation
export function calcRMR_MSJ({sex, age, heightCm, weightKg}) {
  return sex === 'female'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    : 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
}

// Calculate calories burned from activity
export function calcActivityCalories(weightKg, met, durationMinutes) {
  return met * weightKg * (durationMinutes / 60);
}

// Calculate sleep and awake calorie rates
export function calcCalorieRates(rmr, sleepFactor, activityFactor, includeRMR) {
  if (includeRMR !== 'yes') {
    return { sleepPerSec: 0, awakePerSec: 0 };
  }
  const sleepPerSec = (rmr * sleepFactor) / 86400; // 24 hours in seconds
  const awakePerSec = (rmr * activityFactor) / 86400;
  return { sleepPerSec, awakePerSec };
}

// Calculate background calories for sleep and awake periods
export function calcBackgroundCalories(sleepPerSec, awakePerSec, bedTs, wakeTs, now) {
  const sleepElapsedSec = Math.max(0, Math.min(now, wakeTs) - bedTs) / 1000;
  const awakeElapsedSec = now > wakeTs ? (now - wakeTs) / 1000 : 0;
  const sleepBg = sleepElapsedSec * sleepPerSec;
  const awakeBg = awakeElapsedSec * awakePerSec;
  return { sleepBg, awakeBg, total: sleepBg + awakeBg };
}


