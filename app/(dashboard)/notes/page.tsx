'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Note } from '@/types';
import Link from 'next/link';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  const fetchNotes = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'notes'), where('teacherId', '==', teacherId), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Note)));
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.subject.toLowerCase().includes(search.toLowerCase())
  );

  const fileIcon = (type: string) => {
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('video')) return 'videocam';
    if (type.includes('image')) return 'image';
    return 'insert_drive_file';
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h1>Notes & Resources</h1><p>{notes.length} resource{notes.length !== 1 ? 's' : ''} uploaded</p></div>
          <Link href="/notes/upload" className="btn btn-primary">
            <span className="material-symbols-rounded icon-sm">upload_file</span>
            Upload File
          </Link>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span className="material-symbols-rounded icon-sm" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-disabled)' }}>search</span>
        <input className="input" style={{ paddingLeft: 34, maxWidth: 320 }} placeholder="Search by title or subject…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="empty-state"><span className="material-symbols-rounded" style={{ fontSize: 36 }}>autorenew</span></div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="material-symbols-rounded">folder_open</span>
            <h3>{notes.length === 0 ? 'No files uploaded yet' : 'No results'}</h3>
            <p>{notes.length === 0 ? 'Upload PDFs, videos, or images for your students.' : 'Try a different search term.'}</p>
            {notes.length === 0 && <Link href="/notes/upload" className="btn btn-primary btn-sm">Upload File</Link>}
          </div>
        </div>
      ) : (
        <div className="grid-3" style={{ gap: 16 }}>
          {filtered.map(note => (
            <div className="card" key={note.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span className="material-symbols-rounded filled" style={{ color: 'var(--primary)', fontSize: 22 }}>{fileIcon(note.type)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, color: 'var(--text-primary)' }}>{note.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{note.subject}</div>
                </div>
              </div>

              {note.description && (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, flex: 1 }}>
                  {note.description.slice(0, 80)}{note.description.length > 80 ? '…' : ''}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ fontSize: 11, color: 'var(--text-disabled)' }}>
                  {note.fileSize ? `${(note.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}
                </div>
                <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                  <span className="material-symbols-rounded icon-sm">download</span>
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
