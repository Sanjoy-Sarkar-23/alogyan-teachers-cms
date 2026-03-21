'use client';

import Link from 'next/link';

const kpis = [
  { label: 'Total Students', value: '—', icon: 'group', color: 'red' },
  { label: 'Active Batches', value: '—', icon: 'class', color: 'green' },
  { label: 'Today Classes', value: '—', icon: 'today', color: 'orange' },
  { label: 'Fee Pending', value: '—', icon: 'payments', color: 'red' },
];

const quickLinks = [
  { href: '/attendance', icon: 'fact_check', label: 'Mark Attendance', desc: 'Record attendance for today' },
  { href: '/fees',       icon: 'payments',   label: 'Collect Fee',      desc: 'Update payment records' },
  { href: '/students/new', icon: 'person_add', label: 'Add Student',    desc: 'Enroll a new student' },
  { href: '/batches/new',  icon: 'add_circle', label: 'New Batch',      desc: 'Create a batch or class' },
  { href: '/notes/upload', icon: 'upload_file', label: 'Upload Note',   desc: 'Share study material' },
  { href: '/tests/new',    icon: 'quiz',        label: 'Schedule Test', desc: 'Plan an upcoming test' },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Good morning! Here's a snapshot of your institute today.</p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        {kpis.map(k => (
          <div className="kpi-card" key={k.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-value">{k.value}</div>
              </div>
              <div className={`kpi-icon ${k.color}`}>
                <span className="material-symbols-rounded filled">{k.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="grid-3" style={{ gap: 12 }}>
          {quickLinks.map(ql => (
            <Link
              key={ql.href}
              href={ql.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 14,
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.15s',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
                (e.currentTarget as HTMLElement).style.background = 'var(--primary-light)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.background = '';
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'var(--primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span className="material-symbols-rounded filled" style={{ color: 'var(--primary)', fontSize: 20 }}>
                  {ql.icon}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{ql.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ql.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Classes */}
      <div className="card">
        <div className="card-header">
          <h3>Today's Classes</h3>
          <Link href="/batches" style={{ fontSize: 13, color: 'var(--primary)' }}>View all →</Link>
        </div>
        <div className="empty-state">
          <span className="material-symbols-rounded">calendar_today</span>
          <h3>No classes today</h3>
          <p>Add batches with schedules to see them here.</p>
          <Link href="/batches/new" className="btn btn-outline btn-sm">Create Batch</Link>
        </div>
      </div>
    </div>
  );
}
