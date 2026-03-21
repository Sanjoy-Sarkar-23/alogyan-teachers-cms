'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences.</p>
      </div>

      <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="form-label">Display Name</label>
              <input className="input" placeholder="Your name" />
            </div>
            <div>
              <label className="form-label">Institute / School Name</label>
              <input className="input" placeholder="e.g. Alogyan Coaching" />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input className="input" placeholder="+91…" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
                {saved ? '✓ Saved' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="form-label">Currency</label>
              <select className="select">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Academic Year Start Month</label>
              <select className="select">
                {['January', 'February', 'March', 'April', 'June', 'July', 'September', 'October'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 4, fontWeight: 600 }}>Danger Zone</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>These actions are irreversible. Proceed with caution.</p>
          <button className="btn btn-danger btn-sm">Delete My Account</button>
        </div>
      </div>
    </div>
  );
}
