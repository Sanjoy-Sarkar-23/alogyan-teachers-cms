import { NextResponse } from 'next/server';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFCDD2 0%, #FFFFFF 60%)',
      padding: '24px',
    }}>
      {children}
    </div>
  );
}
