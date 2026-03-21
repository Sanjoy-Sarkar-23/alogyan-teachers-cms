'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Test } from '@/types';
import Link from 'next/link';

export default function TestsPage() {
  const [tests, setTests]           = useState<Test[]>([]);
  const [loading, setLoading]       = useState(true);
  const [teacherId, setTeacherId]   = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  const fetchTests = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'tests'), where('teacherId', '==', teacherId), orderBy('date', 'desc'));
      const snap = await getDocs(q);
      setTests(snap.docs.map(d => ({ id: d.id, ...d.data() } as Test)));
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  const now = new Date().toISOString().split('T')[0];
  const upcoming = tests.filter(t => t.date >= now);
  const past     = tests.filter(t => t.date < now);

  const TestCard = ({ t }: { t: Test }) => (
    <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: t.date >= now ? 'var(--primary-light)' : 'var(--bg-hover)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.date >= now ? 'var(--primary)' : 'var(--text-secondary)', lineHeight: 1 }}>
          {t.date.split('-')[2]}
        </div>
        <div style={{ fontSize: 10, color: t.date >= now ? 'var(--primary)' : 'var(--text-disabled)' }}>
          {new Date(t.date).toLocaleString('en', { month: 'short' })}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{t.title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{t.subject} · {t.batchId}</div>
        {t.totalMarks && (
          <div style={{ fontSize: 12, color: 'var(--text-disabled)', marginTop: 4 }}>
            Total Marks: {t.totalMarks}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Link href={`/tests/${t.id}`} className="btn btn-outline btn-sm">Results</Link>
      </div>
    </div>
  );

  if (loading) return <div className="empty-state"><span className="material-symbols-rounded" style={{ fontSize: 36 }}>autorenew</span></div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1>Tests</h1><p>Schedule tests and track results</p></div>
          <Link href="/tests/new" className="btn btn-primary">
            <span className="material-symbols-rounded icon-sm">add</span>
            Schedule Test
          </Link>
        </div>
      </div>

      {tests.length === 0 ? (
        <div className="card"><div className="empty-state">
          <span className="material-symbols-rounded">quiz</span>
          <h3>No tests scheduled</h3>
          <p>Create a test to track student performance.</p>
          <Link href="/tests/new" className="btn btn-primary btn-sm">Schedule Test</Link>
        </div></div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>UPCOMING</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcoming.map(t => <TestCard key={t.id} t={t} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>PAST TESTS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {past.map(t => <TestCard key={t.id} t={t} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
