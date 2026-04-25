import type { ReactNode } from 'react';
import BrandPanel from '@/components/auth/BrandPanel';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel (desktop only) */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0">
        <BrandPanel />
      </div>

      {/* Right — form area */}
      <div className="flex-1 flex flex-col items-center justify-center
                      bg-gradient-to-br from-rose-50 to-white
                      px-6 py-12 min-h-screen">
        {/* Mobile logo */}
        <div className="flex items-center gap-3 mb-8 lg:hidden">
          <div className="w-9 h-9 bg-red-700 rounded-xl flex items-center justify-center">
            <span className="material-symbols-rounded filled text-white" style={{fontSize:20}}>school</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Alogyan</span>
        </div>

        {children}
      </div>
    </div>
  );
}
