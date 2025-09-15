import { useMemo, useState } from 'react'

export default function Foods({ day, onChange }) {
  const [form, setForm] = useState({ name: '', calories: 0 })

  const total = useMemo(() => (day.foods || []).reduce((s, f) => s + Number(f.calories || 0), 0), [day.foods])

  function addFood() {
    if (!form.name || form.calories === '' || form.calories === null || form.calories === undefined) {
      return
    }
    const newDay = { ...day, foods: [...(day.foods || []), { ...form, calories: Number(form.calories) }] }
    onChange?.(newDay)
    setForm({ name: '', calories: 0 })
  }

  function removeFood(idx) {
    const newDay = { ...day, foods: day.foods.filter((_, i) => i !== idx) }
    onChange?.(newDay)
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


