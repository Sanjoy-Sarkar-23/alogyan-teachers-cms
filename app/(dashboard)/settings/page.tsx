'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  doc, getDoc, setDoc, collection, query, where,
  getDocs, addDoc, updateDoc, deleteDoc, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { db, auth, storage } from '@/lib/firebase';
import type { Teacher, InstituteProfile, Designation } from '@/types';

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */

async function uploadFile(
  teacherId: string,
  slot: 'logo' | 'signature',
  file: File,
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'png';
  const storageRef = ref(storage, `teachers/${teacherId}/${slot}.${ext}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/* Toast helper */
function useToast() {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const show = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

/* Image picker drop-zone */
function ImagePicker({
  id, label, hint, previewUrl, width = 80, height = 80, icon, onFileChange,
}: {
  id: string; label: string; hint: string; previewUrl: string;
  width?: number; height?: number; icon: string;
  onFileChange: (file: File, preview: string) => void;
}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div
        className="img-picker-zone"
        onClick={() => document.getElementById(id)?.click()}
        role="button" tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && document.getElementById(id)?.click()}
      >
        <div className="img-picker-preview" style={{ width, height }}>
          {previewUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={previewUrl} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            : <span className="material-symbols-rounded" style={{ fontSize: Math.floor(width * 0.45), color: 'var(--text-disabled)' }}>{icon}</span>
          }
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
            {previewUrl ? 'Click to replace' : 'Click to upload'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{hint}</div>
        </div>
        <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--text-secondary)' }}>upload</span>
      </div>
      <input
        id={id} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) onFileChange(file, URL.createObjectURL(file));
          e.target.value = '';
        }}
      />
    </div>
  );
}

/* Section header */
function SectionHead({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="material-symbols-rounded icon-sm filled" style={{ color: 'var(--primary)' }}>{icon}</span>
        {title}
      </h3>
      {sub && <p style={{ fontSize: 13, marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

/* Label + input helper */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DEFAULT DATA
══════════════════════════════════════════════════════════ */

const DEFAULT_DESIGNATIONS = [
  'Academic Head', 'Senior Teacher', 'Mathematics Teacher',
  'Physics Teacher', 'Chemistry Teacher', 'Biology Teacher',
  'English Teacher', 'Computer Science Teacher', 'Class Teacher', 'Tutor',
];

const INSTITUTE_TYPES = [
  'Coaching Centre', 'School', 'Tuition Centre', 'College',
  'Online Academy', 'Ed-Tech Platform', 'Training Institute', 'Other',
];

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry','Others',
];

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */

type Tab = 'profile' | 'company' | 'designations' | 'preferences';

export default function SettingsPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [activeTab,  setActiveTab]  = useState<Tab>('profile');
  const { toast, show: showToast }  = useToast();

  /* ─── Auth ─── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setTeacherId(u?.uid ?? null));
    return unsub;
  }, []);

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.ok ? 'var(--success)' : 'var(--danger)',
          color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)', fontSize: 14,
          display: 'flex', gap: 8, alignItems: 'center', maxWidth: 360,
        }}>
          <span className="material-symbols-rounded icon-sm">
            {toast.ok ? 'check_circle' : 'error'}
          </span>
          {toast.msg}
        </div>
      )}

      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your profile, institute details, invoice branding, and designations.</p>
      </div>

      {/* ── Tab bar ── */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24,
        background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
        padding: 4, width: 'fit-content', flexWrap: 'wrap',
      }}>
        {([
          { key: 'profile',      icon: 'person',       label: 'My Profile' },
          { key: 'company',      icon: 'business',     label: 'Company Profile' },
          { key: 'designations', icon: 'badge',        label: 'Designations' },
          { key: 'preferences',  icon: 'tune',         label: 'Preferences' },
        ] as { key: Tab; icon: string; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              background: activeTab === t.key ? '#fff'                : 'transparent',
              color:      activeTab === t.key ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow:  activeTab === t.key ? 'var(--shadow-sm)'    : 'none',
            }}
          >
            <span className="material-symbols-rounded icon-sm" style={{
              color: activeTab === t.key ? 'var(--primary)' : 'inherit',
            }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab panels ── */}
      {teacherId && activeTab === 'profile'      && <ProfileTab      teacherId={teacherId} showToast={showToast} />}
      {teacherId && activeTab === 'company'      && <CompanyTab      teacherId={teacherId} showToast={showToast} />}
      {teacherId && activeTab === 'designations' && <DesignationsTab teacherId={teacherId} showToast={showToast} />}
      {activeTab === 'preferences' && <PreferencesTab />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 1 — MY PROFILE
══════════════════════════════════════════════════════════ */

function ProfileTab({ teacherId, showToast }: { teacherId: string; showToast: (m: string, ok?: boolean) => void }) {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSig,  setUploadingSig]  = useState(false);

  const logoFileRef = useRef<File | null>(null);
  const sigFileRef  = useRef<File | null>(null);

  const [form, setForm] = useState({
    name: '', instituteName: '', phone: '', email: '', subject: '', title: '',
    logoURL: '', signatureURL: '',
  });

  useEffect(() => {
    getDoc(doc(db, 'teachers', teacherId)).then(snap => {
      if (!snap.exists()) return;
      const d = snap.data() as Partial<Teacher>;
      setForm(prev => ({
        ...prev,
        name:          d.name          ?? '',
        instituteName: d.instituteName ?? '',
        phone:         d.phone         ?? '',
        email:         d.email         ?? '',
        subject:       d.subject       ?? '',
        title:         d.title         ?? '',
        logoURL:       (d as Teacher & { logoURL?: string }).logoURL       ?? '',
        signatureURL:  (d as Teacher & { signatureURL?: string }).signatureURL  ?? '',
      }));
    });
  }, [teacherId]);

  const F = (field: keyof typeof form) => ({
    value: form[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  async function handleSave() {
    setSaving(true);
    try {
      let { logoURL, signatureURL } = form;

      if (logoFileRef.current) {
        setUploadingLogo(true);
        logoURL = await uploadFile(teacherId, 'logo', logoFileRef.current);
        logoFileRef.current = null;
        setUploadingLogo(false);
      }
      if (sigFileRef.current) {
        setUploadingSig(true);
        signatureURL = await uploadFile(teacherId, 'signature', sigFileRef.current);
        sigFileRef.current = null;
        setUploadingSig(false);
      }

      await setDoc(doc(db, 'teachers', teacherId), {
        uid: teacherId, name: form.name, instituteName: form.instituteName,
        phone: form.phone, email: form.email, subject: form.subject,
        title: form.title, logoURL, signatureURL,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      if (auth.currentUser && form.name) {
        await updateProfile(auth.currentUser, { displayName: form.name });
      }

      setForm(prev => ({ ...prev, logoURL, signatureURL }));
      setSaved(true); setTimeout(() => setSaved(false), 2500);
      showToast('Profile saved!');
    } catch { showToast('Save failed. Try again.', false); }
    finally { setSaving(false); setUploadingLogo(false); setUploadingSig(false); }
  }

  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card">
        <SectionHead icon="person" title="Personal Details" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Full Name *">
              <input className="input" placeholder="Your name" {...F('name')} />
            </Field>
            <Field label="Title / Designation">
              <input className="input" placeholder="e.g. Academic Head" {...F('title')} />
            </Field>
          </div>
          <Field label="Institute / School Name">
            <input className="input" placeholder="e.g. Alogyan Coaching Centre" {...F('instituteName')} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Phone">
              <input className="input" type="tel" placeholder="+91…" {...F('phone')} />
            </Field>
            <Field label="Email">
              <input className="input" type="email" placeholder="email@example.com" {...F('email')} />
            </Field>
          </div>
          <Field label="Subject Specialisation">
            <input className="input" placeholder="e.g. Mathematics, Physics" {...F('subject')} />
          </Field>
        </div>
      </div>

      <div className="card">
        <SectionHead
          icon="receipt_long"
          title="Invoice Branding"
          sub="These images appear on every printed invoice. Use transparent PNG for best results."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ImagePicker
            id="logo-input"
            label="Institute Logo"
            hint="PNG, JPG or SVG · Max 2 MB · Recommended: 200×200px"
            previewUrl={form.logoURL}
            width={80} height={80}
            icon="business"
            onFileChange={(file, preview) => {
              logoFileRef.current = file;
              setForm(prev => ({ ...prev, logoURL: preview }));
            }}
          />
          <ImagePicker
            id="sig-input"
            label="Signature Image"
            hint="PNG with transparent background · Recommended: 400×150px"
            previewUrl={form.signatureURL}
            width={160} height={64}
            icon="draw"
            onFileChange={(file, preview) => {
              sigFileRef.current = file;
              setForm(prev => ({ ...prev, signatureURL: preview }));
            }}
          />
          <div style={{
            background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', padding: '10px 14px',
            display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13,
          }}>
            <span className="material-symbols-rounded icon-sm filled" style={{ color: 'var(--primary)', flexShrink: 0 }}>info</span>
            <span style={{ color: 'var(--primary-dark)' }}>
              Logo appears top-left on invoices. Signature appears at the bottom as proof of authorisation.
            </span>
          </div>
          {(uploadingLogo || uploadingSig) && (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="material-symbols-rounded icon-sm">hourglass_empty</span>
              {uploadingLogo ? 'Uploading logo…' : 'Uploading signature…'}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
          onClick={handleSave} disabled={saving} style={{ minWidth: 150 }}
        >
          <span className="material-symbols-rounded icon-sm">{saving ? 'sync' : saved ? 'check_circle' : 'save'}</span>
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 2 — COMPANY PROFILE
══════════════════════════════════════════════════════════ */

const BLANK_COMPANY: Omit<InstituteProfile, 'teacherId' | 'updatedAt'> = {
  name: '', tagline: '', type: '', registrationNo: '', gstin: '', pan: '',
  phone: '', altPhone: '', email: '', website: '',
  addressLine1: '', addressLine2: '', city: '', state: '', pin: '', country: 'India',
  logoURL: '',
};

function CompanyTab({ teacherId, showToast }: { teacherId: string; showToast: (m: string, ok?: boolean) => void }) {
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [form, setForm] = useState(BLANK_COMPANY);

  useEffect(() => {
    getDoc(doc(db, 'institutes', teacherId)).then(snap => {
      if (snap.exists()) setForm({ ...BLANK_COMPANY, ...snap.data() as Partial<typeof BLANK_COMPANY> });
    });
  }, [teacherId]);

  const F = (field: keyof typeof form) => ({
    value: form[field] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value })),
  });

  async function handleSave() {
    setSaving(true);
    try {
      let { logoURL } = form;

      if (logoFile) {
        const ext = logoFile.name.split('.').pop() ?? 'png';
        const storageRef = ref(storage, `teachers/${teacherId}/company_logo.${ext}`);
        await uploadBytes(storageRef, logoFile);
        logoURL = await getDownloadURL(storageRef);
        setLogoFile(null);
      }

      const data = { ...form, logoURL, teacherId, updatedAt: serverTimestamp() };
      await setDoc(doc(db, 'institutes', teacherId), data, { merge: true });

      // Also sync institute name + logo to teacher doc for invoice use
      await setDoc(doc(db, 'teachers', teacherId), {
        instituteName: form.name,
        ...(logoURL ? { logoURL } : {}),
      }, { merge: true });

      setForm(prev => ({ ...prev, logoURL }));
      setSaved(true); setTimeout(() => setSaved(false), 2500);
      showToast('Company profile saved!');
    } catch { showToast('Save failed. Try again.', false); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ─ Identity ─ */}
      <div className="card">
        <SectionHead icon="business" title="Institute Identity" />
        <div style={{ display: 'flex', gap: 20 }}>

          {/* Logo picker (left) */}
          <div style={{ flexShrink: 0 }}>
            <label className="form-label">Logo</label>
            <div
              className="img-picker-zone"
              style={{ flexDirection: 'column', width: 120, height: 120, padding: 12, textAlign: 'center', gap: 6 }}
              onClick={() => document.getElementById('company-logo-input')?.click()}
            >
              <div style={{
                width: 80, height: 80, borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', margin: '0 auto',
              }}>
                {form.logoURL
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={form.logoURL} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  : <span className="material-symbols-rounded" style={{ fontSize: 36, color: 'var(--text-disabled)' }}>business</span>
                }
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Click to upload</span>
            </div>
            <input
              id="company-logo-input" type="file" style={{ display: 'none' }}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                setLogoFile(file);
                setForm(prev => ({ ...prev, logoURL: URL.createObjectURL(file) }));
                e.target.value = '';
              }}
            />
          </div>

          {/* Name + tagline fields */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Institute Name *">
              <input className="input" placeholder="e.g. Alogyan Coaching Centre" {...F('name')} />
            </Field>
            <Field label="Tagline">
              <input className="input" placeholder="e.g. Empowering future engineers" {...F('tagline')} />
            </Field>
            <Field label="Institute Type">
              <select className="select" {...F('type')}>
                <option value="">— Select type —</option>
                {INSTITUTE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        </div>
      </div>

      {/* ─ Legal / Registration ─ */}
      <div className="card">
        <SectionHead icon="gavel" title="Legal & Registration" sub="Used on invoices and official documents." />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Field label="Registration No.">
            <input className="input" placeholder="Board / Govt. Reg. No." {...F('registrationNo')} />
          </Field>
          <Field label="GSTIN">
            <input className="input" placeholder="15-digit GST number" maxLength={15} {...F('gstin')} />
          </Field>
          <Field label="PAN">
            <input className="input" placeholder="10-digit PAN" maxLength={10} {...F('pan')} />
          </Field>
        </div>
      </div>

      {/* ─ Contact ─ */}
      <div className="card">
        <SectionHead icon="contact_phone" title="Contact Information" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Primary Phone *">
            <input className="input" type="tel" placeholder="+91 99999 99999" {...F('phone')} />
          </Field>
          <Field label="Alternate Phone">
            <input className="input" type="tel" placeholder="+91 88888 88888" {...F('altPhone')} />
          </Field>
          <Field label="Email *">
            <input className="input" type="email" placeholder="contact@institute.com" {...F('email')} />
          </Field>
          <Field label="Website">
            <input className="input" type="url" placeholder="https://www.institute.com" {...F('website')} />
          </Field>
        </div>
      </div>

      {/* ─ Address ─ */}
      <div className="card">
        <SectionHead icon="location_on" title="Address" sub="Printed on invoices and official letters." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Address Line 1 *">
            <input className="input" placeholder="Building, Street, Locality" {...F('addressLine1')} />
          </Field>
          <Field label="Address Line 2">
            <input className="input" placeholder="Landmark, Area (optional)" {...F('addressLine2')} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <Field label="City *">
              <input className="input" placeholder="City" {...F('city')} />
            </Field>
            <Field label="State *">
              <select className="select" {...F('state')}>
                <option value="">— State —</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="PIN *">
              <input className="input" placeholder="PIN Code" maxLength={6} {...F('pin')} />
            </Field>
            <Field label="Country">
              <input className="input" placeholder="Country" {...F('country')} />
            </Field>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
          onClick={handleSave} disabled={saving} style={{ minWidth: 180 }}
        >
          <span className="material-symbols-rounded icon-sm">{saving ? 'sync' : saved ? 'check_circle' : 'save'}</span>
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Company Profile'}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 3 — DESIGNATIONS
══════════════════════════════════════════════════════════ */

function DesignationsTab({ teacherId, showToast }: { teacherId: string; showToast: (m: string, ok?: boolean) => void }) {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [adding,       setAdding]       = useState(false);
  const [newLabel,     setNewLabel]     = useState('');
  const [newDept,      setNewDept]      = useState('');
  const [editId,       setEditId]       = useState<string | null>(null);
  const [editLabel,    setEditLabel]    = useState('');
  const [editDept,     setEditDept]     = useState('');
  const [savingId,     setSavingId]     = useState<string | null>(null);

  const fetchDesignations = useCallback(async () => {
    setLoading(true);
    const q = query(
      collection(db, 'designations'),
      where('teacherId', '==', teacherId),
      orderBy('order', 'asc'),
    );
    const snap = await getDocs(q);
    setDesignations(snap.docs.map(d => ({ id: d.id, ...d.data() } as Designation)));
    setLoading(false);
  }, [teacherId]);

  useEffect(() => { fetchDesignations(); }, [fetchDesignations]);

  /* Seed presets if empty */
  async function seedPresets() {
    const batch = DEFAULT_DESIGNATIONS.map((label, i) =>
      addDoc(collection(db, 'designations'), {
        teacherId, label, department: '', isDefault: true,
        order: i, createdAt: serverTimestamp(),
      })
    );
    await Promise.all(batch);
    showToast('Default designations loaded!');
    fetchDesignations();
  }

  async function handleAdd() {
    if (!newLabel.trim()) return;
    setAdding(true);
    try {
      await addDoc(collection(db, 'designations'), {
        teacherId, label: newLabel.trim(), department: newDept.trim(),
        isDefault: false, order: designations.length,
        createdAt: serverTimestamp(),
      });
      setNewLabel(''); setNewDept('');
      showToast(`"${newLabel.trim()}" added!`);
      fetchDesignations();
    } finally { setAdding(false); }
  }

  async function handleSaveEdit(id: string) {
    if (!editLabel.trim()) return;
    setSavingId(id);
    try {
      await updateDoc(doc(db, 'designations', id), {
        label: editLabel.trim(), department: editDept.trim(),
      });
      setEditId(null);
      showToast('Designation updated!');
      fetchDesignations();
    } finally { setSavingId(null); }
  }

  async function handleDelete(id: string, label: string) {
    if (!confirm(`Delete "${label}"?`)) return;
    await deleteDoc(doc(db, 'designations', id));
    showToast(`"${label}" deleted.`);
    fetchDesignations();
  }

  /* Group by department */
  const grouped = designations.reduce<Record<string, Designation[]>>((acc, d) => {
    const key = d.department?.trim() || 'General';
    acc[key] = [...(acc[key] ?? []), d];
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <SectionHead
            icon="badge"
            title="Designations"
            sub="Define roles that can be assigned to teachers and staff. These appear on reports and letters."
          />
          {designations.length === 0 && !loading && (
            <button className="btn btn-outline btn-sm" onClick={seedPresets}>
              <span className="material-symbols-rounded icon-sm">auto_awesome</span>
              Load Presets
            </button>
          )}
        </div>

        {/* Add row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10,
          padding: '14px 16px', background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)', marginBottom: 20,
        }}>
          <div>
            <label className="form-label" style={{ marginBottom: 4 }}>New Designation</label>
            <input
              className="input" placeholder="e.g. Senior Physics Teacher"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div>
            <label className="form-label" style={{ marginBottom: 4 }}>Department (optional)</label>
            <input
              className="input" placeholder="e.g. Science"
              value={newDept}
              onChange={e => setNewDept(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              className="btn btn-primary" onClick={handleAdd}
              disabled={adding || !newLabel.trim()}
              style={{ whiteSpace: 'nowrap' }}
            >
              <span className="material-symbols-rounded icon-sm">add</span>
              Add
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-secondary)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 36 }}>hourglass_empty</span>
            <p>Loading…</p>
          </div>
        ) : designations.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-rounded">badge</span>
            <h3>No designations yet</h3>
            <p>Add your first designation above or load the preset list.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([dept, items]) => (
            <div key={dept} style={{ marginBottom: 24 }}>
              {/* Department header */}
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '1px',
                textTransform: 'uppercase', color: 'var(--text-secondary)',
                marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span className="material-symbols-rounded icon-sm">folder</span>
                {dept}
                <span style={{
                  background: 'var(--bg-surface)', color: 'var(--text-secondary)',
                  padding: '1px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600,
                }}>{items.length}</span>
              </div>

              {/* Rows */}
              {items.map(d => (
                <div key={d.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                  marginBottom: 6,
                  background: editId === d.id ? 'var(--primary-light)' : 'var(--bg-hover)',
                  border: `1px solid ${editId === d.id ? 'var(--primary)' : 'var(--border)'}`,
                  transition: 'all 0.15s',
                }}>
                  <span className="material-symbols-rounded icon-sm" style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
                    drag_indicator
                  </span>

                  {editId === d.id ? (
                    /* Edit mode */
                    <>
                      <input
                        className="input" value={editLabel} autoFocus
                        onChange={e => setEditLabel(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveEdit(d.id)}
                        style={{ flex: 1 }}
                      />
                      <input
                        className="input" value={editDept} placeholder="Department"
                        onChange={e => setEditDept(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveEdit(d.id)}
                        style={{ width: 160 }}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSaveEdit(d.id)}
                        disabled={savingId === d.id}
                      >
                        {savingId === d.id ? '…' : 'Save'}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    /* View mode */
                    <>
                      <div style={{ flex: 1, fontWeight: 500 }}>{d.label}</div>
                      {d.isDefault && (
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 8px',
                          background: '#E3F2FD', color: '#1565C0', borderRadius: 10,
                        }}>PRESET</span>
                      )}
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setEditId(d.id); setEditLabel(d.label); setEditDept(d.department ?? ''); }}
                      >
                        <span className="material-symbols-rounded icon-sm">edit</span>
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDelete(d.id, d.label)}
                        style={{ color: 'var(--danger)' }}
                      >
                        <span className="material-symbols-rounded icon-sm">delete</span>
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))
        )}

        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
          {designations.length} designation{designations.length !== 1 ? 's' : ''} total
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TAB 4 — PREFERENCES
══════════════════════════════════════════════════════════ */

function PreferencesTab() {
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="card">
        <SectionHead icon="tune" title="App Preferences" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Currency">
              <select className="select">
                <option value="INR">INR (₹ — Indian Rupee)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </Field>
            <Field label="Academic Year Start">
              <select className="select">
                {['January','February','March','April','June','July','September','October']
                  .map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Date Format">
            <select className="select">
              <option value="DD/MM/YYYY">DD/MM/YYYY (Indian)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </Field>
          <Field label="Invoice Prefix (default: INV)">
            <input className="input" placeholder="INV" maxLength={6} />
          </Field>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            >
              <span className="material-symbols-rounded icon-sm">{saved ? 'check_circle' : 'save'}</span>
              {saved ? 'Saved!' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ borderColor: 'var(--danger-light)', marginTop: 20 }}>
        <h3 style={{ marginBottom: 4, color: 'var(--danger)' }}>
          <span className="material-symbols-rounded icon-sm filled" style={{ marginRight: 8, verticalAlign: 'middle' }}>warning</span>
          Danger Zone
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
          These actions are irreversible.
        </p>
        <button className="btn btn-danger btn-sm">Delete My Account</button>
      </div>
    </div>
  );
}
