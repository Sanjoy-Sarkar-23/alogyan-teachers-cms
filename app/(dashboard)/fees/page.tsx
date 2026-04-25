'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { FeeRecord } from '@/types';
import Link from 'next/link';
import { LoadingSpinner, StatusBadge, PageHeader, EmptyState, KPICard, FilterChips } from '@/components/common';

type FeeFilter = 'all' | 'paid' | 'pending' | 'overdue';

export default function FeesPage() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FeeFilter>('all');

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

  if (loading) return <LoadingSpinner />;

  const filterOptions: FeeFilter[] = ['all', 'paid', 'pending', 'overdue'];

  return (
    <div className="p-6">
      <PageHeader 
        title="Fees" 
        subtitle="Track and manage fee collections"
        action={
          <Link href="/fees/new" className="btn btn-primary">
            <span className="material-symbols-rounded icon-sm">add</span>
            Record Payment
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard label="Total Expected" value={`₹${summary.total.toLocaleString('en-IN')}`} />
        <KPICard label="Collected" value={`₹${summary.collected.toLocaleString('en-IN')}`} color="success" />
        <KPICard label="Pending" value={`₹${summary.pending.toLocaleString('en-IN')}`} color="warning" />
        <KPICard label="Overdue" value={`₹${summary.overdue.toLocaleString('en-IN')}`} color="danger" />
      </div>

      <FilterChips
        options={filterOptions}
        value={filter}
        onChange={setFilter}
        formatLabel={(f) => f.charAt(0).toUpperCase() + f.slice(1)}
        className="mb-4"
      />

      {filtered.length === 0 ? (
        <EmptyState 
          icon="payments"
          title="No fee records"
          description="Record fee payments to track collections."
          href="/fees/new"
          actionLabel="Record Payment"
        />
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
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td className="font-medium">{f.studentName}</td>
                  <td>{f.batchName}</td>
                  <td>{f.month}</td>
                  <td className="font-bold">₹{f.amount.toLocaleString('en-IN')}</td>
                  <td>{f.dueDateString}</td>
                  <td><StatusBadge status={f.status} /></td>
                  <td className="text-right">
                    <Link href={`/fees/${f.id}`} className="btn btn-ghost btn-sm">
                      <span className="material-symbols-rounded icon-sm">edit</span>
                    </Link>
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
