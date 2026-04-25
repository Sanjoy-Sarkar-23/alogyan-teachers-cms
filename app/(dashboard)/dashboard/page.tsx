'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import type { Student, Batch, FeeRecord, Announcement, DayOfWeek } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function greeting(h: number) {
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
function todayDow(): DayOfWeek {
  return (['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] as DayOfWeek[])[new Date().getDay()];
}
function toMin(t: string) { const [h,m]=t.split(':').map(Number); return h*60+m; }
function fmt12(t: string) {
  const [h,m]=t.split(':').map(Number);
  return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
}
function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!target) { setV(0); return; }
    let cur = 0;
    const step = Math.ceil(target / (ms / 16));
    const t = setInterval(() => { cur = Math.min(cur+step, target); setV(cur); if(cur>=target) clearInterval(t); }, 16);
    return () => clearInterval(t);
  }, [target, ms]);
  return v;
}

// ─── SVG Ring ────────────────────────────────────────────────────────────────
function Ring({ pct, size=80, stroke='var(--success)' }: { pct:number; size?:number; stroke?:string }) {
  const r = (size-10)/2, c = 2*Math.PI*r, fill = c*(pct/100);
  return (
    <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={8}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={stroke} strokeWidth={8}
        strokeDasharray={`${fill} ${c}`} strokeLinecap="round"
        style={{transition:'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)'}}/>
    </svg>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, raw, display, icon, accent, trend, up }:{
  label:string; raw:number; display:(n:number)=>string;
  icon:string; accent:string; trend:string; up:boolean|null;
}) {
  const v = useCountUp(raw);
  return (
    <div className="dh-kpi">
      <div className="dh-kpi-row">
        <div>
          <div className="dh-kpi-label">{label}</div>
          <div className="dh-kpi-value">{display(v)}</div>
        </div>
        <div className="dh-kpi-icon" style={{'--acc':accent} as React.CSSProperties}>
          <span className="material-symbols-rounded filled">{icon}</span>
        </div>
      </div>
      <div className={`dh-kpi-trend ${up===true?'up':up===false?'dn':'neu'}`}>
        <span className="material-symbols-rounded" style={{fontSize:13}}>
          {up===true?'trending_up':up===false?'trending_down':'info'}
        </span>
        {trend}
      </div>
    </div>
  );
}

// ─── Class Row ───────────────────────────────────────────────────────────────
interface TClass { batchId:string; name:string; subject:string; time:string; dur:number; students:number; min:number; }

function ClassRow({ cls, nowMin }:{ cls:TClass; nowMin:number }) {
  const end = cls.min + cls.dur;
  const active = nowMin >= cls.min && nowMin < end;
  const done   = nowMin >= end;
  const pct    = active ? Math.round(((nowMin-cls.min)/cls.dur)*100) : 0;
  return (
    <div className={`dh-cls ${active?'active':done?'done':''}`}>
      <div className="dh-cls-time">
        <span className="dh-cls-t">{fmt12(cls.time)}</span>
        <span className="dh-cls-d">{cls.dur}m</span>
      </div>
      <div className={`dh-cls-bar ${active?'active':done?'done':''}`}>
        {active && <div className="dh-cls-bar-fill" style={{height:`${pct}%`}}/>}
      </div>
      <div className="dh-cls-body">
        <div className="dh-cls-name">{cls.name}</div>
        <div className="dh-cls-sub">
          <span className="material-symbols-rounded filled" style={{fontSize:12}}>group</span>
          {cls.students} · {cls.subject}
        </div>
        {active && (
          <div className="dh-cls-prog"><div className="dh-cls-prog-fill" style={{width:`${pct}%`}}/></div>
        )}
      </div>
      {done
        ? <span className="dh-cls-done material-symbols-rounded filled">check_circle</span>
        : <Link href={`/batches/${cls.batchId}`} className={`btn btn-sm shrink-0 ${active?'btn-primary':'btn-outline'}`}>
            {active?'In progress':'View'}
          </Link>
      }
    </div>
  );
}

