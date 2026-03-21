export default function StudentPerformance() {
  return (
    <div className="card" style={{ padding: 32, borderRadius: 24 }}>
      <h4 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 24, marginTop: 0 }}>Student Performance (Tests)</h4>
      <div className="table-wrapper" style={{ border: 'none', background: 'transparent' }}>
        <table className="table" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)', background: 'transparent' }}>Student</th>
              <th style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)', background: 'transparent' }}>Tests</th>
              <th style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)', background: 'transparent' }}>Avg Score</th>
              <th style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)', textAlign: 'right', background: 'transparent' }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: 'Aryan K.', t: '14/14', s: '94%', tr: 'trending_up', c: 'var(--success)' },
              { n: 'Isha Gupta', t: '14/14', s: '91%', tr: 'trending_up', c: 'var(--success)' },
              { n: 'Rohan S.', t: '13/14', s: '89%', tr: 'trending_flat', c: 'var(--text-disabled)' },
              { n: 'Manas V.', t: '11/14', s: '42%', tr: 'trending_down', c: 'var(--danger)', bg: 'var(--danger-light)' },
            ].map((s, i) => (
              <tr key={i} style={s.bg ? { background: s.bg } : {}}>
                <td style={{ fontWeight: 700, fontSize: 14 }}>{s.n}</td>
                <td style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-secondary)' }}>{s.t}</td>
                <td style={{ fontWeight: 700, fontSize: 14, color: s.c === 'var(--danger)' ? 'var(--danger)' : 'inherit' }}>{s.s}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="material-symbols-rounded" style={{ color: s.c, fontSize: 18 }}>{s.tr}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
