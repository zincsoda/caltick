# Calorie Ticker Webapp

A modular, refactored calorie tracking web application that calculates calorie burn based on sleep/wake cycles, activities, and food intake.

## Features

- **Real-time calorie tracking** with live ticker updates
- **Sleep cycle integration** - tracks calories burned during sleep vs. awake periods
- **Activity logging** with MET-based calorie calculations
- **Food intake tracking** with net deficit/surplus calculations
- **Responsive design** with modern UI
- **Local storage** for data persistence
- **Modular architecture** for maintainability

## Project Structure

```
caltick/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── js/                 # JavaScript modules
│   ├── config.js       # Configuration constants and defaults
│   ├── formDefaults.js # Form default value loader
│   ├── utils.js        # Utility functions and helpers
│   ├── calculations.js # Calorie and RMR calculations
│   ├── storage.js      # Local storage management
│   ├── ui.js          # UI management and DOM manipulation
│   ├── activities.js   # Activity logging and management
│   ├── foods.js        # Food logging and management
│   ├── ticker.js       # Live ticker functionality
│   └── main.js         # Main application coordination
└── README.md           # This file
```

## Module Descriptions

### `config.js`
- Default user settings (age: 44, sex: male, height: 178cm, weight: 102kg)
- Activity factor presets (Sedentary, Lightly Active, etc.)
- MET values for different activities
- Storage keys and default sleep schedule (10:30 PM - 6:30 AM)

### `formDefaults.js`
- Loads default values from config into HTML form elements
- Dynamically populates activity factor dropdown
- Ensures consistency between config and UI

### `utils.js`
- DOM element selection helper (`$`)
- Unit conversion functions (kg/lb, cm/in)
- Date formatting and manipulation
- Math utilities (clamp, formatting)

### `calculations.js`
- RMR calculation using Mifflin-St Jeor equation
- Activity calorie calculations
- Background calorie rate calculations
- Sleep/awake period calculations

### `storage.js`
- Local storage for user profile
- Daily data persistence
- Data validation and fallbacks

### `ui.js`
- Centralized DOM element references
- UI population functions
- Form validation
- Error state management

### `activities.js`
- Activity logging and management
- Activity list rendering
- MET value auto-filling
- Activity reset functionality

### `foods.js`
- Food logging and management
- Food list rendering
- Calorie deficit calculations
- Food reset functionality

### `ticker.js`
- Live calorie calculation engine
- Real-time UI updates
- Progress bar management
- Daily prediction calculations

### `main.js`
- Application initialization
- Event listener setup
- Module coordination
- Profile saving

## Default Configuration

The app comes pre-configured with:
- **Age**: 44
- **Sex**: Male
- **Height**: 178 cm
- **Weight**: 102 kg
- **Activity Level**: Sedentary (1.2)
- **Bedtime**: 10:30 PM
- **Wake Time**: 6:30 AM
- **Next Sleep**: Automatically calculated as 24 hours from bedtime

## Usage

1. Open `index.html` in a modern web browser
2. The app will load with your saved profile or default settings
3. Adjust sleep times if needed
4. Log activities and foods throughout the day
5. Monitor real-time calorie burn and deficit

## Technical Details

- **ES6 Modules**: Uses modern JavaScript module system
- **Local Storage**: All data stored locally in browser
- **Real-time Updates**: Uses `requestAnimationFrame` for smooth ticker
- **Responsive Design**: CSS Grid and Flexbox for layout
- **No Dependencies**: Pure vanilla JavaScript, HTML, and CSS

## Browser Compatibility

- Modern browsers with ES6 module support
- Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+

## Customizing Defaults

To change the default values:
1. Edit `js/config.js` to modify `DEFAULT_USER` object
2. Update `ACTIVITY_FACTOR_PRESETS` if you want different activity levels
3. The form will automatically load these new defaults on next page load
4. No need to modify HTML - all values are loaded dynamically

## Development

To modify the app:
1. Edit the appropriate module file
2. Update configuration in `config.js` if needed
3. Test changes in browser
4. All modules are automatically imported and coordinated by `main.js`
