'use client';

import { EmptyState, LoadingSpinner, PageHeader, StatusBadge } from '@/components/common';
import { auth, db } from '@/lib/firebase';
import type { Batch } from '@/types';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
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

  const formatSchedule = (b: Batch) =>
    b.schedule?.map(slot => `${slot.day} ${slot.startTime}`).join(', ') || '—';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <PageHeader
        title="Batches"
        subtitle={`${batches.length} batch${batches.length !== 1 ? 'es' : ''}`}
        action={
          <Link href="/batches/new" className="btn btn-primary">
            <span className="material-symbols-rounded icon-sm">add</span>
            New Batch
          </Link>
        }
      />

      {batches.length === 0 ? (
        <EmptyState
          icon="class"
          title="No batches yet"
          description="Create your first batch to start managing classes."
          href="/batches/new"
          actionLabel="Create Batch"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map(b => (
            <div key={b.id} className="card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-filled text-primary">class</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{b.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{b.subject}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="material-symbols-rounded text-sm">group</span>
                  <span>{b.studentIds?.length ?? 0} students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="material-symbols-rounded text-sm">schedule</span>
                  <span className="truncate">{formatSchedule(b)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="material-symbols-rounded text-sm">currency_rupee</span>
                  <span>₹{b.monthlyFee?.toLocaleString('en-IN')}/month</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/batches/${b.id}`} className="btn btn-outline btn-sm flex-1 justify-center">
                  View
                </Link>
                <Link href={`/attendance?batchId=${b.id}`} className="btn btn-primary btn-sm flex-1 justify-center">
                  Attendance
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