// ─── Quick Action ────────────────────────────────────────────────────────────
const QA = [
  { href:'/attendance', icon:'fact_check',  label:'Mark Attendance', c:'#D32F2F' },
  { href:'/fees',       icon:'payments',    label:'Collect Fee',     c:'#2E7D32' },
  { href:'/students',   icon:'person_add',  label:'Add Student',     c:'#1565C0' },
  { href:'/batches',    icon:'layers',      label:'Manage Batches',  c:'#6A1B9A' },
  { href:'/notes',      icon:'upload_file', label:'Upload Note',     c:'#E65100' },
  { href:'/tests',      icon:'quiz',        label:'Schedule Test',   c:'#00695C' },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [tid,  setTid]  = useState<string|null>(null);
  const [tname,setTname]= useState('Teacher');
  const [students,setStudents]     = useState<Student[]>([]);
  const [batches, setBatches]      = useState<Batch[]>([]);
  const [fees,    setFees]         = useState<FeeRecord[]>([]);
  const [ann,     setAnn]          = useState<Announcement[]>([]);
  const [loading, setLoading]      = useState(true);
  const [now,     setNow]          = useState(new Date());

  // Clock tick every minute
  useEffect(() => { const t=setInterval(()=>setNow(new Date()),60000); return()=>clearInterval(t); }, []);

  // Auth
  useEffect(() => onAuthStateChanged(auth, u => {
    if (u) { setTid(u.uid); setTname(u.displayName ?? u.email?.split('@')[0] ?? 'Teacher'); }
  }), []);

  // Fetch
  const fetch = useCallback(async () => {
    if (!tid) return;
    setLoading(true);
    try {
      const [ss,bs,fs,as] = await Promise.all([
        getDocs(query(collection(db,'students'), where('teacherId','==',tid))),
        getDocs(query(collection(db,'batches'),  where('teacherId','==',tid))),
        getDocs(query(collection(db,'fees'),     where('teacherId','==',tid))),
        getDocs(query(collection(db,'announcements'), where('teacherId','==',tid), orderBy('createdAt','desc'), limit(3))),
      ]);
      setStudents(ss.docs.map(d=>({id:d.id,...d.data()} as Student)));
      setBatches( bs.docs.map(d=>({id:d.id,...d.data()} as Batch)));
      setFees(    fs.docs.map(d=>({id:d.id,...d.data()} as FeeRecord)));
      setAnn(     as.docs.map(d=>({id:d.id,...d.data()} as Announcement)));
    } finally { setLoading(false); }
  }, [tid]);

  useEffect(() => { fetch(); }, [fetch]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const active    = students.filter(s=>s.status==='active').length;
  const activeBat = batches.filter(b=>b.status==='active');
  const month     = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const mFees     = fees.filter(f=>f.month===month);
  const expected  = mFees.reduce((s,f)=>s+f.amount, 0);
  const collected = mFees.filter(f=>f.status==='paid').reduce((s,f)=>s+f.paidAmount, 0);
  const pct       = expected>0 ? Math.round((collected/expected)*100) : 0;
  const pending   = fees.filter(f=>f.status==='pending'||f.status==='overdue');

  // Today's classes
  const dow = todayDow();
  const nowMin = now.getHours()*60 + now.getMinutes();
  const todayClasses: TClass[] = activeBat
    .flatMap(b => b.schedule.filter(s=>s.day===dow).map(s=>({
      batchId:b.id, name:b.name, subject:b.subject,
      time:s.startTime, dur:s.durationMins,
      students:b.studentIds?.length??0, min:toMin(s.startTime),
    })))
    .sort((a,b)=>a.min-b.min);

  const next = todayClasses.find(c=>nowMin < c.min+c.dur);
  const nextLabel = next
    ? next.min > nowMin
      ? `${next.name} in ${next.min-nowMin}m`
      : `${next.name} — in progress`
    : 'No more classes today';

  const initials = tname.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const hr = now.getHours();
  const timeStr = now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true});
  const dateStr = now.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'});

  return (
    <div className="dh-root">

      {/* ── Hero ── */}
      <div className="dh-hero">
        <div className="dh-hero-blob a"/><div className="dh-hero-blob b"/>
        <div className="dh-hero-left">
          <div className="dh-avatar">{initials}</div>
          <div>
            <p className="dh-greeting">{greeting(hr)},</p>
            <h1 className="dh-name">{tname} 👋</h1>
            <p className="dh-date">{dateStr}</p>
          </div>
        </div>
        <div className="dh-hero-right">
          <div className="dh-clock">{timeStr}</div>
          <div className="dh-next-cls">
            <span className="material-symbols-rounded filled" style={{fontSize:14}}>schedule</span>
            {nextLabel}
          </div>
          <Link href="/attendance" className="dh-hero-btn">
            <span className="material-symbols-rounded filled" style={{fontSize:15}}>fact_check</span>
            Mark Attendance
          </Link>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="dh-kpi-grid">
        <KpiCard label="Active Students"    raw={active}      display={n=>n.toLocaleString('en-IN')}               icon="group"          accent="#1565C0" trend={`${students.length} total`}          up={null}/>
        <KpiCard label="Active Batches"     raw={activeBat.length} display={n=>String(n)}                          icon="layers"         accent="#6A1B9A" trend={`${batches.filter(b=>b.status==='upcoming').length} upcoming`} up={null}/>
        <KpiCard label="Collected (Month)"  raw={collected}   display={n=>`₹${n.toLocaleString('en-IN')}`}         icon="currency_rupee" accent="#2E7D32" trend={`${pct}% of target`}               up={pct>70?true:pct<40?false:null}/>
        <KpiCard label="Pending Payments"   raw={pending.length} display={n=>`${n} dues`}                          icon="payments"       accent="#E65100" trend={pending.length===0?'All cleared!':'Need attention'} up={pending.length===0?true:false}/>
      </div>

      {/* ── Main grid ── */}
      <div className="dh-grid">

        {/* Left col */}
        <div className="dh-col">

          {/* Today's Schedule */}
          <div className="card">
            <div className="card-header">
              <h3 style={{display:'flex',alignItems:'center',gap:6}}>
                <span className="material-symbols-rounded filled" style={{fontSize:18,color:'var(--primary)'}}>today</span>
                Today's Schedule
              </h3>
              <span style={{fontSize:12,color:'var(--text-secondary)'}}>{dow} · {todayClasses.length} class{todayClasses.length!==1?'es':''}</span>
            </div>
            {loading ? (
              <div className="dh-empty"><span className="material-symbols-rounded dh-spin">autorenew</span></div>
            ) : todayClasses.length === 0 ? (
              <div className="dh-empty">
                <span className="material-symbols-rounded filled" style={{fontSize:36,color:'var(--text-disabled)'}}>event_available</span>
                <p>No classes today</p>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:2}}>
                {todayClasses.map(c=><ClassRow key={`${c.batchId}-${c.time}`} cls={c} nowMin={nowMin}/>)}
              </div>
            )}
            <div className="dh-card-footer">
              <Link href="/batches" style={{fontSize:12,color:'var(--primary)',fontWeight:500}}>View all batches →</Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 style={{display:'flex',alignItems:'center',gap:6}}>
                <span className="material-symbols-rounded filled" style={{fontSize:18,color:'var(--warning)'}}>bolt</span>
                Quick Actions
              </h3>
            </div>
            <div className="dh-qa-grid">
              {QA.map(a=>(
                <Link key={a.href} href={a.href} className="dh-qa">
                  <div className="dh-qa-icon" style={{'--qc':a.c} as React.CSSProperties}>
                    <span className="material-symbols-rounded filled">{a.icon}</span>
                  </div>
                  <span className="dh-qa-label">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right col */}
        <div className="dh-col">

          {/* Fee Collection Ring */}
          <div className="card">
            <div className="card-header">
              <h3 style={{display:'flex',alignItems:'center',gap:6}}>
                <span className="material-symbols-rounded filled" style={{fontSize:18,color:'var(--success)'}}>bar_chart</span>
                Fee Collection
              </h3>
              <Link href="/fees" style={{fontSize:12,color:'var(--primary)',fontWeight:500}}>View all →</Link>
            </div>
            <div className="dh-ring-row">
              <div className="dh-ring-wrap">
                <Ring pct={pct} size={96} stroke={pct>70?'var(--success)':pct>40?'var(--warning)':'var(--danger)'}/>
                <div className="dh-ring-label">{pct}%</div>
              </div>
              <div className="dh-ring-stats">
                <div className="dh-ring-stat">
                  <span style={{color:'var(--text-secondary)',fontSize:11}}>Collected</span>
                  <strong style={{color:'var(--success)'}}>₹{collected.toLocaleString('en-IN')}</strong>
                </div>
                <div className="dh-ring-stat">
                  <span style={{color:'var(--text-secondary)',fontSize:11}}>Expected</span>
                  <strong>₹{expected.toLocaleString('en-IN')}</strong>
                </div>
                <div className="dh-ring-bar-wrap">
                  <div className="dh-ring-bar" style={{width:`${pct}%`, background:pct>70?'var(--success)':pct>40?'var(--warning)':'var(--danger)'}}/>
                </div>
                <p style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>{pending.length} pending · {mFees.length} total records</p>
              </div>
            </div>
          </div>

          {/* Pending Dues */}
          {pending.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 style={{display:'flex',alignItems:'center',gap:6}}>
                  <span className="material-symbols-rounded filled" style={{fontSize:18,color:'var(--danger)'}}>warning</span>
                  Pending Dues
                </h3>
                <span className="badge badge-danger">{pending.length}</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:2}}>
                {pending.slice(0,5).map(f=>(
                  <div key={f.id} className="dh-due">
                    <div className="avatar avatar-sm">{f.studentName.slice(0,2).toUpperCase()}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13}}>{f.studentName}</div>
                      <div style={{fontSize:11,color:'var(--text-secondary)'}}>{f.batchName} · {f.month}</div>
                    </div>
                    <span className={`badge ${f.status==='overdue'?'badge-danger':'badge-warning'}`}>
                      ₹{f.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="dh-card-footer">
                <Link href="/fees" style={{fontSize:12,color:'var(--primary)',fontWeight:500}}>Manage all fees →</Link>
              </div>
            </div>
          )}

          {/* Announcements */}
          {ann.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 style={{display:'flex',alignItems:'center',gap:6}}>
                  <span className="material-symbols-rounded filled" style={{fontSize:18,color:'var(--primary)'}}>campaign</span>
                  Announcements
                </h3>
                <Link href="/announcements" style={{fontSize:12,color:'var(--primary)',fontWeight:500}}>View all →</Link>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {ann.map(a=>(
                  <Link key={a.id} href="/announcements" className="dh-ann">
                    <div className="dh-ann-dot"/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:500,fontSize:13,lineHeight:1.3}}>{a.title}</div>
                      <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>
                        {a.publishedAt?.toDate?.().toLocaleDateString('en-IN',{day:'numeric',month:'short'}) ?? ''}
                      </div>
                    </div>
                    <span className="material-symbols-rounded" style={{fontSize:16,color:'var(--text-disabled)'}}>chevron_right</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}