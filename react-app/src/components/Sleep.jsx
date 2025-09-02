import { useEffect, useState } from 'react'
import { readDay, saveDay } from '../lib/storage.js'
import { toLocalDatetimeValue } from '../lib/utils.js'

export default function Sleep({ onChange }) {
  const [day, setDay] = useState(() => readDay())

  useEffect(() => {
    saveDay(day)
    onChange?.(day)
  }, [day, onChange])

  return (
    <div className="card">
      <div className="section-title">Sleep & Wake</div>
      <div className="row">
        <div>
          <label>Bedtime</label>
          <input type="datetime-local" value={toLocalDatetimeValue(new Date(day.bedtimeISO))} onChange={e => setDay({ ...day, bedtimeISO: new Date(e.target.value).toISOString() })} />
        </div>
        <div>
          <label>Waketime</label>
          <input type="datetime-local" value={toLocalDatetimeValue(new Date(day.waketimeISO))} onChange={e => setDay({ ...day, waketimeISO: new Date(e.target.value).toISOString() })} />
        </div>
      </div>
    </div>
  )
}


