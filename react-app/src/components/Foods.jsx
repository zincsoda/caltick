import { useEffect, useMemo, useState } from 'react'
import { readDay, saveDay } from '../lib/storage.js'

export default function Foods({ onChange }) {
  const [day, setDay] = useState(() => readDay())
  const [form, setForm] = useState({ name: '', calories: 0 })

  useEffect(() => { saveDay(day); onChange?.(day) }, [day, onChange])

  const total = useMemo(() => (day.foods || []).reduce((s, f) => s + Number(f.calories || 0), 0), [day.foods])

  function addFood() {
    if (!form.name || !form.calories) return
    setDay({ ...day, foods: [...(day.foods || []), { ...form, calories: Number(form.calories) }] })
    setForm({ name: '', calories: 0 })
  }

  function removeFood(idx) {
    setDay({ ...day, foods: day.foods.filter((_, i) => i !== idx) })
  }

  return (
    <div className="card">
      <div className="section-title">Foods</div>
      <div className="row">
        <div>
          <label>Food</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label>Calories</label>
          <input type="number" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} />
        </div>
      </div>
      <div className="inline" style={{ marginTop: 8 }}>
        <button className="btn" onClick={addFood}>Add Food</button>
        <div className="note">Total intake: {Math.round(total)} kcal</div>
      </div>
      <div className="foods" style={{ marginTop: 10 }}>
        {(day.foods || []).map((f, i) => (
          <div key={i} className="food">
            <div>
              <div>{f.name}</div>
              <div className="meta">{Math.round(f.calories)} kcal</div>
            </div>
            <button className="remove" onClick={() => removeFood(i)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}


