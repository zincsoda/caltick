import './App.css'
import { DEFAULT_USER } from './lib/config.js'
import { readProfile, readDay } from './lib/storage.js'
import Profile from './components/Profile.jsx'
import Sleep from './components/Sleep.jsx'
import Activities from './components/Activities.jsx'
import Foods from './components/Foods.jsx'
import Ticker from './components/Ticker.jsx'
import Metrics from './components/Metrics.jsx'

function App() {
  const profile = readProfile() || DEFAULT_USER
  const day = readDay()

  const weightKg = profile.weightUnit === 'kg' ? profile.weight : profile.weight * 0.45359237
  const activitiesTotal = (day.activities || []).reduce((s, a) => s + (a.met * weightKg * (a.minutes / 60)), 0)
  const foodsTotal = (day.foods || []).reduce((s, f) => s + Number(f.calories || 0), 0)

  return (
    <div className="wrap single-column">
      <header>
        <div className="brand">
          <div className="logo" />
          <h1>Calorie Ticker</h1>
        </div>
      </header>
      <Metrics profile={profile} day={day} activityCalories={activitiesTotal} foodCalories={foodsTotal} />
      <Activities weightKg={weightKg} onChange={() => {}} />
      <Foods onChange={() => {}} />
      <Profile onChange={() => {}} />
      <Sleep onChange={() => {}} />
      <Ticker profile={profile} day={day} activityCalories={activitiesTotal} foodCalories={foodsTotal} />
      <div className="footer">React version – persisted locally</div>
    </div>
  )
}

export default App
