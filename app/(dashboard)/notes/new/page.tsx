'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Student, Batch } from '@/types';
import Link from 'next/link';

export default function NewNotePage() {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [students, setStudents]   = useState<Student[]>([]);
  const [batches, setBatches]     = useState<Batch[]>([]);
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({
    studentId: '', batchId: '', content: '',
    type: 'general', isPrivate: true,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    if (!teacherId) return;
    const sq = query(collection(db, 'students'), where('teacherId', '==', teacherId));
    getDocs(sq).then(snap => setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Student))));
    const bq = query(collection(db, 'batches'), where('teacherId', '==', teacherId));
    getDocs(bq).then(snap => setBatches(snap.docs.map(d => ({ id: d.id, ...d.data() } as Batch))));
  }, [teacherId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teacherId || !form.content.trim()) return;
    setSaving(true);
    try {
      const student = students.find(s => s.id === form.studentId);
      await addDoc(collection(db, 'notes'), {
        ...form, teacherId,
        studentName: student?.name ?? '',
        createdAt: serverTimestamp(),
      });
      router.push('/notes');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1>Add Note</h1><p>Record a note about a student</p></div>
          <Link href="/notes" className="btn btn-outline">Cancel</Link>
        </div>
      </div>

      <div style={{ maxWidth: 560 }}>
        <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Student</label>
            <select className="select" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}>
              <option value="">— General note (no specific student) —</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Batch</label>
            <select className="select" value={form.batchId} onChange={e => setForm(f => ({ ...f, batchId: e.target.value }))}>
              <option value="">— No specific batch —</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Note Type</label>
            <select className="select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="general">General</option>
              <option value="behavioral">Behavioral</option>
              <option value="academic">Academic</option>
              <option value="fee">Fee Related</option>
              <option value="parent">Parent Communication</option>
            </select>
          </div>
          <div>
            <label className="form-label">Note *</label>
            <textarea
              className="input"
              rows={6}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Write your observation or note here…"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              required
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="private" checked={form.isPrivate} onChange={e => setForm(f => ({ ...f, isPrivate: e.target.checked }))} style={{ width: 16, height: 16 }} />
            <label htmlFor="private" style={{ fontSize: 14, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Private note (only visible to you)
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <Link href="/notes" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
