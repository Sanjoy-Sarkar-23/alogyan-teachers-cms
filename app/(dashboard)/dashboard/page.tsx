'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/* ─── TypeScript interfaces ─── */
interface KpiItem {
  label: string;
  value: string;
  icon: string;
  color: 'red' | 'blue' | 'green' | 'orange';
  trend: string;
  trendUp: boolean | null;
}
interface ScheduleEntry {
  time: string;
  duration: string;
  subject: string;
  students: number;
  color: 'red' | 'blue' | 'green';
}
interface PendingAction {
  name: string;
  issue: string;
  detail: string;
  type: 'fee' | 'test';
  avatar: string;
}
interface Announcement {
  title: string;
  date: string;
  icon: string;
}
interface QuickAction {
  href: string;
  icon: string;
  label: string;
  color: string;
}

/* ─── Static data ─── */
const kpis: KpiItem[] = [
  { label: 'Total Students',  value: '48',      icon: 'group',          color: 'red',    trend: '+3 this month',      trendUp: true  },
  { label: 'Active Batches',  value: '6',       icon: 'layers',         color: 'blue',   trend: '2 starting soon',    trendUp: null  },
  { label: 'Monthly Revenue', value: '₹42,000', icon: 'currency_rupee', color: 'green',  trend: '+12% vs last month', trendUp: true  },
  { label: 'Pending Fees',    value: '₹8,500',  icon: 'payments',       color: 'orange', trend: '4 students overdue', trendUp: false },
];
const todaysSchedule: ScheduleEntry[] = [
  { time: '9:00 AM',  duration: '60 MINS', subject: 'Class 10 Maths',     students: 12, color: 'red'   },
  { time: '11:30 AM', duration: '90 MINS', subject: 'Physics – JEE Adv.', students: 8,  color: 'blue'  },
  { time: '4:00 PM',  duration: '60 MINS', subject: 'Algebra Mock Test',   students: 15, color: 'green' },
];
const pendingActions: PendingAction[] = [
  { name: 'Aarav Sharma', issue: 'Fee Due',          detail: '₹1,500', type: 'fee',  avatar: 'AS' },
  { name: 'Khushi Patel', issue: 'Missed Mock Test', detail: 'Mar 20', type: 'test', avatar: 'KP' },
  { name: 'Rohan Verma',  issue: 'Fee Due',          detail: '₹2,200', type: 'fee',  avatar: 'RV' },
];
const announcements: Announcement[] = [
  { title: 'JEE Mock Test Schedule Update',         date: '20 Mar 2026', icon: 'quiz'        },
  { title: 'New Study Material: Organic Chemistry', date: '18 Mar 2026', icon: 'menu_book'   },
  { title: 'Holi Holiday Announcement',             date: '15 Mar 2026', icon: 'celebration' },
];
const quickActions: QuickAction[] = [
  { href: '/attendance',   icon: 'fact_check',  label: 'Mark Attendance', color: 'red'    },
  { href: '/fees',         icon: 'payments',    label: 'Collect Fee',     color: 'green'  },
  { href: '/students/new', icon: 'person_add',  label: 'Add Student',     color: 'blue'   },
  { href: '/batches/new',  icon: 'add_circle',  label: 'New Batch',       color: 'orange' },
  { href: '/notes/upload', icon: 'upload_file', label: 'Upload Note',     color: 'purple' },
  { href: '/tests/new',    icon: 'quiz',        label: 'Schedule Test',   color: 'teal'   },
];

/* Tailwind bar colour — full static strings so JIT picks them up */
const barColor: Record<ScheduleEntry['color'], string> = {
  red:   'bg-red-600',
  blue:  'bg-blue-800',
  green: 'bg-green-700',
};

