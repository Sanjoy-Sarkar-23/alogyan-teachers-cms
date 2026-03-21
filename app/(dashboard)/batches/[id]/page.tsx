'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, addDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import Link from 'next/link';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function BatchFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEdit = id && id !== 'new';
  const defaultForm = {
    name: '',
    subject: '',
    grade: '',
    monthlyFee: '',
    schedule: [] as string[],
    startTime: '',
    endTime: '',
    room: '',
    description: '',
  };
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  useEffect(() => {
    if (!isEdit || !teacherId) return;
    getDoc(doc(db, 'batches', id)).then(snap => {
      if (snap.exists()) {
        setForm({
          ...defaultForm,
          ...snap.data(),
        });
      }
    });
  }, [isEdit, teacherId, id]);

  function toggleDay(day: string) {
    setForm(prev => ({
      ...prev,
      schedule: prev.schedule.includes(day)
        ? prev.schedule.filter(d => d !== day)
        : [...prev.schedule, day],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!teacherId) return;
    setSaving(true);
    const data = { ...form, monthlyFee: Number(form.monthlyFee), teacherId }; try {
      if (isEdit) {
        await setDoc(doc(db, 'batches', id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      } else {
        await addDoc(collection(db, 'batches'), { ...data, studentIds: [], createdAt: serverTimestamp() });
      }
      router.push('/batches');
    } finally {
      setSaving(false);
    }
  }

  const f = (field: keyof typeof form) => ({
    value: form[field] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>{isEdit ? 'Edit Batch' : 'Create Batch'}</h1>
            <p>{isEdit ? 'Update batch details' : 'Set up a new class batch'}</p>
          </div>
          <Link href="/batches" className="btn btn-outline">Cancel</Link>
        </div>
      </div>

      <div style={{ maxWidth: 600 }}>
        <form className="card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-row">
            <div>
              <label className="form-label">Batch Name *</label>
              <input className="input" placeholder="e.g. JEE Morning Batch" required {...f('name')} />
            </div>
            <div>
              <label className="form-label">Subject *</label>
              <input className="input" placeholder="e.g. Physics" required {...f('subject')} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Grade / Level</label>
              <input className="input" placeholder="e.g. 11th, JEE, NEET" {...f('grade')} />
            </div>
            <div>
              <label className="form-label">Monthly Fee (₹)</label>
              <input className="input" type="number" placeholder="0" {...f('monthlyFee')} />
            </div>
          </div>

          <div>
            <label className="form-label">Schedule Days</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {DAYS.map(day => (
                <button key={day} type="button"
                  className={`btn btn-sm ${form.schedule.includes(day) ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => toggleDay(day)}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Start Time</label>
              <input className="input" type="time" {...f('startTime')} />
            </div>
            <div>
              <label className="form-label">End Time</label>
              <input className="input" type="time" {...f('endTime')} />
            </div>
          </div>

          <div>
            <label className="form-label">Room / Location</label>
            <input className="input" placeholder="e.g. Room 101, Online" {...f('room')} />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea className="input" rows={3} style={{ resize: 'vertical', fontFamily: 'inherit' }} placeholder="Any notes about this batch…" {...f('description')} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <Link href="/batches" className="btn btn-outline">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Update Batch' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
