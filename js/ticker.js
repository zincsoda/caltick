// Live ticker for calorie calculations and display updates
import { elements } from './ui.js';
import { readDay, saveDay } from './storage.js';
import { calcRMR_MSJ, calcCalorieRates, calcBackgroundCalories } from './calculations.js';
import { toKg, toCm, clamp, fmtKcal2, fmtH, fmtKcal0 } from './utils.js';
import { validateSleepWindow, setUIInvalid } from './ui.js';
import { getActivityCalories } from './activities.js';
import { updateDeficitLive, getFoodCalories } from './foods.js';

// Global state for live calculations
export let rafId = null;
export let lastNow = null;
export let totals = { activity: 0, background: 0, total: 0, sleepBg: 0, awakeBg: 0 };
export let rates = { currentPerSec: 0, sleepPerSec: 0, awakePerSec: 0 };

// Make totals globally accessible for other modules
window.totals = totals;

// Compute a snapshot of current calorie burn
export function computeSnapshot() {
  // Get current profile from UI
  const profile = {
    age: clamp(+elements.age.value, 10, 100),
    sex: elements.sex.value === 'female' ? 'female' : 'male',
    heightCm: clamp(toCm(+elements.height.value, elements.heightUnit.value), 120, 230),
    weightKg: clamp(toKg(+elements.weight.value, elements.weightUnit.value), 35, 300),
    activityFactor: +elements.activityFactor.value,
    sleepFactor: +elements.sleepFactor.value,
    includeRMR: elements.includeRMR.value
  };

  // Sync times and read day
  const day = readDay();
  const uiBed = new Date(elements.bedtime.value);
  const uiWake = new Date(elements.waketime.value);
  
  if (!Number.isNaN(uiBed.getTime())) day.bedtimeISO = uiBed.toISOString();
  if (!Number.isNaN(uiWake.getTime())) day.waketimeISO = uiWake.toISOString();
  
  saveDay(day);
  
  if (!validateSleepWindow(day.bedtimeISO, day.waketimeISO)) {
    setUIInvalid();
    return;
  }

  // Calculate RMR and rates
  const rmr = calcRMR_MSJ({
    sex: profile.sex,
    age: profile.age,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg
  });
  
  const { sleepPerSec, awakePerSec } = calcCalorieRates(
    rmr, 
    profile.sleepFactor, 
    profile.activityFactor, 
    profile.includeRMR
  );

  const now = Date.now();
  const bedTs = new Date(day.bedtimeISO).getTime();
  const wakeTs = new Date(day.waketimeISO).getTime();

  // Calculate background calories
  const bgCalories = calcBackgroundCalories(sleepPerSec, awakePerSec, bedTs, wakeTs, now);
  
  // Get activity calories
  const activityTotal = getActivityCalories();

  // Update totals
  totals.activity = activityTotal;
  totals.sleepBg = bgCalories.sleepBg;
  totals.awakeBg = bgCalories.awakeBg;
  totals.background = bgCalories.total;
  totals.total = totals.background + totals.activity;

  // Update rates
  rates.sleepPerSec = sleepPerSec;
  rates.awakePerSec = awakePerSec;
  rates.currentPerSec = (now >= wakeTs) ? awakePerSec : sleepPerSec;

  // Update UI
  updateBurnUI(bgCalories, sleepPerSec, awakePerSec, activityTotal);
  updateProgressAndDailyPrediction(day, rmr, profile);
}

// Update burn-related UI elements
function updateBurnUI(bgCalories, sleepPerSec, awakePerSec, activityTotal) {
  elements.bgBreakdown.textContent = `Sleep: ${fmtKcal2(bgCalories.sleepBg)} • Awake: ${fmtKcal2(bgCalories.awakeBg)}`;
  elements.sleepRate.textContent = `Sleep rate: +${sleepPerSec.toFixed(4)} kcal/s`;
  elements.awakeRate.textContent = `Awake rate: +${awakePerSec.toFixed(4)} kcal/s`;

  elements.activityCalories.textContent = fmtKcal2(activityTotal);
  elements.activityRate.textContent = `Rate: +0.0000 kcal/s (logged totals)`;

  elements.totalCalories.textContent = fmtKcal2(totals.total);
  elements.totalRate.textContent = `Rate: +${rates.currentPerSec.toFixed(4)} kcal/s`;
}

