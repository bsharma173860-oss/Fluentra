// ── Settings / Account / Billing — desktop & mobile ───────────
const { useState: useStateS } = React;

// Shared settings nav items
const SETTINGS_NAV = [
  { id:'account',       label:'Account',       ic:'user' },
  { id:'subscription',  label:'Subscription',  ic:'spark' },
  { id:'billing',       label:'Billing',       ic:'creditcard' },
  { id:'preferences',   label:'Preferences',   ic:'settings' },
  { id:'notifications', label:'Notifications', ic:'bell' },
  { id:'data',          label:'Data & privacy',ic:'shield' },
];

// Add a couple icons we don't have
if (!Icon.creditcard) Icon.creditcard = ({width=14,height=14,color='currentColor'}={}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
);
if (!Icon.shield) Icon.shield = ({width=14,height=14,color='currentColor'}={}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
if (!Icon.settings) Icon.settings = ({width=14,height=14,color='currentColor'}={}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);

// ═══ desktop ═══════════════════════════════════════════════
function SettingsPage() {
  const [tab, setTab] = useStateS('account');
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 36px' }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Settings</div>
            <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1.1 }}>Manage your account</div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:32 }}>
            {/* Sidebar */}
            <div style={{ display:'flex', flexDirection:'column', gap:2, position:'sticky', top:0, alignSelf:'flex-start' }}>
              {SETTINGS_NAV.map(item => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, fontSize:13, fontWeight:tab===item.id?700:500, color:tab===item.id?T.ink:T.ink3, background:tab===item.id?T.bg2:'transparent', textAlign:'left', cursor:'pointer' }}>
                  {Icon[item.ic]({ width:14, height:14 })}
                  {item.label}
                </button>
              ))}
              <div style={{ height:1, background:T.border, margin:'12px 6px' }}/>
              <button style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, fontSize:13, fontWeight:500, color:T.brand, textAlign:'left', cursor:'pointer' }}>
                {Icon.x({ width:14, height:14 })}
                Sign out
              </button>
            </div>

            {/* Tab content */}
            <div>
              {tab === 'account'       && <AccountTab/>}
              {tab === 'subscription'  && <SubscriptionTab/>}
              {tab === 'billing'       && <BillingTab/>}
              {tab === 'preferences'   && <PreferencesTab/>}
              {tab === 'notifications' && <NotificationsTab/>}
              {tab === 'data'          && <DataPrivacyTab/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHd({ title, sub }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ fontSize:18, fontWeight:700, color:T.ink, marginBottom:4 }}>{title}</div>
      {sub && <div style={{ fontSize:13, color:T.ink4, lineHeight:1.55 }}>{sub}</div>}
    </div>
  );
}

function FormRow({ label, value, onChange, type='text', placeholder }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:16, alignItems:'center', padding:'14px 0', borderBottom:`1px solid ${T.hairline}` }}>
      <label style={{ fontSize:12.5, color:T.ink3, fontWeight:600 }}>{label}</label>
      <input type={type} defaultValue={value} placeholder={placeholder} onChange={onChange}
        style={{ padding:'9px 12px', borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, color:T.ink, fontFamily:"'Inter',sans-serif", outline:'none', maxWidth:380 }}/>
    </div>
  );
}

