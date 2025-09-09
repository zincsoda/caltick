// Form defaults loader - populates HTML form elements with config values
import { DEFAULT_USER, ACTIVITY_FACTOR_PRESETS } from './config.js';
import { elements } from './ui.js';

// Populate form elements with default values from config
export function loadFormDefaults() {
  console.log('Loading form defaults from config...');
  console.log('DEFAULT_USER:', DEFAULT_USER);
  
  try {
    // Check if elements exist
    console.log('Age element:', elements.age);
    console.log('Sex element:', elements.sex);
    
    // Set profile values
    if (elements.age) elements.age.value = DEFAULT_USER.age;
    if (elements.sex) elements.sex.value = DEFAULT_USER.sex;
    if (elements.height) elements.height.value = DEFAULT_USER.height;
    if (elements.weight) elements.weight.value = DEFAULT_USER.weight;
    if (elements.heightUnit) elements.heightUnit.value = DEFAULT_USER.heightUnit;
    if (elements.weightUnit) elements.weightUnit.value = DEFAULT_USER.weightUnit;
    if (elements.activityFactor) elements.activityFactor.value = DEFAULT_USER.activityFactor;
    if (elements.sleepFactor) elements.sleepFactor.value = DEFAULT_USER.sleepFactor;
    if (elements.includeRMR) elements.includeRMR.value = DEFAULT_USER.includeRMR;

    
    console.log('Form defaults loaded successfully');
    console.log('Age value after setting:', elements.age?.value);
    console.log('Sex value after setting:', elements.sex?.value);
  } catch (error) {
    console.error('Error loading form defaults:', error);
  }
}

// Populate activity factor dropdown with presets
export function populateActivityFactorDropdown() {
  console.log('Populating activity factor dropdown...');
  
  try {
    const select = elements.activityFactor;
    
    // Clear existing options
    select.innerHTML = '';
    
    // Add options from presets
    ACTIVITY_FACTOR_PRESETS.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.value;
      option.textContent = preset.label;
      option.title = preset.description;
      select.appendChild(option);
    });
    
    // Set default value
    select.value = DEFAULT_USER.activityFactor;
    
    console.log('Activity factor dropdown populated');
  } catch (error) {
    console.error('Error populating activity factor dropdown:', error);
  }
}

// Initialize all form defaults
export function initializeFormDefaults() {
  console.log('Initializing all form defaults...');
  loadFormDefaults();
  populateActivityFactorDropdown();
  console.log('All form defaults initialized');
}
