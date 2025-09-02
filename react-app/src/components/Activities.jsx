import { useEffect, useMemo, useState } from 'react'
import { readDay, saveDay } from '../lib/storage.js'
import { METS } from '../lib/config.js'
import { calcActivityCalories } from '../lib/calculations.js'

export default function Activities({ weightKg, onChange }) {
  const [day, setDay] = useState(() => readDay())
  const [form, setForm] = useState({ type: 'walking', met: METS.walking, minutes: 30 })

  useEffect(() => { saveDay(day); onChange?.(day) }, [day, onChange])

  const total = useMemo(() => {
    return (day.activities || []).reduce((sum, a) => sum + calcActivityCalories(weightKg, a.met, a.minutes), 0)
  }, [day.activities, weightKg])

  function addActivity() {
    const next = { ...day, activities: [...(day.activities || []), { ...form }] }
    setDay(next)
    setForm(f => ({ ...f, minutes: 30 }))
  }

  function removeActivity(idx) {
    const next = { ...day, activities: day.activities.filter((_, i) => i !== idx) }
    setDay(next)
  }

  return (
    <div className="card">
      <div className="section-title">Activities</div>
      <div className="row-3">
        <div>
          <label>Type</label>
          <select value={form.type} onChange={e => {
            const t = e.target.value
            setForm({ ...form, type: t, met: METS[t] ?? form.met })
          }}>
            {Object.keys(METS).map(k => (<option key={k} value={k}>{k}</option>))}
          </select>
        </div>
        <div>
          <label>MET</label>
          <input type="number" step="0.1" value={form.met} onChange={e => setForm({ ...form, met: Number(e.target.value) })} />
        </div>
        <div>
          <label>Minutes</label>
          <input type="number" value={form.minutes} onChange={e => setForm({ ...form, minutes: Number(e.target.value) })} />
        </div>
      </div>
      <div className="inline" style={{ marginTop: 8 }}>
        <button className="btn" onClick={addActivity}>Add Activity</button>
        <div className="note">Total: {Math.round(total)} kcal</div>
      </div>
      <div className="activities" style={{ marginTop: 10 }}>
        {(day.activities || []).map((a, i) => (
          <div key={i} className="activity">
            <div>
              <div>{a.type} – {a.minutes} min</div>
              <div className="meta">MET {a.met}</div>
            </div>
            <button className="remove" onClick={() => removeActivity(i)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}


