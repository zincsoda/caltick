import { useEffect, useState } from 'react'
import { DEFAULT_USER, ACTIVITY_FACTOR_PRESETS } from '../lib/config.js'
import { saveProfile, readProfile } from '../lib/storage.js'

export default function Profile({ onChange }) {
  const [profile, setProfile] = useState(() => readProfile() || DEFAULT_USER)

  useEffect(() => {
    saveProfile(profile)
    onChange?.(profile)
  }, [profile, onChange])

  return (
    <div className="card">
      <div className="section-title">Profile</div>
      <div className="row">
        <div>
          <label>Age</label>
          <input type="number" value={profile.age} onChange={e => setProfile({ ...profile, age: Number(e.target.value) })} />
        </div>
        <div>
          <label>Sex</label>
          <select value={profile.sex} onChange={e => setProfile({ ...profile, sex: e.target.value })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div>
          <label>Height</label>
          <input type="number" value={profile.height} onChange={e => setProfile({ ...profile, height: Number(e.target.value) })} />
        </div>
        <div>
          <label>Weight</label>
          <input type="number" value={profile.weight} onChange={e => setProfile({ ...profile, weight: Number(e.target.value) })} />
        </div>
      </div>
      <div className="row">
        <div>
          <label>Activity Factor</label>
          <select value={profile.activityFactor} onChange={e => setProfile({ ...profile, activityFactor: Number(e.target.value) })}>
            {ACTIVITY_FACTOR_PRESETS.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Sleep Factor</label>
          <input type="number" step="0.01" value={profile.sleepFactor} onChange={e => setProfile({ ...profile, sleepFactor: Number(e.target.value) })} />
          <div className="hint">Relative to RMR during sleep</div>
        </div>
      </div>
      <div className="row">
        <div>
          <label>Include RMR</label>
          <select value={profile.includeRMR} onChange={e => setProfile({ ...profile, includeRMR: e.target.value })}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
    </div>
  )
}


