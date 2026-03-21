'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Announcement } from '@/types';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [teacherId, setTeacherId]         = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', message: '', targetBatchIds: [] as string[] });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'announcements'), where('teacherId', '==', teacherId), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement)));
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  async function postAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!teacherId || !form.title.trim() || !form.message.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'announcements'), {
        ...form,
        teacherId,
        createdAt: serverTimestamp(),
      });
      setForm({ title: '', message: '', targetBatchIds: [] });
      setShowForm(false);
      await fetchAnnouncements();
    } finally {
      setSaving(false);
    }
  }

  const timeAgo = (ts: unknown) => {
    if (!ts) return '';
    const d = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as string);
    const secs = Math.floor((Date.now() - d.getTime()) / 1000);
    if (secs < 60) return 'just now';
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1>Announcements</h1><p>Communicate with your students</p></div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <span className="material-symbols-rounded icon-sm">{showForm ? 'close' : 'campaign'}</span>
            {showForm ? 'Cancel' : 'New Announcement'}
          </button>
        </div>
      </div>

      {/* Compose Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>New Announcement</h3>
          <form onSubmit={postAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="form-label">Title</label>
              <input
                className="input"
                placeholder="Announcement title…"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea
                className="input"
                rows={4}
                placeholder="Write your message here…"
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                required
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Posting…' : 'Post Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="empty-state"><span className="material-symbols-rounded" style={{ fontSize: 36 }}>autorenew</span></div>
      ) : announcements.length === 0 ? (
        <div className="card"><div className="empty-state">
          <span className="material-symbols-rounded">campaign</span>
          <h3>No announcements yet</h3>
          <p>Post an announcement to communicate with all your students.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>Post Announcement</button>
        </div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {announcements.map(a => (
            <div className="card" key={a.id}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span className="material-symbols-rounded filled" style={{ color: 'var(--primary)', fontSize: 20 }}>campaign</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-disabled)', flexShrink: 0, marginLeft: 12 }}>{timeAgo(a.createdAt)}</div>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>{a.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