/* ─── Helpers ─── */
function getGreeting(h: number): string {
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
function formatDate(d: Date): string {
  return d.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/* ─── Animated counter ─── */
function useCountUp(target: string, duration = 900): string {
  const [display, setDisplay] = useState<string>(target);
  useEffect(() => {
    const numStr = target.replace(/[^0-9]/g, '');
    const prefix = target.replace(/[0-9,]+.*/, '');
    const suffix = target.replace(/^[^0-9]*[0-9,]+/, '');
    const num = parseInt(numStr.replace(/,/g, ''), 10);
    if (isNaN(num) || num === 0) { setDisplay(target); return; }
    let start = 0;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, num);
      setDisplay(`${prefix}${start.toLocaleString('en-IN')}${suffix}`);
      if (start >= num) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return display;
}

/* ─── KPI Card ─── */
function KpiCard({ kpi }: { kpi: KpiItem }) {
  const animated = useCountUp(kpi.value);
  return (
    <div className="db-kpi-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="db-kpi-label">{kpi.label}</div>
          <div className="db-kpi-value">{animated}</div>
        </div>
        <div className={`db-kpi-icon ${kpi.color}`}>
          <span className="material-symbols-rounded filled">{kpi.icon}</span>
        </div>
      </div>
      {kpi.trend && (
        <div className={`db-kpi-trend ${kpi.trendUp === true ? 'up' : kpi.trendUp === false ? 'down' : 'neutral'}`}>
          {kpi.trendUp === true  && <span className="material-symbols-rounded db-trend-icon">trending_up</span>}
          {kpi.trendUp === false && <span className="material-symbols-rounded db-trend-icon">trending_down</span>}
          {kpi.trendUp === null  && <span className="material-symbols-rounded db-trend-icon">info</span>}
          <span>{kpi.trend}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Schedule Row ─── */
function ScheduleRow({ item, index }: { item: ScheduleEntry; index: number }) {
  return (
    <div className="db-schedule-item" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex flex-col items-end min-w-[76px] shrink-0">
        <span className="db-schedule-clock">{item.time}</span>
        <span className="db-schedule-duration">{item.duration}</span>
      </div>
      <div className={`w-1 h-11 rounded shrink-0 ${barColor[item.color]}`} />
      <div className="flex-1 min-w-0">
        <div className="db-schedule-subject">{item.subject}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <span className="material-symbols-rounded filled icon-sm">group</span>
          {item.students} Students
        </div>
      </div>
      {/* Hidden on mobile, visible on md+ */}
      <button className="hidden md:inline-flex btn btn-outline btn-sm ml-auto shrink-0">
        Start
      </button>
    </div>
  );
}

/* ─── Section Heading ─── */
function SectionHeading({ icon, label, warn = false }: {
  icon: string;
  label: string;
  warn?: boolean;
}) {
  return (
    <h3 className="flex items-center">
      <span className={`material-symbols-rounded filled icon-sm ${warn ? 'db-section-icon-warn' : 'db-section-icon'}`}>
        {icon}
      </span>
      {label}
    </h3>
  );
}

/* ─── Page ─── */
type Tab = 'schedule' | 'actions' | 'announcements';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('schedule');
  const [greeting, setGreeting] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    setGreeting(getGreeting(now.getHours()));
    setDateStr(formatDate(now));
  }, []);

  /* Helper: hide on mobile when tab doesn't match; always visible on md+ */
  const tabVisible = (tab: Tab): string =>
    activeTab === tab ? '' : 'hidden md:block';

  return (
    /* Root — Tailwind flex column with gap */
    <div className="flex flex-col gap-5">

      {/* ── Hero ── */}
      <div className="db-hero">
        <div className="flex-1 min-w-0">
          <h1 className="db-hero-greeting">
            {greeting ? `${greeting}, Rajan Sir 👋` : 'Welcome, Rajan Sir 👋'}
          </h1>
          <p className="db-hero-date">{dateStr}</p>
        </div>
        <Link href="/attendance" className="btn db-hero-cta shrink-0">
          <span className="material-symbols-rounded filled icon-sm">fact_check</span>
          Mark Attendance
        </Link>
      </div>

      {/* ── KPI Grid
            Mobile  (default) : 2 columns
            lg 1024px+         : 4 columns
      ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => <KpiCard key={k.label} kpi={k} />)}
      </div>

      {/* ── Mobile tab switcher
            Visible  : mobile only  (flex)
            Hidden   : md 768px+   (md:hidden)
      ── */}
      <div className="flex md:hidden bg-[var(--bg-surface)] rounded-[var(--radius-md)] p-1 gap-1">
        {(['schedule', 'actions', 'announcements'] as const).map(tab => (
          <button
            key={tab}
            className={`db-mobile-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'schedule' ? 'Schedule' : tab === 'actions' ? 'Actions' : 'News'}
          </button>
        ))}
      </div>

      {/* ── Main Grid
            DOM order  : Schedule → Pending → Announcements → Quick Actions
            Mobile     : single col, tabs control visibility, QA always last
            lg 1024px+ : 2-col grid with explicit cell placement:
                           col-1 row-1 = Schedule
                           col-2 row-1 = Pending Actions
                           col-2 row-2 = Announcements
                           col-1 row-2 = Quick Actions  ← same width as Schedule
      ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-5 items-start">

        {/* 1️⃣ Schedule — mobile: first; desktop: col 1 row 1 */}
        <div className={`card lg:col-start-1 lg:row-start-1 ${tabVisible('schedule')}`}>
          <div className="card-header">
            <SectionHeading icon="today" label="Today's Schedule" />
            <Link href="/batches" className="db-link">View all →</Link>
          </div>
          <div>
            {todaysSchedule.map((s, i) => <ScheduleRow key={s.time} item={s} index={i} />)}
          </div>
        </div>

        {/* 2️⃣ Pending Actions — mobile: second (tab hidden); desktop: col 2 row 1 */}
        <div className={`card lg:col-start-2 lg:row-start-1 ${tabVisible('actions')}`}>
          <div className="card-header">
            <SectionHeading icon="warning" label="Pending Actions" warn />
            <span className="badge badge-warning">{pendingActions.length}</span>
          </div>
          <div>
            {pendingActions.map((p, i) => (
              <div key={p.name} className="db-pending-item" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="avatar avatar-md">{p.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="db-pending-name">{p.name}</div>
                  <div className="db-pending-issue">{p.issue}</div>
                </div>
                <span className={`badge ${p.type === 'fee' ? 'badge-danger' : 'badge-warning'}`}>
                  {p.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3️⃣ Announcements — mobile: third (tab hidden); desktop: col 2 row 2 */}
        <div className={`card lg:col-start-2 lg:row-start-2 ${tabVisible('announcements')}`}>
          <div className="card-header">
            <SectionHeading icon="campaign" label="Announcements" />
            <Link href="/announcements" className="db-link">View all →</Link>
          </div>
          <div>
            {announcements.map((a, i) => (
              <Link key={a.title} href="/announcements" className="db-announce-item" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="db-announce-icon">
                  <span className="material-symbols-rounded filled icon-sm">{a.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="db-announce-title">{a.title}</div>
                  <div className="db-announce-date">{a.date}</div>
                </div>
                <span className="db-announce-arrow">
                  <span className="material-symbols-rounded icon-sm">chevron_right</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 4️⃣ Quick Actions — mobile: LAST; desktop: col 1 row 2 (same width as Schedule) */}
        <div className="card lg:col-start-1 lg:row-start-2">
          <div className="card-header">
            <SectionHeading icon="bolt" label="Quick Actions" />
          </div>
          {/* grid-cols-3 on mobile (2 rows of 3), sm:grid-cols-6 one row on wider */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {quickActions.map(qa => (
              <Link key={qa.href} href={qa.href} className={`db-qa-item db-qa-${qa.color}`}>
                <div className="db-qa-icon-wrap">
                  <span className="material-symbols-rounded filled">{qa.icon}</span>
                </div>
                <div className="db-qa-label">{qa.label}</div>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}