// Update progress bar and daily prediction
function updateProgressAndDailyPrediction(day, rmr, profile) {
  // Progress bar - next sleep is 24 hours from bedtime
  const bedTs = new Date(day.bedtimeISO).getTime();
  const wakeTs = new Date(day.waketimeISO).getTime();
  const now = Date.now();
  const nextSleepTs = bedTs + 24 * 3600_000; // 24 hours from bedtime
  const totalAwakeHrs = (nextSleepTs - wakeTs) / 3600_000;
  const elapsedAwakeHrs = Math.max(0, (now - wakeTs) / 3600_000);
  const pct = Math.max(0, Math.min(100, (elapsedAwakeHrs / totalAwakeHrs) * 100));
  
  elements.progressFill.style.width = pct + '%';
  elements.progressLabelLeft.textContent = `Since wake: ${fmtH(elapsedAwakeHrs)}`;
  elements.progressLabelRight.textContent = `Next sleep: ${fmtH(totalAwakeHrs)}`;

  const remainingHrs = Math.max(0, totalAwakeHrs - elapsedAwakeHrs);
  const eta = new Date(nextSleepTs);
  const etaStr = eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  elements.nextSleepSummary.textContent = (remainingHrs > 0) 
    ? `${fmtH(remainingHrs)} left • ~${etaStr}` 
    : `Time for sleep!`;

  // Sleep progress
  const progressPct = Math.round(pct);
  elements.sleepProgress.textContent = `${progressPct}% complete`;

  // Predicted daily burn (24h from bedtime)
  const dailyEndTs = bedTs + 24 * 3600_000;
  const wakeTsClamped = Math.min(Math.max(wakeTs, bedTs), dailyEndTs);

  const sleepHours = (wakeTsClamped - bedTs) / 3600_000;
  const awakeHours = 24 - sleepHours;

  const sleepDaily = profile.includeRMR === 'yes' 
    ? rmr * profile.sleepFactor * (sleepHours / 24) 
    : 0;
  const awakeDaily = profile.includeRMR === 'yes' 
    ? rmr * profile.activityFactor * (awakeHours / 24) 
    : 0;

  const predictedDailyTotal = sleepDaily + awakeDaily + totals.activity;
  elements.predictedDaily.textContent = fmtKcal0(predictedDailyTotal);

  // Projected daily deficit (predicted burn - food intake)
  const totalFood = getFoodCalories();
  const projectedDeficit = predictedDailyTotal - totalFood;
  elements.projectedDeficit.textContent = fmtKcal0(projectedDeficit);
  
  // Color code the projected deficit
  if (projectedDeficit >= 0) {
    elements.projectedDeficit.classList.remove('deficit-negative');
    elements.projectedDeficit.classList.add('deficit-positive');
    elements.projectedHint.textContent = 'Projected deficit (burn - food)';
  } else {
    elements.projectedDeficit.classList.remove('deficit-positive');
    elements.projectedDeficit.classList.add('deficit-negative');
    elements.projectedHint.textContent = 'Projected surplus (food > burn)';
  }

  // Calculate estimated fat burned (1 gram of fat = 9 calories)
  const fatBurnedGrams = projectedDeficit > 0 ? projectedDeficit / 9 : 0;
  elements.fatBurned.textContent = fatBurnedGrams.toFixed(1) + ' g';
  
  // Update fat hint and styling based on whether there's a deficit
  if (projectedDeficit > 0) {
    elements.fatHint.textContent = 'From calorie deficit';
    elements.fatBurned.classList.add('fat-burned');
    elements.fatBurned.classList.remove('deficit-negative');
  } else {
    elements.fatHint.textContent = 'No deficit (surplus)';
    elements.fatBurned.classList.remove('fat-burned');
    elements.fatBurned.classList.add('deficit-negative');
  }
}

// Start the live ticker
export function startTicker() {
  if (rafId) cancelAnimationFrame(rafId);
  lastNow = performance.now();

  const tick = (now) => {
    const dt = Math.max(0, (now - lastNow) / 1000);
    lastNow = now;

    const day = readDay();
    const wakeTs = new Date(day.waketimeISO).getTime();
    const nowWall = Date.now();

    const inAwake = nowWall >= wakeTs;
    const phaseRate = inAwake ? rates.awakePerSec : rates.sleepPerSec;

    if (inAwake) totals.awakeBg += phaseRate * dt;
    else totals.sleepBg += phaseRate * dt;

    totals.background += phaseRate * dt;
    totals.total = totals.background + totals.activity;
    rates.currentPerSec = phaseRate;

    // Update live display
    elements.totalCalories.textContent = fmtKcal2(totals.total);
    elements.totalRate.textContent = `Rate: +${phaseRate.toFixed(4)} kcal/s`;
    elements.bgBreakdown.textContent = `Sleep: ${fmtKcal2(totals.sleepBg)} • Awake: ${fmtKcal2(totals.awakeBg)}`;

    // Update deficit live
    updateDeficitLive();

    // Re-sync about once a second
    if (Math.floor(now / 1000) !== Math.floor((now - 16.67) / 1000)) {
      computeSnapshot();
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
}

// Restart ticker with recalculation
export function restartTickerWithRecalc() {
  computeSnapshot();
  startTicker();
}

// Make restart function globally accessible
window.restartTickerWithRecalc = restartTickerWithRecalc;
