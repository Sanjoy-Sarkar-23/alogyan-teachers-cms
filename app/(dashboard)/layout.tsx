import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Header />
        <main style={{
          marginTop: 'var(--header-height)',
          padding: '24px',
          flex: 1,
          background: 'var(--bg-surface)',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
