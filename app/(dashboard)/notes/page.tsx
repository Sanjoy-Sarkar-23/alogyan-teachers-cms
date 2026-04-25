'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '@/lib/firebase';
import type { Note, Batch } from '@/types';
import { 
  FileText, Image as ImageIcon, File, FolderOpen, Plus, Search, GripVertical,
  ChevronRight, ChevronDown, MoreVertical, Trash2, Edit, Download, Eye,
  Upload, X, Save, BookOpen, Layers, Clock, Check
} from 'lucide-react';

type NoteType = 'pdf' | 'image' | 'text' | 'link';

interface NoteItem extends Note {
  order?: number;
}

interface SubjectGroup {
  name: string;
  notes: NoteItem[];
  expanded: boolean;
}

export default function NotesPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<NoteType>('pdf');
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formBatchId, setFormBatchId] = useState('');
  const [formLinkUrl, setFormLinkUrl] = useState('');
  const [formTextContent, setFormTextContent] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  const fetchBatches = useCallback(async () => {
    if (!teacherId) return;
    const q = query(collection(db, 'batches'), where('teacherId', '==', teacherId));
    const snap = await getDocs(q);
    setBatches(snap.docs.map(d => ({ id: d.id, ...d.data() } as Batch)));
  }, [teacherId]);

  const fetchNotes = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'notes'), where('teacherId', '==', teacherId), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as NoteItem)));
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { 
    if (teacherId) {
      fetchBatches();
      fetchNotes();
    }
  }, [teacherId, fetchBatches, fetchNotes]);

  // Get unique subjects from notes and batches
  const subjects = [...new Set([...notes.map(n => n.subject).filter(Boolean), ...batches.map(b => b.subject).filter(Boolean)])] as string[];

  // Group notes by subject
  const groupedNotes = subjects.reduce((acc, subject) => {
    acc[subject] = notes.filter(n => n.subject === subject && (!selectedBatch || n.batchId === selectedBatch));
    return acc;
  }, {} as Record<string, NoteItem[]>);

  // Filter by search
  const filteredNotes = search 
    ? notes.filter(n => 
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.subject?.toLowerCase().includes(search.toLowerCase()) ||
        n.description?.toLowerCase().includes(search.toLowerCase())
      )
    : notes.filter(n => !selectedBatch || n.batchId === selectedBatch);

  const openCreateModal = (type: NoteType) => {
    setModalType(type);
    setEditingNote(null);
    setFormTitle('');
    setFormDescription('');
    setFormSubject('');
    setFormBatchId(selectedBatch || '');
    setFormLinkUrl('');
    setFormTextContent('');
    setUploadFile(null);
    setUploadProgress(0);
    setShowModal(true);
  };

  const openEditModal = (note: NoteItem) => {
    setModalType(note.type as NoteType);
    setEditingNote(note);
    setFormTitle(note.title);
    setFormDescription(note.description || '');
    setFormSubject(note.subject || '');
    setFormBatchId(note.batchId || '');
    setFormLinkUrl(note.linkUrl || '');
    setFormTextContent((note as any).textContent || '');
    setUploadFile(null);
    setUploadProgress(0);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const saveNote = async () => {
    if (!teacherId || !formTitle) return;
    setSaving(true);
    try {
      let fileUrl = editingNote?.fileUrl;
      let fileType: NoteType = modalType;
      let fileSize = (editingNote as any)?.fileSize;

      if (uploadFile) {
        const storageRef = ref(storage, `notes/${teacherId}/${Date.now()}_${uploadFile.name}`);
        await uploadBytes(storageRef, uploadFile);
        fileUrl = await getDownloadURL(storageRef);
        fileType = uploadFile.type as NoteType;
        fileSize = uploadFile.size;
      }

      const noteData = {
        teacherId,
        title: formTitle,
        description: formDescription || null,
        subject: formSubject || null,
        batchId: formBatchId || null,
        type: modalType,
        fileType: fileType,
        fileUrl: fileUrl,
        linkUrl: modalType === 'link' ? formLinkUrl : null,
        textContent: modalType === 'text' ? formTextContent : null,
        fileSize: fileSize,
        order: editingNote?.order || notes.length,
        createdAt: editingNote ? (editingNote as any).createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (editingNote) {
        await updateDoc(doc(db, 'notes', editingNote.id), noteData);
      } else {
        await addDoc(collection(db, 'notes'), noteData);
      }

      setShowModal(false);
      fetchNotes();
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    await deleteDoc(doc(db, 'notes', noteId));
    fetchNotes();
  };

  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    setDraggedNote(noteId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetNoteId: string) => {
    e.preventDefault();
    if (!draggedNote || draggedNote === targetNoteId) return;

    const newNotes = [...notes];
    const draggedIndex = newNotes.findIndex(n => n.id === draggedNote);
    const targetIndex = newNotes.findIndex(n => n.id === targetNoteId);
    
    const [draggedItem] = newNotes.splice(draggedIndex, 1);
    newNotes.splice(targetIndex, 0, draggedItem);
    
    setNotes(newNotes);
    setDraggedNote(null);

    // Update order in DB
    for (let i = 0; i < newNotes.length; i++) {
      await updateDoc(doc(db, 'notes', newNotes[i].id), { order: i });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'text': return <File className="w-5 h-5" />;
      case 'link': return <BookOpen className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-600';
      case 'image': return 'bg-purple-100 text-purple-600';
      case 'text': return 'bg-blue-100 text-blue-600';
      case 'link': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Notes & Resources</h1>
            <p className="text-sm text-gray-500">{notes.length} items • {subjects.length} subjects</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openCreateModal('text')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" /> Text Note
            </button>
            <button onClick={() => openCreateModal('pdf')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm">
              <Upload className="w-4 h-4" /> Upload File
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* All Notes */}
          <div className="mb-4">
            <button
              onClick={() => setSelectedBatch(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedBatch === null ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              All Notes
              <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded-full">{notes.length}</span>
            </button>
          </div>

          {/* Batches */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Batches</h3>
            {batches.map(batch => (
              <button
                key={batch.id}
                onClick={() => setSelectedBatch(batch.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedBatch === batch.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                {batch.name}
                <span className="ml-auto text-xs text-gray-400">{batch.studentIds?.length || 0}</span>
              </button>
            ))}
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Subjects</h3>
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => setFormSubject(subject)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
              >
                <BookOpen className="w-4 h-4" />
                {subject}
                <span className="ml-auto text-xs text-gray-400">{groupedNotes[subject]?.length || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-500 mb-4">Create your first note or upload a file to get started</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => openCreateModal('text')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Create Text Note
                </button>
                <button onClick={() => openCreateModal('pdf')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                  Upload File
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, note.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, note.id)}
                  className={`bg-white rounded-xl border border-gray-200 p-4 cursor-move transition-all hover:shadow-md ${
                    draggedNote === note.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
                    <div className={`p-2 rounded-lg ${getTypeColor(note.type || '')}`}>
                      {getTypeIcon(note.type || '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{note.title}</h4>
                      <p className="text-sm text-gray-500">{note.subject}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditModal(note)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteNote(note.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {note.description && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{note.description}</p>
                  )}

                  {note.type === 'text' && (note as any).textContent && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600 line-clamp-3">
                      {(note as any).textContent}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-400">
                      {note.fileSize ? `${(note.fileSize / 1024 / 1024).toFixed(1)} MB` : ''}
                      {(note as any).createdAt?.toDate?.() ? new Date((note as any).createdAt.toDate()).toLocaleDateString() : ''}
                    </div>
                    {note.fileUrl && (
                      <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                {editingNote ? 'Edit Note' : modalType === 'text' ? 'Create Text Note' : modalType === 'link' ? 'Add Link' : 'Upload File'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Type Selector */}
              {!editingNote && (
                <div className="flex gap-2">
                  {(['text', 'pdf', 'image', 'link'] as NoteType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setModalType(type)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                        modalType === type ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {getTypeIcon(type)}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter note title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Subject & Batch */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g., Mathematics"
                    list="subjects"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <datalist id="subjects">
                    {subjects.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <select
                    value={formBatchId}
                    onChange={(e) => setFormBatchId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Batches</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              {/* File Upload */}
              {(modalType === 'pdf' || modalType === 'image') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {modalType === 'pdf' ? 'PDF File' : 'Image File'}
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    {uploadFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <span className="text-sm font-medium">{uploadFile.name}</span>
                        <button onClick={(e) => { e.stopPropagation(); setUploadFile(null); }} className="p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Click to upload {modalType === 'pdf' ? 'PDF' : 'image'}</p>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept={modalType === 'pdf' ? '.pdf' : 'image/*'} onChange={handleFileChange} className="hidden" />
                </div>
              )}

              {/* Link URL */}
              {modalType === 'link' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="url"
                    value={formLinkUrl}
                    onChange={(e) => setFormLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Text Content */}
              {modalType === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={formTextContent}
                    onChange={(e) => setFormTextContent(e.target.value)}
                    placeholder="Write your notes here..."
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm">
                Cancel
              </button>
              <button
                onClick={saveNote}
                disabled={saving || !formTitle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 text-sm"
              >
                {saving ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingNote ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
