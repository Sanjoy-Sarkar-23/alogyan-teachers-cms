'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  FacebookAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
      <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.3-10.5 7.3-17.4z" fill="#4285F4"/>
      <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.9 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.6v6.2C6.6 42.8 14.7 48 24 48z" fill="#34A853"/>
      <path d="M10.8 28.8A14.4 14.4 0 0 1 10 24c0-1.7.3-3.3.8-4.8v-6.2H2.6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l8.2-6z" fill="#FBBC05"/>
      <path d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.8 2.3 30.4 0 24 0 14.7 0 6.6 5.2 2.6 13.2l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="#1877F2">
      <path d="M32 16C32 7.163 24.837 0 16 0S0 7.163 0 16c0 7.988 5.851 14.605 13.5 15.806V20.625H9.437V16H13.5v-3.525c0-4.01 2.39-6.225 6.044-6.225 1.752 0 3.581.313 3.581.313V10.5h-2.018C19.128 10.5 18.5 11.75 18.5 13v3H23l-.688 4.625H18.5v11.181C26.149 30.605 32 23.988 32 16z"/>
    </svg>
  );
}

export default function SocialButtons() {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const [loadingG, setLoadingG] = useState(false);
  const [loadingF, setLoadingF] = useState(false);
  const [error,    setError]    = useState('');

  async function handleGoogle() {
    setError(''); setLoadingG(true);
    try {
      await signInWithGoogle();
      document.cookie = 'alogyan-session=1; path=/; max-age=86400';
      router.push('/dashboard');
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally { setLoadingG(false); }
  }

  async function handleFacebook() {
    setError(''); setLoadingF(true);
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      document.cookie = 'alogyan-session=1; path=/; max-age=86400';
      router.push('/dashboard');
    } catch {
      setError('Facebook sign-in failed. Ensure it is enabled in Firebase console.');
    } finally { setLoadingF(false); }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loadingG || loadingF}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200
                     bg-white py-3 text-sm font-medium text-gray-700 shadow-sm
                     hover:bg-gray-50 disabled:opacity-50 transition-all duration-150"
        >
          {loadingG
            ? <span className="material-symbols-rounded animate-spin text-base">autorenew</span>
            : <GoogleIcon />
          }
          Google
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={handleFacebook}
          disabled={loadingG || loadingF}
          className="flex items-center justify-center gap-2 rounded-xl border border-blue-100
                     bg-blue-50 py-3 text-sm font-medium text-blue-700 shadow-sm
                     hover:bg-blue-100 disabled:opacity-50 transition-all duration-150"
        >
          {loadingF
            ? <span className="material-symbols-rounded animate-spin text-base">autorenew</span>
            : <FacebookIcon />
          }
          Facebook
        </button>
      </div>
    </div>
  );
}
