# Calorie Ticker Webapp

A modern React-based calorie tracking web application that calculates calorie burn based on sleep/wake cycles, activities, and food intake.

## Features

- **Real-time calorie tracking** with live ticker updates
- **Sleep cycle integration** - tracks calories burned during sleep vs. awake periods
- **Activity logging** with MET-based calorie calculations
- **Food intake tracking** with net deficit/surplus calculations
- **Responsive design** with modern React UI
- **Local storage** for data persistence
- **Component-based architecture** for maintainability

## Project Structure

```
caltick/
├── react-app/              # Main React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Activities.jsx
│   │   │   ├── Foods.jsx
│   │   │   ├── Metrics.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Sleep.jsx
│   │   │   └── Ticker.jsx
│   │   ├── lib/           # Shared utilities and logic
│   │   │   ├── calculations.js
│   │   │   ├── config.js
│   │   │   ├── storage.js
│   │   │   └── utils.js
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Application entry point
│   ├── package.json       # Dependencies and scripts
│   └── vite.config.js     # Vite configuration
├── legacy/                # Original vanilla JS version
│   ├── index.html
│   ├── styles.css
│   └── js/               # Original JavaScript modules
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the React app directory:
   ```bash
   cd react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## React Components

### `App.jsx`
- Main application component that coordinates all other components
- Manages state and data flow between components
- Handles profile and daily data loading

### `Ticker.jsx`
- Real-time calorie burn display
- Live updates showing current calorie burn rate
- Progress tracking and daily predictions

### `Metrics.jsx`
- Displays key metrics and statistics
- Shows activity calories, food calories, and net deficit/surplus
- Provides visual feedback on daily progress

### `Activities.jsx`
- Activity logging and management
- MET-based calorie calculations
- Activity history and reset functionality

### `Foods.jsx`
- Food intake tracking
- Calorie logging and management
- Food history and reset functionality

### `Profile.jsx`
- User profile management
- Personal information and settings
- Activity level configuration

### `Sleep.jsx`
- Sleep schedule configuration
- Bedtime and wake time settings
- Sleep cycle integration

## Shared Libraries

### `lib/config.js`
- Default user settings and configuration
- Activity factor presets and MET values
- Application constants

### `lib/calculations.js`
- RMR calculation using Mifflin-St Jeor equation
- Activity and background calorie calculations
- Sleep/awake period calculations

### `lib/storage.js`
- Local storage management
- Profile and daily data persistence
- Data validation and fallbacks

### `lib/utils.js`
- Utility functions and helpers
- Unit conversion functions
- Date formatting and math utilities

## Default Configuration

The app comes pre-configured with:
- **Age**: 44
- **Sex**: Male
- **Height**: 178 cm
- **Weight**: 102 kg
- **Activity Level**: Sedentary (1.2)
- **Bedtime**: 10:30 PM
- **Wake Time**: 6:30 AM

## Usage

1. The app loads with your saved profile or default settings
2. Adjust your profile information if needed
3. Set your sleep schedule
4. Log activities and foods throughout the day
5. Monitor real-time calorie burn and deficit via the ticker

## Technical Details

- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **ES6 Modules**: Modern JavaScript module system
- **Local Storage**: All data stored locally in browser
- **Real-time Updates**: Smooth ticker updates using React state
- **Responsive Design**: CSS Grid and Flexbox for layout
- **ESLint**: Code linting and formatting

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Customizing Defaults

To change the default values:
1. Edit `src/lib/config.js` to modify the `DEFAULT_USER` object
2. Update activity factor presets if needed
3. The app will automatically use these new defaults

## Legacy Version

The original vanilla JavaScript version is preserved in the `legacy/` directory for reference. The React version maintains the same core functionality while providing a more maintainable and modern codebase.

## Browser Compatibility

- Modern browsers with ES6 module support
- Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+
