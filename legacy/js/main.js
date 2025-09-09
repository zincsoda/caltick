// Main application module - coordinates all other modules
import { DEFAULT_USER } from './config.js';
import { readProfile, saveProfile, readDay, saveDay, createNewDay } from './storage.js';
import { populateProfileUI, populateSleepUI, onActivityTypeChange } from './ui.js';
import { renderActivityList, addActivity, resetActivities } from './activities.js';
import { renderFoodList, addFood, resetFood } from './foods.js';
import { startTicker, restartTickerWithRecalc } from './ticker.js';
import { elements } from './ui.js';
import { todayKey, lastNightDefaultBed, defaultWakeFromBed } from './utils.js';
import { initializeFormDefaults, populateActivityFactorDropdown } from './formDefaults.js';

// Initialize the application
function init() {
  console.log('Initializing application...');
  
  try {
    // Load saved profile or use defaults
    const profile = readProfile();
    console.log('Loaded profile:', profile);
    console.log('About to populate profile UI...');
    populateProfileUI(profile);
    console.log('Profile UI populated');
    
    // Initialize activity factor dropdown
    console.log('About to initialize activity factor dropdown...');
    populateActivityFactorDropdown();
    console.log('Activity factor dropdown initialized');
    
    // Fallback: Direct DOM manipulation if module approach fails
    console.log('Setting fallback values...');
    const ageEl = document.getElementById('age');
    const sexEl = document.getElementById('sex');
    const heightEl = document.getElementById('height');
    const weightEl = document.getElementById('weight');
    
    if (ageEl) {
      ageEl.value = profile.age;
      console.log('Fallback: Set age to', ageEl.value);
    }
    if (sexEl) {
      sexEl.value = profile.sex;
      console.log('Fallback: Set sex to', sexEl.value);
    }
    if (heightEl) {
      heightEl.value = profile.height;
      console.log('Fallback: Set height to', heightEl.value);
    }
    if (weightEl) {
      weightEl.value = profile.weight;
      console.log('Fallback: Set weight to', weightEl.value);
    }

    // Load saved day or create new one
    const day = readDay();
    console.log('Loaded day:', day);
    
    if (!day.bedtimeISO) day.bedtimeISO = lastNightDefaultBed().toISOString();
    if (!day.waketimeISO) day.waketimeISO = defaultWakeFromBed(day.bedtimeISO).toISOString();
    if (!Array.isArray(day.foods)) day.foods = [];
    
    saveDay(day);
    populateSleepUI(day.bedtimeISO, day.waketimeISO);

    // Initialize UI
    onActivityTypeChange();
    renderActivityList();
    renderFoodList();
    
    console.log('Initialization complete!');
    
    // Defer ticker start to avoid potential issues
    setTimeout(() => {
      console.log('Starting ticker...');
      restartTickerWithRecalc();
      console.log('Application initialized successfully!');
    }, 100);
    
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}

// Set up event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  try {
    // Profile change events
    ['input', 'change'].forEach(evt => {
      elements.age.addEventListener(evt, () => { 
        saveCurrentProfile(); 
        restartTickerWithRecalc(); 
      });
      elements.sex.addEventListener(evt, () => { 
        saveCurrentProfile(); 
        restartTickerWithRecalc(); 
      });
      elements.height.addEventListener(evt, () => { 
        saveCurrentProfile(); 
        restartTickerWithRecalc(); 
      });
      elements.weight.addEventListener(evt, () => { 
        saveCurrentProfile(); 
        restartTickerWithRecalc(); 
      });
      elements.heightUnit.addEventListener(evt, () => { 
        saveCurrentProfile(); 
        restartTickerWithRecalc(); 
      });
      elements.weightUnit.addEventListener(evt, () => { 
        saveCurrentProfile(); 
        restartTickerWithRecalc(); 
      });
      elements.activityFactor.addEventListener(evt, () => { 
        saveCurrentProfile(); 
        restartTickerWithRecalc(); 
      });
      elements.sleepFactor.addEventListener(evt, () => { 
        saveCurrentProfile(); 
        restartTickerWithRecalc(); 
      });
          elements.includeRMR.addEventListener(evt, () => { 
      saveCurrentProfile(); 
      restartTickerWithRecalc(); 
    });

      // Activity type change
      elements.activityType.addEventListener(evt, onActivityTypeChange);
      
      // Sleep time changes
      elements.bedtime.addEventListener(evt, restartTickerWithRecalc);
      elements.waketime.addEventListener(evt, restartTickerWithRecalc);
    });

    // Button event listeners
    elements.addActivityBtn.addEventListener('click', addActivity);
    elements.resetDayBtn.addEventListener('click', resetActivities);
    elements.addFoodBtn.addEventListener('click', addFood);
    elements.resetFoodBtn.addEventListener('click', resetFood);

    // Visibility change handling
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        restartTickerWithRecalc();
      }
    });

    // Midnight rollover check
    setInterval(() => {
      const d = readDay();
      const key = todayKey();
      if (d.date !== key) {
        const newDay = createNewDay(d);
        saveDay(newDay);
        renderActivityList();
        renderFoodList();
        restartTickerWithRecalc();
      }
    }, 120000); // Check every 2 minutes
    
    console.log('Event listeners set up successfully!');
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }
}

// Save profile when form changes
function saveCurrentProfile() {
  try {
    const profile = {
      age: +elements.age.value,
      sex: elements.sex.value,
      height: +elements.height.value,
      weight: +elements.weight.value,
      heightUnit: elements.heightUnit.value,
      weightUnit: elements.weightUnit.value,
      activityFactor: +elements.activityFactor.value,
      sleepFactor: +elements.sleepFactor.value,
      includeRMR: elements.includeRMR.value,

    };
    
    saveProfile(profile);
    console.log('Profile saved:', profile);
  } catch (error) {
    console.error('Error saving profile:', error);
  }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting application...');
  console.log('Available elements check:');
  console.log('Age element exists:', !!document.getElementById('age'));
  console.log('Sex element exists:', !!document.getElementById('sex'));
  console.log('Height element exists:', !!document.getElementById('height'));
  console.log('Weight element exists:', !!document.getElementById('weight'));
  
  // Set default values immediately
  console.log('Setting default values immediately...');
  document.getElementById('age').value = 44;
  document.getElementById('sex').value = 'male';
  document.getElementById('height').value = 178;
  document.getElementById('weight').value = 102;
  document.getElementById('sleepFactor').value = 0.95;
  
  // Populate activity factor dropdown
  const activitySelect = document.getElementById('activityFactor');
  activitySelect.innerHTML = `
    <option value="1.2">Sedentary (1.2) - Little or no exercise, desk job</option>
    <option value="1.375">Lightly Active (1.375) - Light exercise/sports 1-3 days/week</option>
    <option value="1.55">Moderately Active (1.55) - Moderate exercise/sports 3-5 days/week</option>
    <option value="1.725">Very Active (1.725) - Hard exercise/sports 6-7 days a week</option>
    <option value="1.9">Extremely Active (1.9) - Very hard exercise, physical job</option>
  `;
  activitySelect.value = 1.2;
  
  console.log('Default values set directly');
  console.log('Age:', document.getElementById('age').value);
  console.log('Sex:', document.getElementById('sex').value);
  console.log('Height:', document.getElementById('height').value);
  console.log('Weight:', document.getElementById('weight').value);
  
  // Add a small delay to ensure all elements are fully rendered
  setTimeout(() => {
    console.log('Starting initialization after delay...');
    init();
    setupEventListeners();
  }, 50);
});

