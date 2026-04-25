'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type Step = 'phone' | 'otp';

/* OTP digit-box input */
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = 6;
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !refs.current[i]?.value && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const arr = (value.padEnd(digits, ' ')).split('');
    arr[i] = d || ' ';
    const next = arr.join('').trimEnd();
    onChange(next);
    if (d && i < digits - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: digits }).map((_, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i]?.trim() ?? ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          className="w-11 h-13 text-center text-lg font-bold rounded-xl border border-gray-200
                     focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none
                     transition-all bg-white"
          style={{ height: 52 }}
        />
      ))}
    </div>
  );
}

export default function PhoneForm() {
  const router   = useRouter();
  const [phone,   setPhone]   = useState('+91');
  const [otp,     setOtp]     = useState('');
  const [step,    setStep]    = useState<Step>('phone');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [timer,   setTimer]   = useState(0);
  const confirm   = useRef<ConfirmationResult | null>(null);
  const verifier  = useRef<RecaptchaVerifier | null>(null);

  /* countdown */
  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  /* cleanup recaptcha */
  useEffect(() => () => { verifier.current?.clear(); }, []);

  async function sendOTP(e?: FormEvent) {
    e?.preventDefault();
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid phone number with country code.');
      return;
    }
    setError(''); setLoading(true);
    try {
      if (!verifier.current) {
        verifier.current = new RecaptchaVerifier(auth, 'recaptcha-anchor', {
          size: 'invisible',
          callback: () => {},
        });
      }
      confirm.current = await signInWithPhoneNumber(auth, phone, verifier.current);
      setStep('otp');
      setTimer(30);
    } catch {
      setError('Could not send OTP. Check your phone number and try again.');
      verifier.current?.clear();
      verifier.current = null;
    } finally { setLoading(false); }
  }

  async function verifyOTP(e: FormEvent) {
    e.preventDefault();
    if (otp.trim().length < 6) { setError('Enter the 6-digit OTP.'); return; }
    setError(''); setLoading(true);
    try {
      await confirm.current!.confirm(otp.trim());
      document.cookie = 'alogyan-session=1; path=/; max-age=86400';
      router.push('/dashboard');
    } catch {
      setError('Incorrect OTP. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div>
      {/* invisible recaptcha anchor */}
      <div id="recaptcha-anchor" />

      {step === 'phone' ? (
        <form onSubmit={sendOTP} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
              Mobile number
            </label>
            <div className="relative">
              <span className="material-symbols-rounded filled absolute left-3 top-1/2 -translate-y-1/2
                               text-gray-400 pointer-events-none" style={{fontSize:17}}>
                smartphone
              </span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                autoComplete="tel"
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm
                           outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100
                           transition-all bg-white placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-400">Include country code, e.g. +91 for India</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200
                            px-4 py-3 text-sm text-red-700">
              <span className="material-symbols-rounded filled shrink-0" style={{fontSize:15}}>error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl
                       bg-red-700 hover:bg-red-800 disabled:opacity-60
                       text-white font-semibold py-3 text-sm shadow-sm shadow-red-200
                       transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {loading
              ? <><span className="material-symbols-rounded animate-spin" style={{fontSize:15}}>autorenew</span> Sending OTP…</>
              : <><span className="material-symbols-rounded filled" style={{fontSize:15}}>sms</span> Send OTP</>
            }
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOTP} className="space-y-5" noValidate>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-gray-700">Enter the 6-digit code sent to</p>
            <p className="text-sm text-red-600 font-bold">{phone}</p>
          </div>

          <OtpInput value={otp} onChange={setOtp} />

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200
                            px-4 py-3 text-sm text-red-700">
              <span className="material-symbols-rounded filled shrink-0" style={{fontSize:15}}>error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.trim().length < 6}
            className="w-full flex items-center justify-center gap-2 rounded-xl
                       bg-red-700 hover:bg-red-800 disabled:opacity-60
                       text-white font-semibold py-3 text-sm shadow-sm shadow-red-200
                       transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {loading
              ? <><span className="material-symbols-rounded animate-spin" style={{fontSize:15}}>autorenew</span> Verifying…</>
              : <><span className="material-symbols-rounded filled" style={{fontSize:15}}>verified</span> Verify & Sign in</>
            }
          </button>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-xs text-gray-400">Resend OTP in {timer}s</p>
            ) : (
              <button
                type="button"
                onClick={() => sendOTP()}
                className="text-xs text-red-600 font-semibold hover:underline"
              >
                Resend OTP
              </button>
            )}
            <button
              type="button"
              onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
              className="block mx-auto mt-2 text-xs text-gray-400 hover:text-gray-600"
            >
              ← Change number
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
