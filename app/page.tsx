import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alogyan — Smart CMS for Teachers & Coaching Institutes',
  description: 'Manage students, batches, fees, attendance and notes all in one place.',
};

const FEATURES = [
  { icon:'group',        title:'Student Management', desc:'Track every student — enrollment, contact, attendance and performance in one clean profile.', c:'#1565C0' },
  { icon:'layers',       title:'Batch Scheduling',   desc:'Create batches, set weekly timetables and monitor class-wise attendance with zero effort.', c:'#6A1B9A' },
  { icon:'payments',     title:'Fee Collection',     desc:'Record payments, track dues and generate professional branded invoices in one click.',     c:'#2E7D32' },
  { icon:'fact_check',   title:'Attendance Tracker', desc:'Mark present / absent / late per batch. Monthly reports available at a glance.',           c:'#D32F2F' },
  { icon:'menu_book',    title:'Study Material',     desc:'Upload PDFs, images and links. Share batch-specific resources with a single tap.',          c:'#E65100' },
  { icon:'quiz',         title:'Tests & Results',    desc:'Schedule tests, record scores and track student progress over time with grade analytics.',   c:'#00695C' },
];

const STATS = [
  { n:'500+',   label:'Teachers Onboarded' },
  { n:'12,000+',label:'Students Managed' },
  { n:'₹2.4Cr+',label:'Fees Processed' },
  { n:'98%',    label:'Satisfaction Rate' },
];

const STEPS = [
  { icon:'person_add',  step:'01', title:'Add your students', desc:'Import or add students one-by-one. Create batches and assign them in minutes.' },
  { icon:'event_note',  step:'02', title:'Run your batches',  desc:'Mark attendance, share notes, schedule tests — all from one dashboard.' },
  { icon:'receipt_long',step:'03', title:'Collect fees',      desc:'Track dues, record payments and auto-generate invoices with institute branding.' },
];

const TESTIMONIALS = [
  { name:'Rajan Mehta',  role:'JEE/NEET Coach, Pune',      quote:'Alogyan saved me 2 hours every day. Managing 120 students across 8 batches used to be a nightmare.', i:'RM' },
  { name:'Priya Sharma', role:'English Tutor, Delhi',       quote:'The fee tracking is brilliant. I know exactly who has paid — no more awkward reminders.',             i:'PS' },
  { name:'Suresh Kumar', role:'Maths Teacher, Bangalore',   quote:'Invoice generation alone is worth it. My institute looks so professional now. Parents love it!',      i:'SK' },
];

