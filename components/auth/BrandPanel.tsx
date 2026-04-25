// Server component — no 'use client' needed

const FEATURES = [
  { icon: 'group',         text: 'Manage students & batches effortlessly' },
  { icon: 'payments',      text: 'Track fees and generate invoices instantly' },
  { icon: 'fact_check',    text: 'Mark attendance in seconds' },
  { icon: 'menu_book',     text: 'Share notes and study material with one click' },
];

const STATS = [
  { n: '500+',    l: 'Teachers' },
  { n: '12,000+', l: 'Students' },
  { n: '98%',     l: 'Satisfaction' },
];

export default function BrandPanel() {
  return (
    <div className="relative flex flex-col justify-between w-full
                    bg-gradient-to-br from-red-700 via-red-800 to-red-950
                    px-10 py-12 overflow-hidden text-white">

      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full
                      bg-white/5 pointer-events-none" />
      <div className="absolute bottom-0 -left-16 w-60 h-60 rounded-full
                      bg-white/5 pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 border border-white/30 rounded-xl
                        flex items-center justify-center">
          <span className="material-symbols-rounded filled text-white" style={{fontSize:22}}>school</span>
        </div>
        <span className="text-2xl font-bold tracking-tight">Alogyan</span>
      </div>

      {/* Main copy */}
      <div className="relative z-10 my-12">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight mb-4">
          The smarter way<br/>to run your<br/>
          <span className="text-red-200">coaching centre</span>
        </h2>
        <p className="text-red-100 text-base leading-relaxed max-w-xs">
          Everything you need to manage students, fees, attendance and more — in one beautiful dashboard.
        </p>

        {/* Feature list */}
        <ul className="mt-8 space-y-3">
          {FEATURES.map(f => (
            <li key={f.icon} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded filled text-white" style={{fontSize:15}}>
                  {f.icon}
                </span>
              </div>
              <span className="text-sm text-red-50">{f.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
        {STATS.map(s => (
          <div key={s.l}>
            <div className="text-2xl font-extrabold tracking-tight">{s.n}</div>
            <div className="text-xs text-red-200 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
