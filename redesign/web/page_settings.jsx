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
              <button onClick={() => window.__signOut && window.__signOut()} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, fontSize:13, fontWeight:500, color:T.brand, textAlign:'left', cursor:'pointer' }}>
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
          <div style={{ width:64, height:64, borderRadius:32, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:28 }}>{USER.initial}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:2 }}>{USER.name}</div>
            <div style={{ fontSize:12.5, color:T.ink4 }}>{USER.email}</div>
          </div>
          <Btn label="Change photo" variant="outline" accent={T.ink2} size="sm"/>
        </div>
        <FormRow label="Full name" value={USER.name} onChange={e => setAcctName(e.target.value)}/>
        <FormRow label="Email" value={USER.email} type="email"/>
        <FormRow label="Phone" value="" placeholder="+34 600 000 000" type="tel"/>
      </Card>

      <SectionHd title="Password & security"/>
      <Card padding={24} style={{ marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0' }}>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>Password</div>
            <div style={{ fontSize:12, color:T.ink4 }}>Reset your password by email</div>
          </div>
          <Btn label="Reset password" variant="outline" size="sm" accent={T.ink2} onClick={function(){ if (window.FL && window.FL.resetPassword && window.__user && window.__user.email) { window.FL.resetPassword(window.__user.email).then(function(){ alert('Password reset link sent to ' + window.__user.email); }).catch(function(){}); } }}/>
        </div>
      </Card>

      <Btn label={acctSaved ? "Saved ✓" : "Save changes"} accent={T.brand} size="lg" onClick={() => { if (window.FL && window.FL.updateProfile) { window.FL.updateProfile({ full_name: acctName }).then(function(){ setAcctSaved(true); setTimeout(function(){ setAcctSaved(false); }, 1500); }).catch(function(){}); } }}/>
    </div>
  );
}

