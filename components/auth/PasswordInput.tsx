'use client';

import { useState } from 'react';

interface Props {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hasError?: boolean;
  autoComplete?: string;
}

export default function PasswordInput({ id, value, onChange, placeholder = '••••••••', hasError, autoComplete }: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none
                    transition-all duration-150 bg-white
                    placeholder:text-gray-400
                    ${hasError
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    }`}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                   hover:text-gray-600 transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        <span className="material-symbols-rounded" style={{fontSize:18}}>
          {show ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  );
}
