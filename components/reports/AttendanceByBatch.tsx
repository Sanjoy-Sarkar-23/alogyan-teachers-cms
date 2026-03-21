export default function AttendanceByBatch() {
  return (
    <div className="card" style={{ padding: 32, borderRadius: 24 }}>
      <h4 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 24, marginTop: 0 }}>Attendance by Batch</h4>
      <div className="flex flex-col gap-6">
        {[
          { name: 'Class 10 Maths', p: '88%' },
          { name: 'Class 11 Physics', p: '79%', o: 0.8 },
          { name: 'Class 12 Biology', p: '92%' },
          { name: 'JEE Foundation', p: '81%', o: 0.9 },
          { name: 'NEET Prep', p: '76%', o: 0.7 },
        ].map((b, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex justify-between" style={{ fontSize: 14, fontWeight: 700 }}>
              <span>{b.name}</span>
              <span style={{ color: 'var(--primary)' }}>{b.p}</span>
            </div>
            <div className="progress-bar" style={{ height: 12 }}>
              <div className="progress-bar-fill" style={{ width: b.p, background: 'linear-gradient(135deg, var(--primary) 0%, #d32f2f 100%)', opacity: b.o || 1 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
