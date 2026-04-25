'use client';

import { useState, useEffect, use } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { FeeRecord, Student } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingSpinner, StatusBadge } from '@/components/common';

type PageProps = { params: Promise<{ id: string }> };

const MODE_LABELS: Record<string, string> = {
  cash: 'Cash', upi: 'UPI', bank_transfer: 'Bank Transfer', cheque: 'Cheque',
};

export default function FeeDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router  = useRouter();

  const [fee,         setFee]         = useState<FeeRecord | null>(null);
  const [student,     setStudent]     = useState<Student | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [teacherId,   setTeacherId]   = useState<string | null>(null);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [toast,       setToast]       = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'fees', id)).then(snap => {
      if (snap.exists()) {
        const feeData = { id: snap.id, ...snap.data() } as FeeRecord;
        setFee(feeData);
        // Also load student for contact info
        if (feeData.studentId) {
          getDoc(doc(db, 'students', feeData.studentId)).then(s => {
            if (s.exists()) setStudent({ uid: s.id, ...s.data() } as unknown as Student);
          });
        }
      }
      setLoading(false);
    });
  }, [id]);

  async function handleMarkPaid() {
    if (!fee || !teacherId) return;
    setMarkingPaid(true);
    try {
      // 1. Update fee record
      await updateDoc(doc(db, 'fees', id), {
        status:    'paid',
        paidAmount: fee.amount,
        paidAt:    serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2. Generate invoice
      const paymentMode = 'cash';   // default; could be a modal in the future
      const now         = new Date();
      const monthLabel  = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

      const res = await fetch('/api/invoices/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          feeRecordId:  id,
          studentId:    fee.studentId,
          studentName:  fee.studentName,
          studentEmail: (student as unknown as { email?: string })?.email  || '',
          studentPhone: (student as unknown as { phone?: string })?.phone  || '',
          batchId:      fee.batchId,
          batchName:    fee.batchName,
          month:        monthLabel,
          amount:       fee.amount,
          paidAmount:   fee.amount,
          paymentMode,
          paidAt:       now.toISOString(),
          notes:        '',
        }),
      });

      if (res.ok) {
        const { invoiceId } = await res.json() as { invoiceId: string };
        router.push(`/invoices/${invoiceId}`);
        return;
      }
      setToast('Payment marked paid. Invoice generation failed — try again later.');
      setFee(prev => prev ? { ...prev, status: 'paid', paidAmount: prev.amount } : prev);
    } finally {
      setMarkingPaid(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!fee)    return (
    <div className="empty-state">
      <span className="material-symbols-rounded">error</span>
      <h3>Fee record not found</h3>
      <Link href="/fees" className="btn btn-outline">Back to Fees</Link>
    </div>
  );

  const ts = (fee as unknown as Record<string, { toDate?: () => Date }>);

  return (
    <div>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: 'var(--warning)', color: '#fff', padding: '12px 20px',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
          maxWidth: 340, fontSize: 14,
        }}>
          {toast}
        </div>
      )}

      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <h1>Fee Record</h1>
            <p>
              {fee.studentName} — {fee.batchName} — {fee.month}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/fees" className="btn btn-outline">
              <span className="material-symbols-rounded icon-sm">arrow_back</span>
              Back
            </Link>
            <Link href="/fees/new" className="btn btn-outline">
              <span className="material-symbols-rounded icon-sm">add</span>
              New
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 600 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Status row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22 }}>₹{fee.amount.toLocaleString('en-IN')}</h2>
            <StatusBadge status={fee.status} />
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 20 }}>
            {[
              ['Student',  fee.studentName],
              ['Batch',    fee.batchName],
              ['Month',    fee.month],
              ['Due Date', fee.dueDateString],
              ['Amount',   `₹${fee.amount.toLocaleString('en-IN')}`],
              ['Paid',     `₹${(fee.paidAmount ?? 0).toLocaleString('en-IN')}`],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 2 }}>{label}</div>
                <div style={{ fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {(fee as unknown as { notes?: string }).notes && (
            <div style={{ marginBottom: 20, padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>Notes</div>
              <p style={{ color: 'var(--text-primary)', fontSize: 13 }}>{(fee as unknown as { notes?: string }).notes}</p>
            </div>
          )}

          {/* Payments / Invoice history */}
          {Array.isArray(fee.payments) && fee.payments.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 10 }}>Payment History</h4>
              {fee.payments.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>₹{p.amount.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {MODE_LABELS[p.mode] ?? p.mode}
                      {p.receiptNo ? ` · ${p.receiptNo}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {p.paidAt?.toDate ? p.paidAt.toDate().toLocaleDateString('en-IN') : ''}
                    </div>
                    {p.invoiceId && (
                      <Link href={`/invoices/${p.invoiceId}`} className="btn btn-outline btn-sm">
                        <span className="material-symbols-rounded icon-sm">receipt_long</span>
                        Invoice
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
            {fee.status !== 'paid' && (
              <button
                className="btn btn-primary"
                onClick={handleMarkPaid}
                disabled={markingPaid}
              >
                <span className="material-symbols-rounded filled icon-sm">check_circle</span>
                {markingPaid ? 'Processing…' : 'Mark Paid & Generate Invoice'}
              </button>
            )}
            <Link href="/invoices" className="btn btn-outline">
              <span className="material-symbols-rounded icon-sm">receipt_long</span>
              All Invoices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