export default function LandingPage() {
  return (
    <div className="lp">

      {/* ── Navbar ── */}
      <header className="lp-nav">
        <div className="lp-wrap lp-nav-inner">
          <div className="lp-logo">
            <div className="lp-logo-mark"><span className="material-symbols-rounded filled">school</span></div>
            <span className="lp-logo-text">Alogyan</span>
          </div>
          <nav className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#reviews">Reviews</a>
          </nav>
          <div className="lp-nav-right">
            <Link href="/login" className="lp-btn-ghost">Login</Link>
            <Link href="/login" className="lp-btn-red">Get Started Free</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="lp-hero-blob a"/><div className="lp-hero-blob b"/>
        <div className="lp-wrap lp-hero-inner">
          <div className="lp-hero-text">
            <div className="lp-badge">
              <span className="material-symbols-rounded filled" style={{fontSize:13}}>auto_awesome</span>
              Trusted by 500+ teachers across India
            </div>
            <h1 className="lp-h1">
              The smarter way to run<br/>
              <span className="lp-accent">your coaching centre</span>
            </h1>
            <p className="lp-hero-sub">
              Students, batches, attendance, fees, notes and tests — all in one beautifully simple dashboard. Stop juggling spreadsheets. Start teaching.
            </p>
            <div className="lp-hero-ctas">
              <Link href="/login" className="lp-btn-red lp-btn-lg">
                <span className="material-symbols-rounded filled" style={{fontSize:17}}>rocket_launch</span>
                Start for free
              </Link>
              <a href="#features" className="lp-btn-outline lp-btn-lg">See features →</a>
            </div>
            <div className="lp-proof">
              <div className="lp-avatars">
                {['RM','PS','SK','AK','NV'].map(i=><div key={i} className="lp-av">{i}</div>)}
              </div>
              <span>Join 500+ teachers saving hours every week</span>
            </div>
          </div>

          {/* App mockup */}
          <div className="lp-mockup">
            <div className="lp-mock-card">
              <div className="lp-mock-bar">
                <span/><span/><span/>
                <div className="lp-mock-url"/>
              </div>
              <div className="lp-mock-body">
                <div className="lp-mock-kpis">
                  {[{icon:'group',v:'48',l:'Students',c:'#1565C0'},{icon:'currency_rupee',v:'₹42K',l:'Collected',c:'#2E7D32'},{icon:'payments',v:'₹8.5K',l:'Pending',c:'#D32F2F'}].map(k=>(
                    <div key={k.l} className="lp-mk">
                      <div className="lp-mk-icon" style={{'--mc':k.c} as React.CSSProperties}>
                        <span className="material-symbols-rounded filled" style={{fontSize:13}}>{k.icon}</span>
                      </div>
                      <div><b style={{fontSize:12}}>{k.v}</b><div style={{fontSize:10,color:'#999'}}>{k.l}</div></div>
                    </div>
                  ))}
                </div>
                <div className="lp-mock-label">Today's Schedule</div>
                {[{t:'9:00 AM',n:'Class 10 Maths',s:12,a:false},{t:'11:30 AM',n:'JEE Physics',s:8,a:true},{t:'4:00 PM',n:'Algebra Mock',s:15,a:false}].map(c=>(
                  <div key={c.t} className={`lp-mc ${c.a?'active':''}`}>
                    <span style={{fontSize:9,color:'#aaa',minWidth:52}}>{c.t}</span>
                    <div className={`lp-mc-bar ${c.a?'active':''}`}/>
                    <div style={{flex:1}}><div style={{fontSize:10,fontWeight:600}}>{c.n}</div><div style={{fontSize:9,color:'#bbb'}}>{c.s} students</div></div>
                    {c.a && <span className="lp-live">Live</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="lp-float lp-f1">
              <span className="material-symbols-rounded filled" style={{fontSize:15,color:'#2E7D32'}}>payments</span>
              Fee collected ₹1,500
            </div>
            <div className="lp-float lp-f2">
              <span className="material-symbols-rounded filled" style={{fontSize:15,color:'#1565C0'}}>fact_check</span>
              Attendance marked
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="lp-stats">
        <div className="lp-wrap lp-stats-grid">
          {STATS.map(s=>(
            <div key={s.label} className="lp-stat">
              <div className="lp-stat-n">{s.n}</div>
              <div className="lp-stat-l">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="lp-section">
        <div className="lp-wrap">
          <div className="lp-sec-head">
            <div className="lp-chip">Everything you need</div>
            <h2 className="lp-h2">Built for how teachers actually work</h2>
            <p className="lp-sec-sub">Every feature designed by listening to 100+ teachers on what they actually struggle with.</p>
          </div>
          <div className="lp-feat-grid">
            {FEATURES.map(f=>(
              <div key={f.title} className="lp-feat">
                <div className="lp-feat-icon" style={{'--fc':f.c} as React.CSSProperties}>
                  <span className="material-symbols-rounded filled">{f.icon}</span>
                </div>
                <h3 className="lp-feat-title">{f.title}</h3>
                <p className="lp-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="lp-section lp-alt">
        <div className="lp-wrap">
          <div className="lp-sec-head">
            <div className="lp-chip">Simple setup</div>
            <h2 className="lp-h2">Up and running in 5 minutes</h2>
          </div>
          <div className="lp-steps">
            {STEPS.map((s,i)=>(
              <div key={s.step} className="lp-step">
                <div className="lp-step-num">{s.step}</div>
                <div className="lp-step-icon">
                  <span className="material-symbols-rounded filled">{s.icon}</span>
                </div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
                {i < STEPS.length-1 && <div className="lp-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="reviews" className="lp-section">
        <div className="lp-wrap">
          <div className="lp-sec-head">
            <div className="lp-chip">Loved by teachers</div>
            <h2 className="lp-h2">Real teachers. Real results.</h2>
          </div>
          <div className="lp-testi-grid">
            {TESTIMONIALS.map(t=>(
              <div key={t.name} className="lp-testi">
                <div className="lp-testi-stars">★★★★★</div>
                <p className="lp-testi-q">"{t.quote}"</p>
                <div className="lp-testi-who">
                  <div className="lp-testi-av">{t.i}</div>
                  <div>
                    <div className="lp-testi-name">{t.name}</div>
                    <div className="lp-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-wrap lp-cta-inner">
          <h2 className="lp-cta-h">Ready to take back your time?</h2>
          <p className="lp-cta-sub">Join 500+ teachers who've already simplified their institutes with Alogyan.</p>
          <Link href="/login" className="lp-btn-white lp-btn-lg">
            <span className="material-symbols-rounded filled" style={{fontSize:17}}>rocket_launch</span>
            Get started for free
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-wrap lp-footer-inner">
          <div className="lp-logo">
            <div className="lp-logo-mark"><span className="material-symbols-rounded filled">school</span></div>
            <span className="lp-logo-text">Alogyan</span>
          </div>
          <p className="lp-footer-copy">© 2026 Alogyan. Built for teachers, by teachers.</p>
          <div className="lp-footer-links">
            <Link href="/login">Login</Link>
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
