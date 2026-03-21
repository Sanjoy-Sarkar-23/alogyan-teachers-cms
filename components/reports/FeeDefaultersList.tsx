export default function FeeDefaultersList() {
  return (
    <div className="card" style={{ padding: 32, borderRadius: 24, marginTop: 32 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>Fee Defaulters List</h4>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, marginTop: 4 }}>Attention required for 5 students</p>
        </div>
        <button style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14 }}>View All Outstanding</button>
      </div>
      
      <div className="table-wrapper" style={{ border: 'none' }}>
        <table className="table" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ background: 'transparent', borderBottom: '1px solid var(--border)' }}>Student Name</th>
              <th style={{ background: 'transparent', borderBottom: '1px solid var(--border)' }}>Batch</th>
              <th style={{ background: 'transparent', borderBottom: '1px solid var(--border)' }}>Overdue Since</th>
              <th style={{ background: 'transparent', borderBottom: '1px solid var(--border)' }}>Amount Due</th>
              <th style={{ background: 'transparent', borderBottom: '1px solid var(--border)' }}>Last Reminder</th>
              <th style={{ background: 'transparent', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: 'Vikram Aditya', b: 'JEE Foundation', o: '15 Days', a: '₹4,500', r: '02 Mar, 2026' },
              { n: 'Sneha Kapoor', b: 'Class 12 Biology', o: '12 Days', a: '₹3,200', r: 'Never' },
              { n: 'Zaid Ibrahim', b: 'NEET Prep', o: '21 Days', a: '₹8,000', r: '28 Feb, 2026' },
            ].map((s, i) => (
              <tr key={i}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar avatar-sm">
                      {s.n.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{s.n}</span>
                  </div>
                </td>
                <td style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{s.b}</td>
                <td>
                  <span className="badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)', fontWeight: 900, textTransform: 'uppercase', fontSize: 10 }}>
                    {s.o}
                  </span>
                </td>
                <td style={{ fontSize: 14, fontWeight: 900 }}>{s.a}</td>
                <td style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{s.r}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="flex items-center gap-2" style={{
                    marginLeft: 'auto', border: '1px solid #fed7aa', color: '#ea580c',
                    padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: 'transparent'
                  }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 16 }}>notifications_active</span>
                    Send Reminder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
