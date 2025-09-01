// UI management and DOM manipulation
import { $ } from './utils.js';

// DOM element references - lazy-loaded to ensure DOM is ready
export const elements = {
  // Profile inputs
  get age() { return $('age'); },
  get sex() { return $('sex'); },
  get height() { return $('height'); },
  get weight() { return $('weight'); },
  get heightUnit() { return $('heightUnit'); },
  get weightUnit() { return $('weightUnit'); },
  get activityFactor() { return $('activityFactor'); },
  get sleepFactor() { return $('sleepFactor'); },
  get includeRMR() { return $('includeRMR'); },

  
  // Sleep inputs
  get bedtime() { return $('bedtime'); },
  get waketime() { return $('waketime'); },
  get sleepValidation() { return $('sleepValidation'); },
  
  // Activity inputs
  get activityType() { return $('activityType'); },
  get duration() { return $('duration'); },
  get durationUnit() { return $('durationUnit'); },
  get met() { return $('met'); },
  
  // Food inputs
  get foodName() { return $('foodName'); },
  get foodCalories() { return $('foodCalories'); },
  
  // Display elements
  get totalCalories() { return $('totalCalories'); },
  get totalRate() { return $('totalRate'); },
  get activityCalories() { return $('activityCalories'); },
  get activityRate() { return $('activityRate'); },
  get bgBreakdown() { return $('bgBreakdown'); },
  get sleepRate() { return $('sleepRate'); },
  get awakeRate() { return $('awakeRate'); },
  get nextSleepSummary() { return $('nextSleepSummary'); },
      get predictedDaily() { return $('predictedDaily'); },
    get projectedDeficit() { return $('projectedDeficit'); },
    get projectedHint() { return $('projectedHint'); },
    get fatBurned() { return $('fatBurned'); },
    get fatHint() { return $('fatHint'); },
    get sleepProgress() { return $('sleepProgress'); },
  get progressFill() { return $('progressFill'); },
  get progressLabelLeft() { return $('progressLabelLeft'); },
  get progressLabelRight() { return $('progressLabelRight'); },
  get activityList() { return $('activityList'); },
  get foodList() { return $('foodList'); },
  get totalFood() { return $('totalFood'); },
  get foodCount() { return $('foodCount'); },
  get netDeficit() { return $('netDeficit'); },
  get netHint() { return $('netHint'); },
  
  // Buttons
  get addActivityBtn() { return $('addActivity'); },
  get resetDayBtn() { return $('resetDay'); },
  get addFoodBtn() { return $('addFood'); },
  get resetFoodBtn() { return $('resetFood'); }
};

// Populate profile UI with saved data
export function populateProfileUI(profile) {
  console.log('populateProfileUI called with profile:', profile);
  console.log('Age element before setting:', elements.age);
  console.log('Age element value before setting:', elements.age?.value);
  
  elements.age.value = profile.age;
  elements.sex.value = profile.sex;
  elements.height.value = profile.height;
  elements.weight.value = profile.weight;
  elements.heightUnit.value = profile.heightUnit;
  elements.weightUnit.value = profile.weightUnit;
  elements.activityFactor.value = profile.activityFactor;
  elements.sleepFactor.value = profile.sleepFactor ?? 0.95;
  elements.includeRMR.value = profile.includeRMR;

  
  console.log('Age element value after setting:', elements.age?.value);
  console.log('Sex element value after setting:', elements.sex?.value);
}

// Populate sleep UI with saved times
export function populateSleepUI(bedISO, wakeISO) {
  elements.bedtime.value = toLocalDatetimeValue(new Date(bedISO));
  elements.waketime.value = toLocalDatetimeValue(new Date(wakeISO));
}

// Handle activity type change (auto-fill MET values)
export function onActivityTypeChange() {
  const type = elements.activityType.value;
  if (type === 'custom') {
    elements.met.placeholder = 'Enter MET (e.g., 5.5)';
    elements.met.value = '';
  } else {
    const metValue = METS[type] || '';
    elements.met.value = metValue;
    elements.met.placeholder = '';
  }
  elements.met.disabled = false;
}

// Validate sleep window
export function validateSleepWindow(bedISO, wakeISO) {
  const bed = new Date(bedISO).getTime();
  const wake = new Date(elements.waketime.value || wakeISO).getTime();
  
  let msg = '', ok = true;
  
  if (Number.isNaN(bed) || Number.isNaN(wake)) {
    ok = false;
    msg = 'Please set valid bed and wake times.';
  } else if (wake <= bed) {
    ok = false;
    msg = 'Wake time must be after bedtime.';
  }
  
  elements.sleepValidation.textContent = msg;
  elements.sleepValidation.className = 'hint ' + (ok ? '' : 'error');
  
  return ok;
}

// Set UI to invalid state
export function setUIInvalid() {
  elements.totalCalories.textContent = '—';
  elements.totalRate.textContent = 'Rate: —';
  elements.activityCalories.textContent = '—';
  elements.activityRate.textContent = 'Rate: —';
  elements.bgBreakdown.textContent = 'Please fix bed/wake times';
  elements.sleepRate.textContent = 'Sleep rate: —';
  elements.awakeRate.textContent = 'Awake rate: —';
  elements.nextSleepSummary.textContent = '—';
  elements.sleepProgress.textContent = '—';
  elements.predictedDaily.textContent = '—';
  elements.projectedDeficit.textContent = '—';
  elements.fatBurned.textContent = '—';
  elements.progressFill.style.width = '0%';
  elements.progressLabelLeft.textContent = 'Since wake: —';
  elements.progressLabelRight.textContent = 'Goal awake: 7.5h';
}

// Helper function for datetime formatting
function toLocalDatetimeValue(d) {
  const pad2 = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

// Import METS for activity type change
import { METS } from './config.js';
