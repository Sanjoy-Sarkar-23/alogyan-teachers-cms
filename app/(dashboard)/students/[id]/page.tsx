'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, addDoc, doc, getDoc, setDoc, serverTimestamp, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Batch } from '@/types';
import Link from 'next/link';

export default function StudentFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEdit = id && id !== 'new';

  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    parentPhone: '',
    address: '',
    grade: '',
    batchIds: [] as string[],
    notes: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    if (!teacherId) return;
    const q = query(collection(db, 'batches'), where('teacherId', '==', teacherId));
    getDocs(q).then(snap => setBatches(snap.docs.map(d => ({ id: d.id, ...d.data() } as Batch))));
    if (isEdit) {
      getDoc(doc(db, 'students', id)).then(snap => {
        if (snap.exists()) setForm({ ...form, ...snap.data() });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teacherId) return;
    setSaving(true);

    try {
      if (isEdit) {
        await setDoc(
          doc(db, 'students', id),
          { ...form, teacherId, updatedAt: serverTimestamp() },
          { merge: true }
        );
        console.log(id);
        // 2️⃣ Add studentId to selected batches
        for (const batchId of form.batchIds) {
          await updateDoc(doc(db, "batches", batchId), {
            studentIds: arrayUnion(id)
          });
        }
      } else {
        // 1️⃣ Create student first
        const studentRef = await addDoc(collection(db, 'students'), {
          ...form,
          teacherId,
          createdAt: serverTimestamp(),
        });

        const studentId = studentRef.id;
        console.log(studentId);
        // 2️⃣ Add studentId to selected batches
        for (const batchId of form.batchIds) {
          await updateDoc(doc(db, "batches", batchId), {
            studentIds: arrayUnion(studentId)
          });
        }
      }

      router.push('/students');
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
          <div>
            <h1>{isEdit ? 'Edit Student' : 'Add Student'}</h1>
            <p>{isEdit ? 'Update student information' : 'Register a new student'}</p>
          </div>
          <Link href="/students" className="btn btn-outline">Cancel</Link>
        </div>
      </div>

      <div style={{ maxWidth: 600 }}>
        <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Full Name *</label>
            <input className="input" placeholder="Student's full name" required {...f('name')} />
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Email</label>
              <input className="input" type="email" placeholder="student@email.com" {...f('email')} />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input className="input" placeholder="+91…" {...f('phone')} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Parent&apos;s Phone</label>
              <input className="input" placeholder="+91…" {...f('parentPhone')} />
            </div>
            <div>
              <label className="form-label">Grade / Class</label>
              <input className="input" placeholder="e.g. 10th, JEE, NEET" {...f('grade')} />
            </div>
          </div>
          <div>
            <label className="form-label">Default Batch</label>
            <select
              className="select"
              multiple
              value={form.batchIds}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, o => o.value);
                setForm(prev => ({ ...prev, batchIds: values }));
              }}
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} — {b.subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Address</label>
            <input className="input" placeholder="Student's address" {...f('address')} />
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea className="input" rows={3} placeholder="Any additional notes…" style={{ resize: 'vertical', fontFamily: 'inherit' }} {...f('notes')} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <Link href="/students" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
