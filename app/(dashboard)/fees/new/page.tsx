'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Batch, Student, PaymentType } from '@/types';
import Link from 'next/link';

/* ─── Const ─── */
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const PAYMENT_TYPES: { key: PaymentType; icon: string; label: string; desc: string }[] = [
  { key: 'monthly',  icon: 'calendar_month',  label: 'Monthly',    desc: 'Regular monthly tuition fee' },
  { key: 'batch',    icon: 'groups',           label: 'Batch-wise', desc: 'Full batch / course fee'    },
  { key: 'one-time', icon: 'bolt',             label: 'One-Time',   desc: 'Internship, exam, workshop…' },
];

const PAYMENT_MODES = [
  { value: 'cash',          label: '💵 Cash'          },
  { value: 'upi',           label: '📱 UPI'           },
  { value: 'bank_transfer', label: '🏦 Bank Transfer' },
  { value: 'cheque',        label: '📄 Cheque'        },
];

/* ─── Quick amount presets for one-time ─── */
const ONE_TIME_PRESETS = [499, 999, 1499, 1999, 2499, 4999];

type Status = 'pending' | 'paid' | 'overdue';

export default function NewFeePage() {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [batches,   setBatches]   = useState<Batch[]>([]);
  const [students,  setStudents]  = useState<Student[]>([]);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState<{ msg: string; ok: boolean } | null>(null);

  const now = new Date();
  const [form, setForm] = useState({
    paymentType:        'monthly' as PaymentType,
    studentId:          '',
    batchId:            '',
    amount:             '',
    oneTimeDescription: '',
    month:              MONTHS[now.getMonth()],
    year:               String(now.getFullYear()),
    dueDate:            now.toISOString().split('T')[0],
    status:             'pending' as Status,
    paymentMode:        'cash' as 'cash' | 'upi' | 'bank_transfer' | 'cheque',
    notes:              '',
  });

  const set = (field: keyof typeof form, val: string) =>
    setForm(prev => ({ ...prev, [field]: val }));

  /* ─── Auth ─── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  /* ─── Load batches & students ─── */
  useEffect(() => {
    if (!teacherId) return;
    getDocs(query(collection(db, 'batches'),  where('teacherId', '==', teacherId)))
      .then(s => setBatches(s.docs.map(d => ({ id: d.id, ...d.data() } as Batch))));
    getDocs(query(collection(db, 'students'), where('teacherId', '==', teacherId)))
      .then(s => setStudents(s.docs.map(d => ({ id: d.id, ...d.data() } as Student))));
  }, [teacherId]);

  /* ─── Auto-fill amount from batch monthly fee ─── */
  useEffect(() => {
    if (form.paymentType === 'monthly' && form.batchId) {
      const b = batches.find(b => b.id === form.batchId);
      if (b?.monthlyFee) set('amount', String(b.monthlyFee));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.batchId, form.paymentType]);

  /* ─── Submit ─── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teacherId) return;
    setSaving(true);
    try {
      const selectedStudent = students.find(s => s.id === form.studentId);
      const selectedBatch   = batches.find(b => b.id === form.batchId);
      const amountNum       = Number(form.amount);
      const monthLabel      = form.paymentType === 'one-time'
        ? (form.oneTimeDescription || 'One-Time Payment')
        : `${form.month} ${form.year}`;
      const monthKey = form.paymentType === 'one-time'
        ? `one-time`
        : `${form.year}-${String(MONTHS.indexOf(form.month) + 1).padStart(2, '0')}`;

      const feeRef = await addDoc(collection(db, 'fees'), {
        teacherId,
        paymentType:        form.paymentType,
        oneTimeDescription: form.paymentType === 'one-time' ? form.oneTimeDescription : '',
        studentId:          form.studentId,
        studentName:        selectedStudent?.name || '',
        batchId:            form.batchId,
        batchName:          selectedBatch?.name   || '',
        month:              monthKey,
        amount:             amountNum,
        paidAmount:         form.status === 'paid' ? amountNum : 0,
        status:             form.status,
        paymentMode:        form.paymentMode,
        dueDate:            new Date(form.dueDate),
        dueDateString:      form.dueDate,
        notes:              form.notes,
        payments:           [],
        createdAt:          serverTimestamp(),
        updatedAt:          serverTimestamp(),
        paidAt:             form.status === 'paid' ? serverTimestamp() : null,
      });

      if (form.status === 'paid') {
        const res = await fetch('/api/invoices/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teacherId,
            feeRecordId:        feeRef.id,
            paymentType:        form.paymentType,
            oneTimeDescription: form.paymentType === 'one-time' ? form.oneTimeDescription : '',
            studentId:          form.studentId,
            studentName:        selectedStudent?.name   || '',
            studentEmail:       selectedStudent?.email  || '',
            studentPhone:       selectedStudent?.phone  || '',
            batchId:            form.batchId,
            batchName:          selectedBatch?.name     || '',
            month:              monthLabel,
            amount:             amountNum,
            paidAmount:         amountNum,
            paymentMode:        form.paymentMode,
            paidAt:             new Date().toISOString(),
            notes:              form.notes,
          }),
        });

        if (res.ok) {
          const { invoiceId } = await res.json() as { invoiceId: string };
          router.push(`/invoices/${invoiceId}`);
          return;
        }
        setToast({ msg: 'Payment saved, but invoice generation failed. Try again from the fee record.', ok: false });
        setTimeout(() => router.push('/fees'), 3000);
        return;
      }
      router.push('/fees');
    } finally {
      setSaving(false);
    }
  }

  const isOneTime = form.paymentType === 'one-time';
  const isMonthly = form.paymentType === 'monthly';

  return (
    <div>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.ok ? 'var(--success)' : 'var(--danger)',
          color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)', maxWidth: 340, fontSize: 14,
        }}>
          {toast.msg}
        </div>
      )}

      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Record Fee Payment</h1>
            <p>Log a fee payment for a student</p>
          </div>
          <Link href="/fees" className="btn btn-outline">Cancel</Link>
        </div>
      </div>

      <div style={{ maxWidth: 620 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Step 1: Payment Type ── */}
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--primary)' }}>category</span>
              Payment Type
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {PAYMENT_TYPES.map(pt => {
                const active = form.paymentType === pt.key;
                return (
                  <button
                    key={pt.key}
                    type="button"
                    onClick={() => set('paymentType', pt.key)}
                    style={{
                      padding: '14px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                      background: active ? 'var(--primary-light)' : 'var(--bg-surface)',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                    }}
                  >
                    <span className="material-symbols-rounded filled" style={{
                      fontSize: 28, display: 'block', marginBottom: 6,
                      color: active ? 'var(--primary)' : 'var(--text-secondary)',
                    }}>{pt.icon}</span>
                    <div style={{ fontWeight: 600, fontSize: 13, color: active ? 'var(--primary-dark)' : 'var(--text-primary)', marginBottom: 3 }}>
                      {pt.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                      {pt.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Step 2: Student & Batch ── */}
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--primary)' }}>person</span>
              Student Details
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="form-label">Student *</label>
                <select className="select" required value={form.studentId} onChange={e => set('studentId', e.target.value)}>
                  <option value="">— Select student —</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">{isOneTime ? 'Batch / Programme (optional)' : 'Batch *'}</label>
                <select
                  className="select"
                  required={!isOneTime}
                  value={form.batchId}
                  onChange={e => set('batchId', e.target.value)}
                >
                  <option value="">— Select batch —</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name} — {b.subject}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Step 3: Amount & Period ── */}
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--primary)' }}>currency_rupee</span>
              {isOneTime ? 'One-Time Payment Details' : isMonthly ? 'Monthly Fee Details' : 'Batch Fee Details'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* One-time: description + quick presets */}
              {isOneTime && (
                <>
                  <div>
                    <label className="form-label">Payment For (Description) *</label>
                    <input
                      className="input"
                      required
                      placeholder="e.g. Internship Programme, Workshop, Exam Fee…"
                      value={form.oneTimeDescription}
                      onChange={e => set('oneTimeDescription', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Quick Amount</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {ONE_TIME_PRESETS.map(p => (
                        <button
                          key={p} type="button"
                          onClick={() => set('amount', String(p))}
                          style={{
                            padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                            border: `1.5px solid ${form.amount === String(p) ? 'var(--primary)' : 'var(--border)'}`,
                            background: form.amount === String(p) ? 'var(--primary-light)' : 'var(--bg-surface)',
                            color: form.amount === String(p) ? 'var(--primary)' : 'var(--text-secondary)',
                            cursor: 'pointer', transition: 'all 0.12s',
                          }}
                        >
                          ₹{p.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Monthly: month + year */}
              {!isOneTime && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">{isMonthly ? 'Month *' : 'Batch Period / Name *'}</label>
                    {isMonthly ? (
                      <select className="select" required value={form.month} onChange={e => set('month', e.target.value)}>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    ) : (
                      <input className="input" placeholder="e.g. Jan–Mar 2026" value={form.month} onChange={e => set('month', e.target.value)} />
                    )}
                  </div>
                  <div>
                    <label className="form-label">Year *</label>
                    <input className="input" type="number" min="2020" max="2099" required value={form.year} onChange={e => set('year', e.target.value)} />
                  </div>
                </div>
              )}

              {/* Amount + Due Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Amount (₹) *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-secondary)' }}>₹</span>
                    <input
                      className="input"
                      style={{ paddingLeft: 26 }}
                      type="number" placeholder="0" required min="1"
                      value={form.amount}
                      onChange={e => set('amount', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Due Date *</label>
                  <input className="input" type="date" required value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Step 4: Payment Status & Mode ── */}
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--primary)' }}>payments</span>
              Payment Status
            </div>

            {/* Status toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {([
                { val: 'pending', icon: 'schedule',      label: 'Pending',  color: '#F59E0B' },
                { val: 'paid',    icon: 'check_circle',  label: 'Paid',     color: '#16A34A' },
                { val: 'overdue', icon: 'warning',       label: 'Overdue',  color: '#DC2626' },
              ] as { val: Status; icon: string; label: string; color: string }[]).map(s => {
                const active = form.status === s.val;
                return (
                  <button
                    key={s.val} type="button"
                    onClick={() => set('status', s.val)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 18px', borderRadius: 24, fontSize: 13, fontWeight: 500,
                      border: `1.5px solid ${active ? s.color : 'var(--border)'}`,
                      background: active ? `${s.color}18` : 'var(--bg-surface)',
                      color: active ? s.color : 'var(--text-secondary)',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <span className="material-symbols-rounded filled icon-sm">{s.icon}</span>
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Payment mode — only when paid */}
            {form.status === 'paid' && (
              <div>
                <label className="form-label">Payment Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {PAYMENT_MODES.map(m => {
                    const active = form.paymentMode === m.value;
                    return (
                      <button
                        key={m.value} type="button"
                        onClick={() => set('paymentMode', m.value)}
                        style={{
                          padding: '10px 8px', borderRadius: 'var(--radius-sm)',
                          border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                          background: active ? 'var(--primary-light)' : 'var(--bg-surface)',
                          color: active ? 'var(--primary-dark)' : 'var(--text-secondary)',
                          fontSize: 12, fontWeight: 500, cursor: 'pointer',
                          transition: 'all 0.12s', textAlign: 'center',
                        }}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Invoice notice */}
            {form.status === 'paid' && (
              <div style={{
                marginTop: 14, background: 'var(--success-light)', border: '1px solid var(--success)',
                borderRadius: 'var(--radius-sm)', padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
              }}>
                <span className="material-symbols-rounded filled icon-sm" style={{ color: 'var(--success)' }}>receipt_long</span>
                <span style={{ color: 'var(--success)' }}>An invoice will be automatically generated after saving.</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card" style={{ paddingBottom: 16 }}>
            <label className="form-label">Notes (optional)</label>
            <textarea
              className="input"
              rows={2}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Any special instructions, reference number, or remarks…"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Link href="/fees" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ minWidth: 200 }}>
              <span className="material-symbols-rounded icon-sm">
                {saving ? 'sync' : form.status === 'paid' ? 'receipt_long' : 'save'}
              </span>
              {saving
                ? (form.status === 'paid' ? 'Saving & generating invoice…' : 'Saving…')
                : (form.status === 'paid' ? 'Save & Generate Invoice' : 'Record Payment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
