import { useEffect, useMemo, useRef, useState } from 'react'
import { calcBackgroundCalories, calcCalorieRates, calcRMR_MSJ } from '../lib/calculations.js'
import { toKg, toCm } from '../lib/utils.js'

export default function Metrics({ profile, day, activityCalories = 0, foodCalories = 0 }) {
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
    
    // Calculate total burned (background + activities)
    const totalBurned = bg.total + activityCalories
    
    // Calculate current rate (sleep or awake rate)
    const currentRate = now >= wakeTs ? awakePerSec : sleepPerSec
    
    // Calculate predicted daily burn (24h from bedtime)
    const dailyEndTs = bedTs + 24 * 3600_000
    const wakeTsClamped = Math.min(Math.max(wakeTs, bedTs), dailyEndTs)
    const sleepHours = (wakeTsClamped - bedTs) / 3600_000
    const awakeHours = 24 - sleepHours
    
    const sleepDaily = profile.includeRMR === 'yes' 
      ? rmr * profile.sleepFactor * (sleepHours / 24) 
      : 0
    const awakeDaily = profile.includeRMR === 'yes' 
      ? rmr * profile.activityFactor * (awakeHours / 24) 
      : 0
    
    const predictedDailyBurn = sleepDaily + awakeDaily + activityCalories
    
    // Calculate projected deficit
    const projectedDeficit = predictedDailyBurn - foodCalories
    
    // Calculate estimated fat burned (1 gram of fat = 9 calories)
    const fatBurnedGrams = projectedDeficit > 0 ? projectedDeficit / 9 : 0
    
    // Count food items
    const foodItems = (day.foods || []).length
    
    return { 
      rmr, 
      bg, 
      totalBurned,
      currentRate,
      predictedDailyBurn,
      projectedDeficit,
      fatBurnedGrams,
      foodItems,
      rates: { sleepPerSec, awakePerSec } 
    }
  }, [profile, day, activityCalories, foodCalories, now])

  useEffect(() => {
    function loop(t) {
      setNow(Date.now())
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const formatKcal = (value) => {
    if (value >= 1000) {
      return Math.round(value).toLocaleString() + ' kcal'
    }
    return value.toFixed(2) + ' kcal'
  }

  const formatKcal0 = (value) => {
    return Math.round(value).toLocaleString() + ' kcal'
  }

  const formatRate = (rate) => {
    return `Rate: +${rate.toFixed(4)} kcal/s`
  }

  return (
    <div className="card">
      <div className="section-title">TOTALS SINCE BEDTIME</div>
      
      <div className="totals">
        <div className="stat">
          <div className="kicker">ESTIMATED TOTAL BURNED (LIVE)</div>
          <div className="big">{formatKcal(metrics.totalBurned)}</div>
          <div className="rate">{formatRate(metrics.currentRate)}</div>
        </div>
        
        <div className="stat">
          <div className="kicker">FROM ACTIVITIES</div>
          <div className="big">{formatKcal(activityCalories)}</div>
          <div className="rate">Rate: +0.0000 kcal/s (logged totals)</div>
        </div>
        
        <div className="stat">
          <div className="kicker">PREDICTED DAILY BURN</div>
          <div className="big">{formatKcal0(metrics.predictedDailyBurn)}</div>
          <div className="rate">24-hour projection</div>
        </div>
        
        <div className="stat">
          <div className="kicker">PREDICTED DAILY DEFICIT</div>
          <div className={`big ${metrics.projectedDeficit >= 0 ? 'deficit-positive' : 'deficit-negative'}`}>
            {formatKcal0(metrics.projectedDeficit)}
          </div>
          <div className="rate">Projected deficit (burn - food)</div>
        </div>
        
        <div className="stat">
          <div className="kicker">ESTIMATED FAT BURNED</div>
          <div className={`big ${metrics.fatBurnedGrams > 0 ? 'fat-burned' : ''}`}>
            {metrics.fatBurnedGrams.toFixed(1)} g
          </div>
          <div className="rate">From calorie deficit</div>
        </div>
        
        <div className="stat">
          <div className="kicker">TOTAL EATEN SINCE BEDTIME</div>
          <div className="big">{formatKcal(foodCalories)}</div>
          <div className="rate">Items: {metrics.foodItems}</div>
        </div>
      </div>
    </div>
  )
}