function SubscriptionTab() {
  const u = (typeof window !== 'undefined' && window.__user) || {};
  const plan = (u.plan || 'free').toLowerCase();
  const isPaid = plan === 'pro' || plan === 'max';
  const status = u.subscriptionStatus || null;
  const renews = u.renewsOn || '';
  const PLAN_META = { free:{ name:'Fluentra Free', price:'$0', per:'' }, pro:{ name:'Fluentra Pro', price:'$24', per:'/ month' }, max:{ name:'Fluentra Max', price:'$59', per:'/ month' } };
  const meta = PLAN_META[plan] || PLAN_META.free;
  const statusLabel = status === 'trialing' ? 'Free trial' : status === 'past_due' ? 'Payment past due' : status === 'canceled' ? 'Cancels at period end' : (isPaid ? 'Active' : '');
  return (
    <div>
      <SectionHd title="Subscription"/>
      {/* Current plan card — reflects the real plan on the profile */}
      <div style={{ background:T.ink, borderRadius:18, padding:'28px 32px', color:'#fff', marginBottom:24, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:.04, background:'radial-gradient(circle at 100% 0%, #fff 0%, transparent 60%)' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <Chip label="Current plan" accent="rgba(255,255,255,.85)" bg="rgba(255,255,255,.1)" style={{ marginBottom:14 }}/>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18 }}>
            <div>
              <div style={{ fontFamily:T.serif, fontSize:36, lineHeight:1, marginBottom:6 }}>{meta.name}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.6)' }}>
                {isPaid
                  ? ((statusLabel || 'Active') + (renews ? ' · ' + (status==='canceled'?'Ends ':'Renews ') + renews : '') + ' · ' + meta.price + ' ' + meta.per)
                  : 'Free plan — upgrade to unlock every language, unlimited AI tutor, and writing feedback.'}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1 }}>{meta.price}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', marginTop:3 }}>{isPaid ? 'per month' : 'forever'}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {isPaid
              ? <React.Fragment>
                  <Btn nav="pricing" label="Change plan" accent="#fff" size="sm" style={{ background:'#fff', color:T.ink }}/>
                  <Btn label="Manage billing" variant="outline" accent="rgba(255,255,255,.4)" size="sm" style={{ color:'rgba(255,255,255,.85)' }} onClick={() => window.FL && window.FL.openBillingPortal && window.FL.openBillingPortal()}/>
                </React.Fragment>
              : <Btn nav="pricing" label="See plans & upgrade" accent="#fff" size="sm" style={{ background:'#fff', color:T.ink }}/>}
          </div>
        </div>
      </div>

      <SectionHd title="Compare plans"/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
        {[
          { key:'free', name:'Free', price:'$0',  sub:'1 session/day · English',     features:['1 session per day','English only','Limited AI Tutor','Basic progress'] },
          { key:'pro',  name:'Pro',  price:'$24', sub:'Per month · Most popular',     features:['All languages','Unlimited AI Tutor','AI Writing feedback','Monthly Exam included','Priority support'] },
          { key:'max',  name:'Max',  price:'$59', sub:'Per month · Power users',      features:['Everything in Pro','Highest usage limits','Early access features','Priority exam grading'] },
        ].map(function (p) {
          var current = p.key === plan;
          return (
          <div key={p.name} style={{ background:T.card, border:'1.5px solid '+(current?T.brand:T.border), borderRadius:14, padding:22, position:'relative' }}>
            {current && <Chip label="Current" accent={T.brand} bg={T.brandLight} style={{ position:'absolute', top:14, right:14, fontSize:9 }}/>}
            <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:6 }}>{p.name}</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:4 }}>
              <span style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1 }}>{p.price}</span>
              <span style={{ fontSize:11, color:T.ink4 }}>{p.key!=='free'?'/mo':''}</span>
            </div>
            <div style={{ fontSize:11, color:T.ink4, marginBottom:14 }}>{p.sub}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {p.features.map(function (fe) { return (
                <div key={fe} style={{ display:'flex', gap:8, alignItems:'flex-start', fontSize:12, color:T.ink2 }}>
                  <span style={{ color:T.listening.c, flexShrink:0 }}>{Icon.check({ width:11, height:11 })}</span>
                  {fe}
                </div>
              ); })}
            </div>
            <div style={{ marginTop:16 }}>
              <Btn label={current ? 'Current plan' : (p.key==='free' ? 'Downgrade' : 'Choose ' + p.name)} accent={current?T.ink4:T.brand} fullWidth size="sm" variant={current?'outline':'solid'}
                onClick={current ? undefined : function(){ if (p.key==='free') { window.FL && window.FL.openBillingPortal && window.FL.openBillingPortal(); } else { window.FL && window.FL.startCheckout && window.FL.startCheckout(p.key + '_monthly'); } }}/>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function BillingTab() {
  const u = (typeof window !== 'undefined' && window.__user) || {};
  const isPaid = (u.plan === 'pro' || u.plan === 'max');
  return (
    <div>
      <SectionHd title="Billing & payment" sub="Your payment method, billing address, and invoices are managed securely in the billing portal."/>
      <Card padding={24} style={{ marginBottom:24 }}>
        {isPaid ? (
          <div>
            <div style={{ fontSize:13.5, color:T.ink2, lineHeight:1.6, marginBottom:16 }}>
              Update your card, change your billing address, download past invoices, or cancel your plan — all in the secure billing portal.
            </div>
            <Btn label="Open billing portal" accent={T.brand} onClick={() => window.FL && window.FL.openBillingPortal && window.FL.openBillingPortal()}/>
          </div>
        ) : (
          <div>
            <div style={{ fontSize:13.5, color:T.ink2, lineHeight:1.6, marginBottom:16 }}>
              You're on the Free plan, so there's nothing to bill yet. Upgrade to Pro or Max to unlock every language, unlimited tutor, and writing feedback.
            </div>
            <Btn label="See plans" nav="pricing" accent={T.brand}/>
          </div>
        )}
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

function ToggleRow({ label, sub, on=false, prefKey }) {
  const _key = 'fl-pref:' + ((typeof window !== 'undefined' && window.__user && window.__user.id) || 'anon') + ':' + (prefKey || label);
  const _init = (function () { try { var s = localStorage.getItem(_key); return s === null ? on : s === '1'; } catch (e) { return on; } })();
  const [v, setV] = useStateS(_init);
  const toggle = function () { setV(function (x) { var nv = !x; try { localStorage.setItem(_key, nv ? '1' : '0'); } catch (e) {} return nv; }); };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:`1px solid ${T.hairline}` }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>{label}</div>
        {sub && <div style={{ fontSize:12, color:T.ink4 }}>{sub}</div>}
      </div>
      <button onClick={toggle} style={{ width:42, height:24, borderRadius:12, background:v?T.brand:T.bg3, position:'relative', cursor:'pointer', transition:'.2s' }}>
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