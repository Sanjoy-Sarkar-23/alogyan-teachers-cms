'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import PasswordInput from './PasswordInput';

export default function EmailForm() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      document.cookie = 'alogyan-session=1; path=/; max-age=86400';
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('invalid-credential') || msg.includes('wrong-password') || msg.includes('user-not-found')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Sign-in failed. Please try again.');
      }
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
          Email address
        </label>
        <div className="relative">
          <span className="material-symbols-rounded filled absolute left-3 top-1/2 -translate-y-1/2
                           text-gray-400 pointer-events-none" style={{fontSize:17}}>
            mail
          </span>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@school.com"
            required
            autoComplete="email"
            className={`w-full rounded-xl border pl-10 pr-4 py-3 text-sm outline-none
                        transition-all bg-white placeholder:text-gray-400
                        ${error
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                          : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        }`}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="email-password" className="block text-sm font-semibold text-gray-700">
            Password
          </label>
          <button type="button" className="text-xs text-red-600 font-medium hover:underline">
            Forgot password?
          </button>
        </div>
        <PasswordInput
          id="email-password"
          value={password}
          onChange={setPassword}
          hasError={!!error}
          autoComplete="current-password"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200
                        px-4 py-3 text-sm text-red-700">
          <span className="material-symbols-rounded filled shrink-0" style={{fontSize:15}}>error</span>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl
                   bg-red-700 hover:bg-red-800 disabled:opacity-60
                   text-white font-semibold py-3 text-sm shadow-sm shadow-red-200
                   transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      >
        {loading ? (
          <><span className="material-symbols-rounded animate-spin" style={{fontSize:15}}>autorenew</span> Signing in…</>
        ) : (
          <><span className="material-symbols-rounded filled" style={{fontSize:15}}>login</span> Sign in</>
        )}
      </button>
    </form>
  );
}
