'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Batch } from '@/types';
import Link from 'next/link';

export default function NewTestPage() {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [batches, setBatches]     = useState<Batch[]>([]);
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({
    title: '', subject: '', batchId: '',
    date: new Date().toISOString().split('T')[0],
    totalMarks: '', passingMarks: '', duration: '', description: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    if (!teacherId) return;
    const q = query(collection(db, 'batches'), where('teacherId', '==', teacherId));
    getDocs(q).then(snap => setBatches(snap.docs.map(d => ({ id: d.id, ...d.data() } as Batch))));
  }, [teacherId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teacherId) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'tests'), {
        ...form,
        totalMarks:   Number(form.totalMarks) || null,
        passingMarks: Number(form.passingMarks) || null,
        duration:     Number(form.duration) || null,
        teacherId,
        createdAt: serverTimestamp(),
      });
      router.push('/tests');
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
          <div><h1>Schedule Test</h1><p>Create a new test or quiz</p></div>
          <Link href="/tests" className="btn btn-outline">Cancel</Link>
        </div>
      </div>

      <div style={{ maxWidth: 560 }}>
        <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Test Title *</label>
            <input className="input" placeholder="e.g. Chapter 5 Quiz, Mid-term…" required {...f('title')} />
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Subject</label>
              <input className="input" placeholder="e.g. Physics" {...f('subject')} />
            </div>
            <div>
              <label className="form-label">Date *</label>
              <input className="input" type="date" required {...f('date')} />
            </div>
          </div>
          <div>
            <label className="form-label">Batch</label>
            <select className="select" {...f('batchId')}>
              <option value="">— All students / select later —</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name} — {b.subject}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Total Marks</label>
              <input className="input" type="number" placeholder="100" {...f('totalMarks')} />
            </div>
            <div>
              <label className="form-label">Passing Marks</label>
              <input className="input" type="number" placeholder="40" {...f('passingMarks')} />
            </div>
          </div>
          <div>
            <label className="form-label">Duration (minutes)</label>
            <input className="input" type="number" placeholder="60" {...f('duration')} />
          </div>
          <div>
            <label className="form-label">Description / Topics</label>
            <textarea className="input" rows={3} style={{ resize: 'vertical', fontFamily: 'inherit' }} placeholder="Topics covered, instructions…" {...f('description')} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <Link href="/tests" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Schedule Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
