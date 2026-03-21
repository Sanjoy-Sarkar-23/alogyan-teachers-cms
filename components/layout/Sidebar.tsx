'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { href: '/dashboard',     icon: 'dashboard',         label: 'Dashboard' },
  { href: '/students',      icon: 'group',             label: 'Students' },
  { href: '/batches',       icon: 'class',             label: 'Batches' },
  { href: '/attendance',    icon: 'fact_check',        label: 'Attendance' },
  { href: '/fees',          icon: 'payments',          label: 'Fees' },
  { href: '/notes',         icon: 'folder_open',       label: 'Notes' },
  { href: '/tests',         icon: 'quiz',              label: 'Tests' },
  { href: '/reports',       icon: 'bar_chart',         label: 'Reports' },
  { href: '/announcements', icon: 'campaign',          label: 'Announcements' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await signOut(auth);
    document.cookie = 'alogyan-session=; path=/; max-age=0';
    router.push('/login');
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <span className="material-symbols-rounded filled" style={{ color: '#fff', fontSize: 24 }}>school</span>
        </div>
        <div>
          <div className={styles.logoName}>Alogyan</div>
          <div className={styles.logoSub}>Teacher CMS</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={`material-symbols-rounded ${isActive ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && <div className={styles.activeBar} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <Link href="/settings" className={styles.navItem}>
          <span className="material-symbols-rounded">settings</span>
          <span>Settings</span>
        </Link>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <span className="material-symbols-rounded">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
