import { useEffect, useMemo, useRef, useState } from 'react'
import { calcBackgroundCalories, calcCalorieRates, calcRMR_MSJ } from '../lib/calculations.js'
import { toKg, toCm } from '../lib/utils.js'

export default function Ticker({ profile, day, activityCalories = 0, foodCalories = 0 }) {
  const [now, setNow] = useState(() => Date.now())
  const rafRef = useRef(0)

  const metrics = useMemo(() => {
    const weightKg = toKg(profile.weight, profile.weightUnit)
    const heightCm = toCm(profile.height, profile.heightUnit)
    const rmr = calcRMR_MSJ({ sex: profile.sex, age: profile.age, heightCm, weightKg })
    const { sleepPerSec, awakePerSec } = calcCalorieRates(rmr, profile.sleepFactor, profile.activityFactor, profile.includeRMR)
    const bedTs = new Date(day.bedtimeISO).getTime()
    const wakeTs = new Date(day.waketimeISO).getTime()
    const bg = calcBackgroundCalories(sleepPerSec, awakePerSec, bedTs, wakeTs, now)
    const net = bg.total + activityCalories - foodCalories
    return { rmr, bg, net, rates: { sleepPerSec, awakePerSec } }
  }, [profile, day, activityCalories, foodCalories, now])

  useEffect(() => {
    function loop(t) {
      setNow(Date.now())
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const pct = Math.min(100, Math.max(0, (metrics.net % 5000) / 50))

  return (
    <div className="card progress-card">
      <div className="section-title">Live Ticker</div>
      <div className="totals">
        <div className="stat">
          <div className="kicker">Background</div>
          <div className="big">{Math.round(metrics.bg.total)} kcal</div>
        </div>
        <div className="stat">
          <div className="kicker">Activities</div>
          <div className="big">{Math.round(activityCalories)} kcal</div>
        </div>
        <div className="stat">
          <div className="kicker">Intake</div>
          <div className="big">{Math.round(foodCalories)} kcal</div>
        </div>
      </div>
      <div className="sep" />
      <div className="kicker">Net</div>
      <div className={metrics.net >= 0 ? 'big deficit-positive' : 'big deficit-negative'} style={{ fontSize: 28, fontWeight: 800 }}>
        {Math.round(metrics.net)} kcal
      </div>
      <div className="rate">Sleep rate: {metrics.rates.sleepPerSec.toFixed(3)} /s · Awake rate: {metrics.rates.awakePerSec.toFixed(3)} /s</div>
      <div className="bar" style={{ marginTop: 10 }}>
        <div className="fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}


