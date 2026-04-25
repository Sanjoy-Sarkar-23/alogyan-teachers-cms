'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Invoice } from '@/types';
import Link from 'next/link';
import { LoadingSpinner, PageHeader, EmptyState } from '@/components/common';

type MonthFilter = 'all' | 'this_month' | 'last_month';

function formatDate(ts: { toDate?: () => Date } | Date | null | undefined): string {
  if (!ts) return '—';
  const d = typeof (ts as { toDate?: () => Date }).toDate === 'function'
    ? (ts as { toDate: () => Date }).toDate()
    : ts as Date;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const MODE_ICON: Record<string, string> = {
  cash: 'payments', upi: 'qr_code', bank_transfer: 'account_balance', cheque: 'receipt',
};
const MODE_LABEL: Record<string, string> = {
  cash: 'Cash', upi: 'UPI', bank_transfer: 'Bank Transfer', cheque: 'Cheque',
};

export default function InvoicesPage() {
  const [invoices,  setInvoices]  = useState<Invoice[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [filter,    setFilter]    = useState<MonthFilter>('all');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  const fetchInvoices = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'invoices'),
        where('teacherId', '==', teacherId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setInvoices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)));
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  /* ─── Month filter ─── */
  const now = new Date();
  const filtered = invoices.filter(inv => {
    if (filter === 'all') return true;
    const created = (inv.createdAt as unknown as { toDate?: () => Date }).toDate?.() ?? new Date(0);
    if (filter === 'this_month') {
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return created.getMonth() === last.getMonth() && created.getFullYear() === last.getFullYear();
  });

  const totalAmount = filtered.reduce((s, i) => s + (i.paidAmount ?? i.amount), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: 0 }}>
      <PageHeader
        title="Invoices"
        subtitle={`${filtered.length} invoice${filtered.length !== 1 ? 's' : ''} · ₹${totalAmount.toLocaleString('en-IN')} total`}
      />

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'this_month', 'last_month'] as MonthFilter[]).map(opt => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              border: '1.5px solid',
              cursor: 'pointer',
              transition: 'all 0.15s',
              borderColor:   filter === opt ? 'var(--primary)' : 'var(--border)',
              background:    filter === opt ? 'var(--primary)' : '#fff',
              color:         filter === opt ? '#fff'           : 'var(--text-secondary)',
            }}
          >
            {opt === 'all' ? 'All Time' : opt === 'this_month' ? 'This Month' : 'Last Month'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="receipt_long"
          title="No invoices yet"
          description="Invoices are generated automatically when you record a paid fee."
          href="/fees/new"
          actionLabel="Record Payment"
        />
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Student</th>
                <th>Batch</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)', fontSize: 13 }}>
                      {inv.invoiceNo}
                    </span>
                  </td>
                  <td className="font-medium">{inv.studentName}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{inv.batchName}</td>
                  <td>{inv.month}</td>
                  <td className="font-bold">₹{(inv.paidAmount ?? inv.amount).toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                      <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--text-secondary)' }}>
                        {MODE_ICON[inv.paymentMode] ?? 'payments'}
                      </span>
                      {MODE_LABEL[inv.paymentMode] ?? inv.paymentMode}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {formatDate(inv.createdAt as unknown as { toDate?: () => Date })}
                  </td>
                  <td className="text-right">
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <Link href={`/invoices/${inv.id}`} className="btn btn-outline btn-sm">
                        <span className="material-symbols-rounded icon-sm">visibility</span>
                        View
                      </Link>
                      <Link href={`/invoices/${inv.id}?print=1`} className="btn btn-ghost btn-sm" title="Print">
                        <span className="material-symbols-rounded icon-sm">print</span>
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
