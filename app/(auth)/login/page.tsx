'use client';

import { useState } from 'react';
import Link from 'next/link';
import EmailForm    from '@/components/auth/EmailForm';
import PhoneForm    from '@/components/auth/PhoneForm';
import SocialButtons from '@/components/auth/SocialButtons';

type Tab = 'email' | 'phone';

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('email');

  return (
    <div className="w-full max-w-md">

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1.5">
          Sign in to your Alogyan account to continue.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/60 p-7">

        {/* Social buttons */}
        <SocialButtons />

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-400 font-medium">
              or continue with
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5 gap-1">
          {([
            { id: 'email', icon: 'mail',       label: 'Email' },
            { id: 'phone', icon: 'smartphone', label: 'Phone' },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg
                          py-2 text-sm font-semibold transition-all duration-200
                          ${tab === t.id
                            ? 'bg-white text-red-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                          }`}
            >
              <span className="material-symbols-rounded filled" style={{fontSize:15}}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Active form */}
        {tab === 'email' ? <EmailForm /> : <PhoneForm />}
      </div>

      {/* Footer links */}
      <p className="mt-5 text-center text-xs text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/" className="text-red-600 font-semibold hover:underline">
          Learn more about Alogyan
        </Link>
      </p>

      {/* Trust signals */}
      <div className="mt-6 flex items-center justify-center gap-6">
        {[
          { icon: 'lock',          label: 'Secure login' },
          { icon: 'verified_user', label: 'Firebase Auth' },
          { icon: 'privacy_tip',   label: 'Encrypted' },
        ].map(t => (
          <div key={t.label} className="flex items-center gap-1.5 text-gray-400">
            <span className="material-symbols-rounded filled" style={{fontSize:13}}>{t.icon}</span>
            <span className="text-xs">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
