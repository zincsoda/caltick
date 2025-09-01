// Food management and UI
import { elements } from './ui.js';
import { readDay, saveDay } from './storage.js';
import { fmtKcal0 } from './utils.js';

// Render the list of logged foods
export function renderFoodList() {
  const day = readDay();
  elements.foodList.innerHTML = '';
  
  const foods = day.foods || [];
  
  if (foods.length === 0) {
    const p = document.createElement('p');
    p.className = 'note';
    p.textContent = 'No foods logged yet. Add one below.';
    elements.foodList.appendChild(p);
  } else {
    foods.forEach((food, idx) => {
      const item = document.createElement('div');
      item.className = 'food';
      
      const left = document.createElement('div');
      const title = document.createElement('div');
      const name = food.name && food.name.trim() ? food.name.trim() : 'Food';
      title.textContent = `${name} — ${Math.round(food.calories)} kcal`;
      
      const meta = document.createElement('div');
      meta.className = 'meta';
      const when = new Date(food.ts);
      meta.textContent = `Logged at ${when.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
      
      left.appendChild(title);
      left.appendChild(meta);

      const remove = document.createElement('button');
      remove.className = 'remove';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => {
        const d = readDay();
        d.foods.splice(idx, 1);
        saveDay(d);
        renderFoodList();
        updateDeficit();
      });

      item.appendChild(left);
      item.appendChild(remove);
      elements.foodList.appendChild(item);
    });
  }
  
  updateDeficit();
}

// Add a new food item
export function addFood() {
  const name = (elements.foodName.value || '').trim();
  const kcal = Math.round(+elements.foodCalories.value);
  
  if (!Number.isFinite(kcal) || kcal <= 0) {
    alert('Please enter a valid calorie amount (> 0).');
    return;
  }
  
  const day = readDay();
  if (!Array.isArray(day.foods)) day.foods = [];
  
  day.foods.push({
    name,
    calories: kcal,
    ts: Date.now()
  });
  
  saveDay(day);

  // Clear form and refresh
  elements.foodName.value = '';
  elements.foodCalories.value = '';
  renderFoodList();
}

// Reset all foods for the day
export function resetFood() {
  if (!confirm('Clear all logged foods for today?')) {
    return;
  }
  
  const d = readDay();
  d.foods = [];
  saveDay(d);
  renderFoodList();
}

// Get total calories from foods
export function getFoodCalories() {
  const d = readDay();
  return (d.foods || []).reduce((s, f) => s + (f.calories || 0), 0);
}

// Update deficit display
export function updateDeficit() {
  const totalEat = getFoodCalories();
  elements.totalFood.textContent = fmtKcal0(totalEat);
  elements.foodCount.textContent = `Items: ${(readDay().foods || []).length}`;
  
  // Get current burn total from global state
  const burn = window.totals?.total || 0;
  const net = burn - totalEat;
  paintNet(net);
}

// Update deficit live (called every frame)
export function updateDeficitLive() {
  const totalEat = getFoodCalories();
  const burn = window.totals?.total || 0;
  const net = burn - totalEat;
  paintNet(net);
}

// Paint the net deficit with appropriate styling
function paintNet(net) {
  const rounded = Math.round(net);
  elements.netDeficit.textContent = `${rounded.toLocaleString(undefined)} kcal`;
  
  if (net >= 0) {
    elements.netDeficit.classList.remove('deficit-negative');
    elements.netDeficit.classList.add('deficit-positive');
    elements.netHint.textContent = 'Positive = deficit, Negative = surplus';
  } else {
    elements.netDeficit.classList.remove('deficit-positive');
    elements.netDeficit.classList.add('deficit-negative');
    elements.netHint.textContent = 'You are in a surplus. Positive = deficit, Negative = surplus';
  }
}