function AccountTab() {
  const [acctName, setAcctName] = useStateS(USER.name);
  const [acctSaved, setAcctSaved] = useStateS(false);
  return (
    <div>
      <SectionHd title="Account details" sub="Update your name, email, and password. Changes apply across all devices."/>
      <Card padding={24} style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:18, padding:'4px 0 18px', borderBottom:`1px solid ${T.hairline}`, marginBottom:6 }}>
          <div style={{ width:64, height:64, borderRadius:32, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:28 }}>M</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:2 }}>María García</div>
            <div style={{ fontSize:12.5, color:T.ink4 }}>maria@example.com · Member since Mar 2025</div>
          </div>
          <Btn label="Change photo" variant="outline" accent={T.ink2} size="sm"/>
        </div>
        <FormRow label="Full name" value={USER.name} onChange={e => setAcctName(e.target.value)}/>
        <FormRow label="Email" value={USER.email} type="email"/>
        <FormRow label="Phone" value="" placeholder="+34 600 000 000" type="tel"/>
        <FormRow label="Country" value="Spain"/>
      </Card>

      <SectionHd title="Password & security"/>
      <Card padding={24} style={{ marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${T.hairline}` }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>Password</div>
            <div style={{ fontSize:12, color:T.ink4 }}>Last changed 2 months ago</div>
          </div>
          <Btn nav="settings" label="Change password" variant="outline" size="sm" accent={T.ink2}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:`1px solid ${T.hairline}` }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>Two-factor authentication</div>
            <div style={{ fontSize:12, color:T.ink4 }}>Adds an extra step when signing in</div>
          </div>
          <Btn label="Enable" accent={T.brand} size="sm"/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0' }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>Connected accounts</div>
            <div style={{ fontSize:12, color:T.ink4 }}>Google · maria@gmail.com</div>
          </div>
          <Btn label="Manage" variant="outline" size="sm" accent={T.ink2}/>
        </div>
      </Card>

      <Btn label={acctSaved ? "Saved ✓" : "Save changes"} accent={T.brand} size="lg" onClick={() => { if (window.FL && window.FL.updateProfile) { window.FL.updateProfile({ full_name: acctName }).then(function(){ setAcctSaved(true); setTimeout(function(){ setAcctSaved(false); }, 1500); }).catch(function(){}); } }}/>
    </div>
  );
}

function SubscriptionTab() {
  return (
    <div>
      <SectionHd title="Subscription"/>
      {/* Current plan card */}
      <div style={{ background:T.ink, borderRadius:18, padding:'28px 32px', color:'#fff', marginBottom:24, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:.04, background:'radial-gradient(circle at 100% 0%, #fff 0%, transparent 60%)' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <Chip label="Current plan" accent="rgba(255,255,255,.85)" bg="rgba(255,255,255,.1)" style={{ marginBottom:14 }}/>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18 }}>
            <div>
              <div style={{ fontFamily:T.serif, fontSize:36, lineHeight:1, marginBottom:6 }}>Fluentra Pro</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.6)' }}>Renews May 28, 2026 · $24 / month</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1 }}>$24</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', marginTop:3 }}>per month</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn nav="pricing" label="Manage plan" accent="#fff" size="sm" style={{ background:'#fff', color:T.ink }}/>
            <Btn label="Manage billing" variant="outline" accent="rgba(255,255,255,.4)" size="sm" style={{ color:'rgba(255,255,255,.85)' }} onClick={() => window.FL && window.FL.openBillingPortal && window.FL.openBillingPortal()}/>
          </div>
        </div>
      </div>

      <SectionHd title="What's included"/>
      <Card padding={24} style={{ marginBottom:24 }}>
        {[
          { ic:'spark', label:'Unlimited AI Tutor', v:'Used 142 sessions this month' },
          { ic:'mic',   label:'Speaking practice',  v:'Unlimited conversations' },
          { ic:'pen',   label:'AI Writing feedback',v:'Unlimited essays · Band-level scoring' },
          { ic:'trophy',label:'Monthly Exam',       v:'1 entry/month included · 3 used' },
          { ic:'book',  label:'Premium content',    v:'500+ lessons · 24 IELTS practice tests' },
        ].map((f,i,arr) => (
          <div key={f.label} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:i<arr.length-1?`1px solid ${T.hairline}`:'none' }}>
            <div style={{ width:34, height:34, borderRadius:9, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {Icon[f.ic]({ width:14, height:14 })}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>{f.label}</div>
              <div style={{ fontSize:12, color:T.ink4 }}>{f.v}</div>
            </div>
            <div style={{ color:T.listening.c }}>{Icon.check({ width:15, height:15 })}</div>
          </div>
        ))}
      </Card>

      <SectionHd title="Compare plans"/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {[
          { name:'Free', price:'$0', sub:'1 session/day · English', features:['1 session per day','English only','5 AI Tutor msgs / day','Basic progress'], current:false, cta:'Downgrade' },
          { name:'Pro',  price:'$24', sub:'Per month · Most popular', features:['All languages','Unlimited AI Tutor','AI Writing feedback','Monthly Exam included','Priority support'], current:true, cta:'Current' },
        ].map(p => (
          <div key={p.name} style={{ background:T.card, border:`1.5px solid ${p.current?T.brand:T.border}`, borderRadius:14, padding:22, position:'relative' }}>
            {p.current && <Chip label="Current" accent={T.brand} bg={T.brandLight} style={{ position:'absolute', top:14, right:14, fontSize:9 }}/>}
            <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:6 }}>{p.name}</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:4 }}>
              <span style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1 }}>{p.price}</span>
              <span style={{ fontSize:11, color:T.ink4 }}>{p.name==='Pro'?'/mo':''}</span>
            </div>
            <div style={{ fontSize:11, color:T.ink4, marginBottom:14 }}>{p.sub}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {p.features.map(f => (
                <div key={f} style={{ display:'flex', gap:8, alignItems:'flex-start', fontSize:12, color:T.ink2 }}>
                  <span style={{ color:T.listening.c, flexShrink:0 }}>{Icon.check({ width:11, height:11 })}</span>
                  {f}
                </div>
              ))}
            </div>
            <div style={{ marginTop:16 }}>
              <Btn label={p.cta} accent={p.current?T.ink4:T.brand} fullWidth size="sm" variant={p.current?'outline':'solid'}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingTab() {
  const invoices = [
    { date:'Apr 28, 2026', desc:'Fluentra Pro · Monthly', amt:'$24.00', status:'Paid' },
    { date:'Apr 12, 2026', desc:'IELTS Practice Exam · April',  amt:'$5.00', status:'Paid' },
    { date:'Mar 28, 2026', desc:'Fluentra Pro · Monthly', amt:'$24.00', status:'Paid' },
    { date:'Mar 12, 2026', desc:'IELTS Practice Exam · March',  amt:'$5.00', status:'Paid' },
    { date:'Feb 28, 2026', desc:'Fluentra Pro · Monthly', amt:'$24.00', status:'Paid' },
  ];
  return (
    <div>
      <SectionHd title="Billing & payment"/>

      <SectionHd title="Payment method"/>
      <Card padding={20} style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'8px 0' }}>
          <div style={{ width:48, height:32, borderRadius:6, background:'linear-gradient(135deg,#1A1F71,#3358D4)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13, fontWeight:700, letterSpacing:'.05em' }}>VISA</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13.5, fontWeight:600, color:T.ink, marginBottom:2 }}>Visa ending in 4242</div>
            <div style={{ fontSize:12, color:T.ink4 }}>Expires 09/27</div>
          </div>
          <Btn label="Replace" variant="outline" accent={T.ink2} size="sm"/>
        </div>
      </Card>

      <SectionHd title="Billing address"/>
      <Card padding={24} style={{ marginBottom:24 }}>
        <FormRow label="Name on bill" value="María García"/>
        <FormRow label="Address line 1" value="Calle de Serrano 41"/>
        <FormRow label="City" value="Madrid"/>
        <FormRow label="Postal code" value="28001"/>
        <FormRow label="Country" value="Spain"/>
        <FormRow label="VAT number" value="" placeholder="Optional"/>
      </Card>

      <SectionHd title="Invoice history"/>
      <Card padding={0} style={{ marginBottom:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'140px 1fr 100px 100px 80px', padding:'12px 20px', fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', borderBottom:`1px solid ${T.hairline}` }}>
          <div>Date</div><div>Description</div><div style={{ textAlign:'right' }}>Amount</div><div style={{ textAlign:'center' }}>Status</div><div></div>
        </div>
        {invoices.map((inv,i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'140px 1fr 100px 100px 80px', padding:'14px 20px', alignItems:'center', borderBottom:i<invoices.length-1?`1px solid ${T.hairline}`:'none', fontSize:13 }}>
            <div style={{ color:T.ink3 }}>{inv.date}</div>
            <div style={{ color:T.ink, fontWeight:500 }}>{inv.desc}</div>
            <div style={{ color:T.ink, fontWeight:600, textAlign:'right' }}>{inv.amt}</div>
            <div style={{ textAlign:'center' }}><Chip label={inv.status} accent={T.listening.c} bg={T.listening.bg} style={{ fontSize:10 }}/></div>
            <div style={{ textAlign:'right' }}>
              <button style={{ fontSize:12, color:T.brand, fontWeight:600, cursor:'pointer', background:'transparent' }}>PDF</button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function PreferencesTab() {
  const _pu = (typeof window !== 'undefined' && window.__user) || {};
  const [exam, setExam] = useStateS(_pu.targetExam || 'IELTS Academic');
  const [target, setTarget] = useStateS(_pu.targetScore || 7.0);
  const [native, setNative] = useStateS(_pu.nativeLang || 'Spanish');
  const _saveProfile = function (patch) { if (window.FL && window.FL.updateProfile) window.FL.updateProfile(patch).catch(function(){}); };
  return (
    <div>
      <SectionHd title="Learning preferences"/>
      <Card padding={24} style={{ marginBottom:24 }}>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:12.5, color:T.ink3, fontWeight:600, marginBottom:8 }}>Target exam</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['IELTS Academic','IELTS General','TOEFL iBT','Cambridge C2','Duolingo'].map(e => (
              <button key={e} onClick={() => { setExam(e); _saveProfile({ target_exam: e }); }} style={{ padding:'8px 14px', borderRadius:9, border:`1.5px solid ${exam===e?T.brand:T.border}`, background:exam===e?T.brandLight:T.card, fontSize:12.5, fontWeight:exam===e?700:500, color:exam===e?T.brand:T.ink2, cursor:'pointer' }}>{e}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            <span style={{ fontSize:12.5, color:T.ink3, fontWeight:600 }}>Target band score</span>
            <span style={{ fontFamily:T.serif, fontSize:24, color:T.brand }}>{target.toFixed(1)}</span>
          </div>
          <input type="range" min="4" max="9" step="0.5" value={target} onChange={e=>{ setTarget(+e.target.value); _saveProfile({ target_score: +e.target.value }); }}
            style={{ width:'100%', accentColor:T.brand }}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:T.ink5, marginTop:4 }}>
            <span>4.0</span><span>5.0</span><span>6.0</span><span>7.0</span><span>8.0</span><span>9.0</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize:12.5, color:T.ink3, fontWeight:600, marginBottom:8 }}>Native language</div>
          <select value={native} onChange={e=>{ setNative(e.target.value); _saveProfile({ native_language: e.target.value }); }} style={{ width:'100%', maxWidth:380, padding:'10px 12px', borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, color:T.ink, fontFamily:"'Inter',sans-serif", outline:'none', background:T.card }}>
            {['Spanish','Arabic','English','French','German','Portuguese','Mandarin','Japanese','Korean','Hindi'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      </Card>

      <SectionHd title="Daily goal"/>
      <Card padding={24} style={{ marginBottom:24 }}>
        <div style={{ display:'flex', gap:10 }}>
          {[10,20,30,45,60].map(m => (
            <button key={m} style={{ flex:1, padding:'14px 0', borderRadius:11, border:`1.5px solid ${m===20?T.brand:T.border}`, background:m===20?T.brandLight:T.card, cursor:'pointer' }}>
              <div style={{ fontFamily:T.serif, fontSize:24, color:m===20?T.brand:T.ink, lineHeight:1 }}>{m}</div>
              <div style={{ fontSize:10, color:m===20?T.brand:T.ink4, fontWeight:600, marginTop:4 }}>min/day</div>
            </button>
          ))}
        </div>
      </Card>

      <SectionHd title="Appearance"/>
      <Card padding={20}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          {[{l:'Light',bg:'#F6F4EF'},{l:'Dark',bg:'#1A1A1A'},{l:'System',bg:'linear-gradient(90deg,#F6F4EF 50%,#1A1A1A 50%)'}].map((m,i) => (
            <button key={m.l} style={{ padding:14, borderRadius:11, border:`1.5px solid ${i===0?T.brand:T.border}`, background:T.card, cursor:'pointer', textAlign:'center' }}>
              <div style={{ height:60, borderRadius:8, background:m.bg, marginBottom:10, border:`1px solid ${T.hairline}` }}/>
              <div style={{ fontSize:12, fontWeight:i===0?700:500, color:i===0?T.brand:T.ink2 }}>{m.l}</div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ToggleRow({ label, sub, on=false }) {
  const [v, setV] = useStateS(on);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:`1px solid ${T.hairline}` }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>{label}</div>
        {sub && <div style={{ fontSize:12, color:T.ink4 }}>{sub}</div>}
      </div>
      <button onClick={() => setV(x=>!x)} style={{ width:42, height:24, borderRadius:12, background:v?T.brand:T.bg3, position:'relative', cursor:'pointer', transition:'.2s' }}>
        <div style={{ width:18, height:18, borderRadius:9, background:'#fff', position:'absolute', top:3, left:v?21:3, transition:'.2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
      </button>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      <SectionHd title="Notifications"/>
      <Card padding={24} style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Streak & habits</div>
        <ToggleRow label="Daily reminder" sub="A nudge at your preferred time" on/>
        <ToggleRow label="Streak warnings" sub="Tell me when my streak is at risk" on/>
        <ToggleRow label="Weekly recap" sub="Sunday summary of your progress" on/>
      </Card>

      <Card padding={24} style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Learning</div>
        <ToggleRow label="New content alerts" sub="When new lessons drop in your language" on/>
        <ToggleRow label="AI Tutor reply" sub="Notify when async responses arrive"/>
        <ToggleRow label="Exam reminders" sub="48h, 24h, 1h before scheduled exams" on/>
      </Card>

      <Card padding={24}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Marketing</div>
        <ToggleRow label="Product updates" sub="Important changes & new features"/>
        <ToggleRow label="Tips & study advice" sub="Newsletter every other week"/>
        <ToggleRow label="Promotions" sub="Discounts and special offers"/>
      </Card>
    </div>
  );
}

function DataPrivacyTab() {
  return (
    <div>
      <SectionHd title="Data & privacy"/>
      <Card padding={24} style={{ marginBottom:24 }}>
        <ToggleRow label="Personalised recommendations" sub="Use my activity to suggest content" on/>
        <ToggleRow label="Anonymous analytics" sub="Help us improve Fluentra" on/>
        <ToggleRow label="Show me on the global leaderboard" sub="Your name & score are visible to others" on/>
        <ToggleRow label="Public profile" sub="Allow other learners to view your progress"/>
      </Card>

      <SectionHd title="Your data"/>
      <Card padding={20} style={{ marginBottom:24 }}>
        {[
          { label:'Export my data', sub:'Download a JSON archive of your activity', cta:'Request export', accent:T.ink2 },
          { label:'Privacy policy',   sub:'Read how we collect and use your data', cta:'Open policy', accent:T.ink2, nav:'privacy' },
          { label:'Terms of service', sub:'The agreement that governs your account', cta:'Open terms', accent:T.ink2, nav:'terms' },
        ].map((r,i,a) => (
          <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:i<a.length-1?`1px solid ${T.hairline}`:'none' }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>{r.label}</div>
              <div style={{ fontSize:12, color:T.ink4 }}>{r.sub}</div>
            </div>
            <Btn label={r.cta} variant="outline" size="sm" accent={r.accent} nav={r.nav}/>
          </div>
        ))}
      </Card>

      <SectionHd title="Danger zone"/>
      <Card padding={24} style={{ borderColor:'#FECACA', background:'#FEF7F7' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:'#DC2626', marginBottom:3 }}>Delete account permanently</div>
            <div style={{ fontSize:12, color:'#991B1B' }}>This will erase your progress, exam history, and certificates. Cannot be undone.</div>
          </div>
          <Btn label="Delete account" accent="#DC2626" size="sm" variant="outline"/>
        </div>
      </Card>
    </div>
  );
}

// ═══ mobile ═══════════════════════════════════════════════
function MSettingsPage() {
  const [view, setView] = useStateS('list');

  const renderTab = () => {
    if (view === 'account')       return <AccountTab/>;
    if (view === 'subscription')  return <SubscriptionTab/>;
    if (view === 'billing')       return <BillingTab/>;
    if (view === 'preferences')   return <PreferencesTab/>;
    if (view === 'notifications') return <NotificationsTab/>;
    if (view === 'data')          return <DataPrivacyTab/>;
    return null;
  };

  if (view !== 'list') {
    return (
      <MobileFrame>
        <MobileBody noTabs>
          <div style={{ padding:'14px 16px 12px', display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${T.hairline}` }}>
            <button onClick={() => setView('list')} style={{ width:32, height:32, borderRadius:8, background:T.bg2, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div style={{ fontSize:14, fontWeight:700, color:T.ink, textTransform:'capitalize' }}>{SETTINGS_NAV.find(s=>s.id===view)?.label}</div>
          </div>
          <div style={{ padding:'18px 16px 32px' }}>
            {renderTab()}
          </div>
        </MobileBody>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <MobileBody>
        <div style={{ padding:'14px 16px 8px' }}>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Profile</div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.05 }}>Settings</div>
        </div>

        {/* User card */}
        <div style={{ margin:'14px 16px', background:T.ink, borderRadius:18, padding:'22px 20px', color:'#fff', display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:56, height:56, borderRadius:28, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:24 }}>M</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:3 }}>María García</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.65)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>maria@example.com</div>
            <div style={{ marginTop:8 }}>
              <Chip label="Pro · Renews May 28" accent="rgba(255,255,255,.9)" bg="rgba(255,255,255,.12)" style={{ fontSize:10 }}/>
            </div>
          </div>
        </div>

        {/* Streak/stats row */}
        <div style={{ margin:'4px 16px 14px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          {[
            { l:'Streak', v:'42', s:'days' },
            { l:'Sessions', v:'142', s:'this month' },
            { l:'Avg band', v:'7.5', s:'across exams' },
          ].map(s => (
            <div key={s.l} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:'12px 10px', textAlign:'center' }}>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:9.5, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginTop:4 }}>{s.l}</div>
              <div style={{ fontSize:9, color:T.ink5, marginTop:2 }}>{s.s}</div>
            </div>
          ))}
        </div>

        {/* Settings list */}
        <div style={{ margin:'10px 16px 0', background:T.card, border:`1px solid ${T.border}`, borderRadius:14, overflow:'hidden' }}>
          {SETTINGS_NAV.map((item,i,a) => (
            <button key={item.id} onClick={() => setView(item.id)}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderBottom:i<a.length-1?`1px solid ${T.hairline}`:'none', width:'100%', textAlign:'left', background:T.card, cursor:'pointer' }}>
              <div style={{ width:34, height:34, borderRadius:9, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {Icon[item.ic]({ width:14, height:14 })}
              </div>
              <div style={{ flex:1, fontSize:13, fontWeight:600, color:T.ink }}>{item.label}</div>
              <span style={{ color:T.ink5, fontSize:18, lineHeight:1 }}>›</span>
            </button>
          ))}
        </div>

        <div style={{ margin:'18px 16px 32px' }}>
          <Btn nav="auth_login" label="Sign out" variant="outline" accent={T.brand} fullWidth icon={Icon.x({ width:13, height:13 })}/>
          <div style={{ textAlign:'center', fontSize:11, color:T.ink5, marginTop:14 }}>Fluentra v2.4.0 · Build 1240</div>
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

Object.assign(window, { SettingsPage, MSettingsPage });
