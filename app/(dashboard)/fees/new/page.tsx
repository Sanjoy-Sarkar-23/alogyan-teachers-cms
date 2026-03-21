'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Batch, Student } from '@/types';
import Link from 'next/link';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function NewFeePage() {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [batches, setBatches]     = useState<Batch[]>([]);
  const [students, setStudents]   = useState<Student[]>([]);
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({
    studentId: '', batchId: '', amount: '', month: MONTHS[new Date().getMonth()],
    dueDate: new Date().toISOString().split('T')[0], status: 'pending', notes: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    if (!teacherId) return;
    const bq = query(collection(db, 'batches'), where('teacherId', '==', teacherId));
    getDocs(bq).then(snap => setBatches(snap.docs.map(d => ({ id: d.id, ...d.data() } as Batch))));
    const sq = query(collection(db, 'students'), where('teacherId', '==', teacherId));
    getDocs(sq).then(snap => setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Student))));
  }, [teacherId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teacherId) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'fees'), {
        ...form, amount: Number(form.amount), teacherId, createdAt: serverTimestamp(),
        paidAt: form.status === 'paid' ? serverTimestamp() : null,
      });
      router.push('/fees');
    } finally {
      setSaving(false);
    }
  }

  const f = (field: keyof typeof form) => ({
    value: form[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1>Record Fee Payment</h1><p>Log a fee payment for a student</p></div>
          <Link href="/fees" className="btn btn-outline">Cancel</Link>
        </div>
      </div>

      <div style={{ maxWidth: 560 }}>
        <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Student *</label>
            <select className="select" required {...f('studentId')}>
              <option value="">— Select student —</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Batch</label>
            <select className="select" {...f('batchId')}>
              <option value="">— Select batch —</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name} — {b.subject}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Month *</label>
              <select className="select" required {...f('month')}>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Amount (₹) *</label>
              <input className="input" type="number" placeholder="0" required {...f('amount')} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Due Date *</label>
              <input className="input" type="date" required {...f('dueDate')} />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="select" {...f('status')}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea className="input" rows={2} style={{ resize: 'vertical', fontFamily: 'inherit' }} placeholder="Optional notes…" {...f('notes')} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <Link href="/fees" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
