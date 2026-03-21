'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Batch } from '@/types';
import Link from 'next/link';

export default function BatchesPage() {
  const [batches, setBatches]     = useState<Batch[]>([]);
  const [loading, setLoading]     = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  const fetchBatches = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'batches'),
        where('teacherId', '==', teacherId),
        orderBy('name')
      );
      const snap = await getDocs(q);
      setBatches(snap.docs.map(d => ({ id: d.id, ...d.data() } as Batch)));
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const statusBadge = (status: string) => {
    const cls = status === 'active' ? 'badge-success' : status === 'upcoming' ? 'badge-warning' : 'badge-neutral';
    return <span className={`badge ${cls}`}>{status}</span>;
  };

  const formatSchedule = (b: Batch) =>
    b.schedule?.map(slot => `${slot.day} ${slot.startTime}`).join(', ') || '—';

  if (loading) return <div className="empty-state"><span className="material-symbols-rounded" style={{ fontSize: 36, animation: 'spin 1s linear infinite' }}>autorenew</span></div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1>Batches</h1>
            <p>{batches.length} batch{batches.length !== 1 ? 'es' : ''}</p>
          </div>
          <Link href="/batches/new" className="btn btn-primary">
            <span className="material-symbols-rounded icon-sm">add</span>
            New Batch
          </Link>
        </div>
      </div>

      {batches.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="material-symbols-rounded">class</span>
            <h3>No batches yet</h3>
            <p>Create your first batch to start managing classes.</p>
            <Link href="/batches/new" className="btn btn-primary btn-sm">Create Batch</Link>
          </div>
        </div>
      ) : (
        <div className="grid-3" style={{ gap: 16 }}>
          {batches.map(b => (
            <div className="card" key={b.id} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span className="material-symbols-rounded filled" style={{ color: 'var(--primary)', fontSize: 22 }}>class</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{b.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{b.subject}</div>
                </div>
                {statusBadge(b.status)}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-secondary)', alignItems: 'center' }}>
                  <span className="material-symbols-rounded icon-sm">group</span>
                  {b.studentIds?.length ?? 0} students
                </div>
                <div style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-secondary)', alignItems: 'center' }}>
                  <span className="material-symbols-rounded icon-sm">schedule</span>
                  {formatSchedule(b)}
                </div>
                <div style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-secondary)', alignItems: 'center' }}>
                  <span className="material-symbols-rounded icon-sm">currency_rupee</span>
                  ₹{b.feeAmount?.toLocaleString('en-IN')}/month
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/batches/${b.id}`} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>View</Link>
                <Link href={`/attendance?batchId=${b.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Attendance</Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx global>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
