import { useState } from 'react'
import { toLocalDatetimeValue } from '../lib/utils.js'

export default function Sleep({ day, onChange }) {

  return (
    <div className="card">
      <div className="section-title">Sleep & Wake</div>
      <div className="row">
        <div>
          <label>Bedtime</label>
          <input type="datetime-local" value={toLocalDatetimeValue(new Date(day.bedtimeISO))} onChange={e => onChange?.({ ...day, bedtimeISO: new Date(e.target.value).toISOString() })} />
        </div>
        <div>
          <label>Waketime</label>
          <input type="datetime-local" value={toLocalDatetimeValue(new Date(day.waketimeISO))} onChange={e => onChange?.({ ...day, waketimeISO: new Date(e.target.value).toISOString() })} />
        </div>
      </div>
    </div>
  )
}


