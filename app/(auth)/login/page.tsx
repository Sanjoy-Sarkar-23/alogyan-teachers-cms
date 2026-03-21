'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Set a simple session cookie (client-side) so middleware allows access
      document.cookie = 'alogyan-session=1; path=/; max-age=86400';
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
        setError('Invalid email or password.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ width: '100%', maxWidth: 420 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'var(--primary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px',
        }}>
          <span className="material-symbols-rounded filled" style={{ color: '#fff', fontSize: 28 }}>school</span>
        </div>
        <h1 style={{ fontSize: 22, color: 'var(--text-primary)', marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Sign in to your Alogyan CMS</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className={`input ${error ? 'error' : ''}`}
            placeholder="you@school.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className={`input ${error ? 'error' : ''}`}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <div className="flash-error" style={{ fontSize: 13, padding: '10px 12px' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ justifyContent: 'center', marginTop: 8 }}
        >
          {loading ? (
            <>
              <span className="material-symbols-rounded icon-sm" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
              Signing in…
            </>
          ) : 'Sign In'}
        </button>
      </form>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
