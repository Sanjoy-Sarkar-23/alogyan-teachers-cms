'use client';

import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/students':      'Students',
  '/batches':       'Batches',
  '/attendance':    'Attendance',
  '/fees':          'Fees',
  '/notes':         'Notes',
  '/tests':         'Tests',
  '/reports':       'Reports',
  '/announcements': 'Announcements',
  '/settings':      'Settings',
};

export default function Header() {
  const pathname = usePathname();
  const base = '/' + (pathname.split('/')[1] || '');
  const title = PAGE_TITLES[base] ?? 'Alogyan';

  return (
    <header style={{
      height: 'var(--header-height)',
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-width)',
      right: 0,
      background: 'var(--bg-default)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 99,
      gap: 12,
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
        {title}
      </h2>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Notifications bell */}
        <button className="btn btn-icon btn-ghost" title="Notifications">
          <span className="material-symbols-rounded icon-sm">notifications</span>
        </button>

        {/* Avatar placeholder */}
        <div className="avatar avatar-sm" title="Account">T</div>
      </div>
    </header>
  );
}
