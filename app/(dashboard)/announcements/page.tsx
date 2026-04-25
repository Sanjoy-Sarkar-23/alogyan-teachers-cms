'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Announcement } from '@/types';
import { LoadingSpinner, PageHeader, EmptyState } from '@/components/common';
import { timeAgo } from '@/lib/utils';
import { toastSuccess, toastError } from '@/lib/toast';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);
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
      toastSuccess('Announcement posted successfully!');
    } catch (error) {
      toastError(`Failed to post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <PageHeader 
        title="Announcements" 
        subtitle="Communicate with your students"
        action={
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <span className="material-symbols-rounded icon-sm">{showForm ? 'close' : 'campaign'}</span>
            {showForm ? 'Cancel' : 'New Announcement'}
          </button>
        }
      />

      {showForm && (
        <div className="card p-4 mb-4">
          <h3 className="font-semibold mb-4">New Announcement</h3>
          <form onSubmit={postAnnouncement} className="space-y-3">
            <div>
              <label className="form-label">Title</label>
              <input
                className="input w-full"
                placeholder="Announcement title…"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea
                className="input w-full resize-none"
                rows={4}
                placeholder="Write your message here…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Posting…' : 'Post Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : announcements.length === 0 ? (
        <EmptyState 
          icon="campaign"
          title="No announcements yet"
          description="Post an announcement to communicate with all your students."
          action={
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
              Post Announcement
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {announcements.map(a => (
            <div key={a.id} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-filled text-primary text-sm">campaign</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold">{a.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(a.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{a.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
