// Activity management and UI
import { elements } from './ui.js';
import { readDay, saveDay } from './storage.js';
import { calcActivityCalories } from './calculations.js';
import { toKg, clamp } from './utils.js';
import { fmtKcal2 } from './utils.js';

// Render the list of logged activities
export function renderActivityList() {
  const day = readDay();
  elements.activityList.innerHTML = '';
  
  if (day.activities.length === 0) {
    const p = document.createElement('p');
    p.className = 'note';
    p.textContent = 'No activities logged yet. Add one below.';
    elements.activityList.appendChild(p);
  } else {
    day.activities.forEach((activity, idx) => {
      const item = document.createElement('div');
      item.className = 'activity';
      
      const left = document.createElement('div');
      const title = document.createElement('div');
      title.textContent = `${activity.name} — ${Math.round(activity.calories)} kcal`;
      
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.textContent = `${activity.durationMin} min • MET ${activity.met}`;
      
      left.appendChild(title);
      left.appendChild(meta);

      const remove = document.createElement('button');
      remove.className = 'remove';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => {
        const d = readDay();
        d.activities.splice(idx, 1);
        saveDay(d);
        renderActivityList();
        // Trigger recalculation
        if (window.restartTickerWithRecalc) {
          window.restartTickerWithRecalc();
        }
      });

      item.appendChild(left);
      item.appendChild(remove);
      elements.activityList.appendChild(item);
    });
  }
}

// Add a new activity
export function addActivity() {
  const type = elements.activityType.value;
  const name = type === 'custom' ? 'Custom' : type[0].toUpperCase() + type.slice(1);
  const metVal = +elements.met.value;
  const durVal = +elements.duration.value;
  const durMin = elements.durationUnit.value === 'hr' ? durVal * 60 : durVal;

  // Validation
  if (!metVal || metVal < 1) {
    alert('Please enter a valid MET value (>= 1).');
    return;
  }
  if (!durMin || durMin <= 0) {
    alert('Please enter a valid duration.');
    return;
  }

  // Get current profile for weight calculation
  const profile = readProfile();
  const weightKg = clamp(
    toKg(+elements.weight.value || profile.weight, elements.weightUnit.value || profile.weightUnit), 
    35, 
    300
  );
  
  const kcal = calcActivityCalories(weightKg, metVal, durMin);

  // Save activity
  const day = readDay();
  day.activities.push({
    name,
    met: +metVal.toFixed(1),
    durationMin: Math.round(durMin),
    calories: Math.round(kcal)
  });
  saveDay(day);

  // Clear form and refresh
  elements.duration.value = '';
  renderActivityList();
  
  // Trigger recalculation
  if (window.restartTickerWithRecalc) {
    window.restartTickerWithRecalc();
  }
}

// Reset activities for the day
export function resetActivities() {
  if (!confirm('Reset today\'s logged activities? This cannot be undone.')) {
    return;
  }
  
  const d = readDay();
  const newDay = {
    date: d.date,
    activities: [],
    foods: d.foods || [],
    bedtimeISO: d.bedtimeISO,
    waketimeISO: d.waketimeISO,

  };
  
  saveDay(newDay);
  renderActivityList();
  
  // Trigger recalculation
  if (window.restartTickerWithRecalc) {
    window.restartTickerWithRecalc();
  }
}

// Get total calories from activities
export function getActivityCalories() {
  const day = readDay();
  return day.activities.reduce((sum, a) => sum + a.calories, 0);
}

// Import readProfile for weight calculation
import { readProfile } from './storage.js';
