export default function TopStatsRow() {
  return (
    <div className="kpi-grid mb-8 p-12" style={{ gap: 24 }}>
      {/* Stat 1: Attendance */}
      <div className="kpi-card flex items-center justify-between" style={{ padding: 24, borderRadius: 16 }}>
        <div>
          <p className="kpi-label">Avg Attendance Rate</p>
          <h3 className="kpi-value" style={{ fontSize: 30 }}>84%</h3>
          <p style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700, marginTop: 4 }}>+2% from last month</p>
        </div>
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" strokeWidth="4" stroke="var(--bg-surface)" />
            <circle cx="18" cy="18" r="16" fill="none" strokeWidth="4" stroke="var(--success)" strokeDasharray="84, 100" strokeLinecap="round" />
          </svg>
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: 'var(--success)' }}>
            84%
          </span>
        </div>
      </div>

      {/* Stat 2: Fee */}
      <div className="kpi-card" style={{ padding: 24, borderRadius: 16 }}>
        <p className="kpi-label">Total Fee Collected</p>
        <div className="flex items-baseline gap-2 mt-2">
          <h3 className="kpi-value" style={{ fontSize: 30, margin: 0 }}>₹38,500</h3>
          <span style={{ color: 'var(--text-disabled)', fontSize: 14, fontWeight: 500 }}>/ ₹47k</span>
        </div>
        <div style={{ width: '100%', height: 8, background: 'var(--bg-surface)', borderRadius: 4, marginTop: 16, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(135deg, var(--primary) 0%, #d32f2f 100%)', width: '82%', borderRadius: 4 }} />
        </div>
      </div>

      {/* Stat 3: Tests */}
      <div className="kpi-card flex items-center gap-4" style={{ padding: 24, borderRadius: 16 }}>
        <div className="kpi-icon red" style={{ width: 48, height: 48, borderRadius: 12 }}>
          <span className="material-symbols-rounded filled" style={{ fontSize: 24 }}>quiz</span>
        </div>
        <div>
          <p className="kpi-label">Tests Conducted</p>
          <h3 className="kpi-value" style={{ fontSize: 30, margin: 0 }}>14</h3>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 2 }}>10 graded</p>
        </div>
      </div>

      {/* Stat 4: Active Students */}
      <div className="kpi-card" style={{ padding: 24, borderRadius: 16 }}>
        <p className="kpi-label">Active Students</p>
        <div className="flex items-center justify-between mt-2">
          <h3 className="kpi-value" style={{ fontSize: 30, margin: 0 }}>45<span style={{ color: 'var(--text-disabled)', fontSize: 20, fontWeight: 500 }}>/48</span></h3>
          <div style={{ height: 40, width: 80, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
            <div style={{ width: 8, background: 'var(--success-light)', borderRadius: '2px 2px 0 0', height: '50%' }} />
            <div style={{ width: 8, background: '#a5d6a7', borderRadius: '2px 2px 0 0', height: '75%' }} />
            <div style={{ width: 8, background: '#81c784', borderRadius: '2px 2px 0 0', height: '66%' }} />
            <div style={{ width: 8, background: 'var(--success)', borderRadius: '2px 2px 0 0', height: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
