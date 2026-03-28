'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { FeeRecord } from '@/types';
import Link from 'next/link';

export default function FeesPage() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  const fetchFees = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'fees'),
        where('teacherId', '==', teacherId),
        orderBy('dueDate', 'desc')
      );
      const snap = await getDocs(q);
      setFees(snap.docs.map(d => ({ id: d.id, ...d.data() } as FeeRecord)));
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { fetchFees(); }, [fetchFees]);

  const filtered = filter === 'all' ? fees : fees.filter(f => f.status === filter);

  const summary = {
    total: fees.reduce((a, f) => a + (f.amount ?? 0), 0),
    collected: fees.filter(f => f.status === 'paid').reduce((a, f) => a + (f.amount ?? 0), 0),
    pending: fees.filter(f => f.status === 'pending').reduce((a, f) => a + (f.amount ?? 0), 0),
    overdue: fees.filter(f => f.status === 'overdue').reduce((a, f) => a + (f.amount ?? 0), 0),
  };

  const statusBadge = (s: string) => {
    const cls = s === 'paid' ? 'badge-success' : s === 'pending' ? 'badge-warning' : 'badge-error';
    return <span className={`badge ${cls}`}>{s}</span>;
  };

  if (loading) return <div className="empty-state"><span className="material-symbols-rounded" style={{ fontSize: 36 }}>autorenew</span></div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1>Fees</h1><p>Track and manage fee collections</p></div>
          <Link href="/fees/new" className="btn btn-primary">
            <span className="material-symbols-rounded icon-sm">add</span>
            Record Payment
          </Link>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        <div className="kpi-card">
          <div className="kpi-label">Total Expected</div>
          <div className="kpi-value">₹{summary.total.toLocaleString('en-IN')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Collected</div>
          <div className="kpi-value" style={{ color: 'var(--success)' }}>₹{summary.collected.toLocaleString('en-IN')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pending</div>
          <div className="kpi-value" style={{ color: 'var(--warning)' }}>₹{summary.pending.toLocaleString('en-IN')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Overdue</div>
          <div className="kpi-value" style={{ color: 'var(--danger)' }}>₹{summary.overdue.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'paid', 'pending', 'overdue'] as const).map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <span className="material-symbols-rounded">payments</span>
          <h3>No fee records</h3>
          <p>Record fee payments to track collections.</p>
          <Link href="/fees/new" className="btn btn-primary btn-sm">Record Payment</Link>
        </div></div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Batch</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{f.studentName}</td>
                  <td style={{ fontSize: 13 }}>{f.batchName}</td>
                  <td style={{ fontSize: 13 }}>{f.month}</td>
                  <td style={{ fontWeight: 700, fontSize: 14 }}>₹{f.amount.toLocaleString('en-IN')}</td>
                  <td style={{ fontSize: 13 }}>{f.dueDateString}</td>
                  <td>{statusBadge(f.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <Link href={`/fees/${f.id}`} className="btn btn-ghost btn-sm">
                        <span className="material-symbols-rounded icon-sm">edit</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
