// ── Stripe-style Checkout ─────────────────────────────────────
// Universal payment page. Reads window.__checkoutItem for context:
//   { id, name, sub, amount, recurring, returnTo, success }
// All "pay" buttons in the app navigate here with that context set.

const CHECKOUT_PRESETS = {
  pro_monthly:    { id:'pro_monthly',    name:'Fluentra Pro',          sub:'Monthly subscription · 7-day free trial',  amount:24.00,   currency:'$', recurring:'month', returnTo:'dashboard',     success:'Welcome to Pro' },
  pro_yearly:     { id:'pro_yearly',     name:'Fluentra Pro · Yearly', sub:'Annual subscription · $19/mo billed yearly',           amount:228.00,  currency:'$', recurring:'year',  returnTo:'dashboard',     success:'Welcome to Pro' },
  max_monthly:    { id:'max_monthly',    name:'Fluentra Max',          sub:'Monthly · score guarantee included',       amount:59.00,  currency:'$', recurring:'month', returnTo:'dashboard',     success:'Welcome to Max' },
  max_yearly:     { id:'max_yearly',     name:'Fluentra Max · Yearly', sub:'Annual · $49/mo billed yearly',                        amount:588.00, currency:'$', recurring:'year',  returnTo:'dashboard',     success:'Welcome to Max' },
  exam_official:  { id:'exam_official',  name:'Official monthly exam', sub:'Single attempt · counts toward leaderboard', amount:5.00, currency:'$', recurring:null,    returnTo:'monthly_runner',success:'Exam ready' },
  mock_exam:      { id:'mock_exam',      name:'Mock exam credit',      sub:'Practice mode · same scoring rubric',      amount:2.00,   currency:'$', recurring:null,    returnTo:'mock_runner',   success:'Mock test ready' },
  exam_book:      { id:'exam_book',      name:'IELTS test booking',    sub:'Saturday, June 14 · British Council Madrid',amount:249.00, currency:'$', recurring:null,    returnTo:'exam_history',  success:'Booking confirmed' },
  streak_freeze:  { id:'streak_freeze',  name:'Streak freeze (×3)',    sub:'Save your streak on missed days · pack of 3',amount:1.99,  currency:'$', recurring:null,    returnTo:'dashboard',     success:'Freezes added' },
  tutor_hours:    { id:'tutor_hours',    name:'Live tutor · 5 hours',  sub:'1-on-1 sessions · valid 90 days',          amount:49.00,  currency:'$', recurring:null,    returnTo:'tutor',         success:'Hours added' },
};

function getCheckoutItem() {
  const key = (typeof window !== 'undefined') ? window.__checkoutItem : null;
  if (!key) return CHECKOUT_PRESETS.pro_monthly;
  if (typeof key === 'object') return { ...CHECKOUT_PRESETS.pro_monthly, ...key };
  return CHECKOUT_PRESETS[key] || CHECKOUT_PRESETS.pro_monthly;
}

// ── format card number with spaces ────
function fmtCard(v) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function fmtExp(v) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  if (d.length < 3) return d;
  return d.slice(0, 2) + ' / ' + d.slice(2);
}
function detectBrand(num) {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n))            return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n))        return 'amex';
  if (/^6/.test(n))            return 'discover';
  return null;
}

function CardBrand({ brand }) {
  const C = '#1A1F36';
  if (brand === 'visa')       return <div style={{ fontFamily:'Georgia, serif', fontSize:14, fontStyle:'italic', fontWeight:900, color:'#1434CB', letterSpacing:'.5px' }}>VISA</div>;
  if (brand === 'mastercard') return <div style={{ display:'flex', alignItems:'center' }}><div style={{ width:18, height:18, borderRadius:'50%', background:'#EB001B', marginRight:-6 }}/><div style={{ width:18, height:18, borderRadius:'50%', background:'#F79E1B' }}/></div>;
  if (brand === 'amex')       return <div style={{ background:'#006FCF', color:'#fff', fontSize:9, fontWeight:900, letterSpacing:'.5px', padding:'4px 6px', borderRadius:3 }}>AMEX</div>;
  if (brand === 'discover')   return <div style={{ fontSize:11, fontWeight:900, color:'#FF6000' }}>DISCOVER</div>;
  return <div style={{ width:28, height:18, borderRadius:3, background:'#E5E7EB' }}/>;
}

// ── Stripe-style input ────
function CheckoutInput({ label, value, onChange, placeholder, type='text', maxLength, suffix, error }) {
  return (
    <label style={{ display:'block' }}>
      <div style={{ fontSize:11, fontWeight:600, color:T.ink3, marginBottom:6, letterSpacing:'.02em' }}>{label}</div>
      <div style={{ position:'relative' }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            width:'100%', padding:'12px 14px', paddingRight: suffix ? 56 : 14,
            background:'#fff', border:`1px solid ${error ? '#DC2626' : T.border}`, borderRadius:8,
            fontSize:14, color:T.ink, fontFamily:T.body,
            boxShadow: error ? '0 0 0 3px rgba(220,38,38,.1)' : '0 1px 2px rgba(0,0,0,.04)',
            outline:'none',
          }}
          onFocus={e => { if (!error) e.target.style.boxShadow = `0 0 0 3px ${T.brand}33`; e.target.style.borderColor = error ? '#DC2626' : T.brand; }}
          onBlur={e => { e.target.style.boxShadow = error ? '0 0 0 3px rgba(220,38,38,.1)' : '0 1px 2px rgba(0,0,0,.04)'; e.target.style.borderColor = error ? '#DC2626' : T.border; }}
        />
        {suffix && <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)' }}>{suffix}</div>}
      </div>
      {error && <div style={{ fontSize:11, color:'#DC2626', marginTop:4 }}>{error}</div>}
    </label>
  );
}

// ── Wallet button (Apple/Google Pay style) ────
function WalletButton({ kind, onClick }) {
  const isApple = kind === 'apple';
  return (
    <button onClick={onClick} style={{
      flex:1, padding:'13px 14px', borderRadius:8, cursor:'pointer',
      background: isApple ? '#000' : '#fff',
      color: isApple ? '#fff' : '#3C4043',
      border: isApple ? 'none' : '1px solid #DADCE0',
      fontSize:14, fontWeight:600,
      display:'flex', alignItems:'center', justifyContent:'center', gap:6,
      boxShadow:'0 1px 2px rgba(0,0,0,.06)',
    }}>
      {isApple ? (
        <>
          <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor"><path d="M11.624 8.482c-.018-1.96 1.602-2.911 1.677-2.954-.918-1.342-2.342-1.526-2.844-1.541-1.21-.123-2.367.713-2.984.713-.626 0-1.572-.696-2.586-.676-1.318.02-2.555.776-3.235 1.957-1.396 2.42-.355 5.998 1.001 7.964.674.964 1.467 2.038 2.504 2 1.012-.04 1.39-.65 2.61-.65 1.218 0 1.561.65 2.622.628 1.087-.018 1.769-.961 2.43-1.93.78-1.103 1.094-2.187 1.108-2.243-.024-.012-2.124-.812-2.144-3.234zM9.598 2.715c.555-.674.929-1.609.825-2.541-.799.034-1.764.532-2.337 1.205-.515.595-.965 1.547-.844 2.46.89.07 1.802-.452 2.356-1.124z"/></svg>
          Pay
        </>
      ) : (
        <>
          <svg width="36" height="14" viewBox="0 0 36 14" fill="none">
            <text x="0" y="11" fill="#5F6368" fontFamily="Roboto, Arial, sans-serif" fontSize="11" fontWeight="700">G Pay</text>
          </svg>
        </>
      )}
    </button>
  );
}

// ── Payment method tabs ────
function MethodTabs({ method, setMethod }) {
  const tabs = [
    { id:'card',   label:'Card',          ic:Icon.creditcard ? Icon.creditcard : null },
    { id:'wallet', label:'Apple / Google Pay', ic:null },
    { id:'bank',   label:'Bank transfer', ic:null },
  ];
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${tabs.length}, 1fr)`, gap:6, padding:4, background:T.bg2, borderRadius:10, marginBottom:18 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setMethod(t.id)} style={{
          padding:'9px 12px', borderRadius:7, fontSize:12.5, fontWeight:600,
          background: method === t.id ? '#fff' : 'transparent',
          color: method === t.id ? T.ink : T.ink3,
          boxShadow: method === t.id ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
          cursor:'pointer',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ── Main checkout page ────────────────────────────────────────
function CheckoutPage() {
  const item = getCheckoutItem();
  const nav = window.__nav || (() => {});
  const [method, setMethod] = useState('card');
  const [card, setCard]     = useState('');
  const [exp, setExp]       = useState('');
  const [cvc, setCvc]       = useState('');
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState((typeof window !== 'undefined' && window.__user && window.__user.email) || '');
  const [country, setCountry] = useState('Spain');
  const [zip, setZip]       = useState('28013');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone]     = useState(false);

  const brand = detectBrand(card);
  const subtotal = item.amount;
  const discount = couponApplied ? subtotal * 0.2 : 0;
  const tax = (subtotal - discount) * 0.21; // 21% VAT (Spain)
  const total = subtotal - discount + tax;

  const handlePay = () => {
    var planKey = item.id || ((typeof window !== 'undefined' && typeof window.__checkoutItem === 'string') ? window.__checkoutItem : 'pro_monthly');
    if (typeof window !== 'undefined' && window.FL && window.FL.startCheckout) {
      setProcessing(true);
      Promise.resolve(window.FL.startCheckout(planKey)).catch(function () { setProcessing(false); });
    } else {
      nav('pricing');
    }
  };

  // ── Success screen ────
  if (done) {
    return (
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40, background:T.bg }}>
        <div style={{ maxWidth:480, textAlign:'center' }}>
          <div style={{ width:88, height:88, borderRadius:'50%', background:'#E8F8EF', color:'#1A8F4E', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:24, position:'relative' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <div style={{ position:'absolute', inset:-8, borderRadius:'50%', border:'2px dashed #1A8F4E33' }}/>
          </div>
          <div style={{ fontSize:11, fontWeight:700, color:'#1A8F4E', letterSpacing:'.18em', textTransform:'uppercase', marginBottom:10 }}>Payment received</div>
          <div style={{ fontFamily:T.serif, fontSize:42, lineHeight:1.1, color:T.ink, marginBottom:14 }}>{item.success}</div>
          <div style={{ fontSize:14.5, color:T.ink3, lineHeight:1.6, marginBottom:30 }}>
            We charged <b style={{ color:T.ink }}>{item.currency}{total.toFixed(2)}</b> to your card ending in <b style={{ color:T.ink }}>{card.slice(-4) || '4242'}</b>. A receipt is on its way to <b style={{ color:T.ink }}>{email}</b>.
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <Btn label="Continue" accent={T.brand} size="lg" onClick={() => nav(item.returnTo)}/>
            <Btn label="View receipt" variant="outline" accent={T.ink} size="lg" onClick={() => nav('receipts')}/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:T.bg }}>
      {/* Top bar — Stripe-like minimal header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 32px', borderBottom:`1px solid ${T.hairline}`, background:'#fff' }}>
        <button onClick={() => nav('back')} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:T.ink2, cursor:'pointer', padding:'6px 8px', borderRadius:6 }}>
          <span style={{ fontSize:16 }}>‹</span> Back
        </button>
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
          <div style={{ width:24, height:24, borderRadius:6, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {Icon.brandmark({ width:14, height:14 })}
          </div>
          <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>Fluentra</div>
          <div style={{ width:1, height:18, background:T.hairline }}/>
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:T.ink4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secure checkout · 256-bit SSL
          </div>
        </div>
        <div style={{ width:80 }}/>
      </div>

      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ maxWidth:1080, margin:'0 auto', padding:'40px 32px 60px', display:'grid', gridTemplateColumns:'1.15fr 1fr', gap:48 }}>

          {/* ─── LEFT: Payment form ─── */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:8 }}>Step 1 of 1</div>
            <div style={{ fontFamily:T.serif, fontSize:34, lineHeight:1.1, color:T.ink, marginBottom:8 }}>Pay {item.currency}{total.toFixed(2)}</div>
            <div style={{ fontSize:14, color:T.ink3, marginBottom:28 }}>Pay {item.recurring ? `${item.currency}${item.amount}/${item.recurring} after your trial. ` : ''}Cancel any time.</div>

            {/* Wallet quick-pay */}
            <div style={{ display:'flex', gap:10, marginBottom:20 }}>
              <WalletButton kind="apple" onClick={handlePay}/>
              <WalletButton kind="google" onClick={handlePay}/>
            </div>

            {/* Or divider */}
            <div style={{ display:'flex', alignItems:'center', gap:14, margin:'8px 0 22px' }}>
              <div style={{ flex:1, height:1, background:T.hairline }}/>
              <div style={{ fontSize:11, fontWeight:600, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Or pay with card</div>
              <div style={{ flex:1, height:1, background:T.hairline }}/>
            </div>

            <MethodTabs method={method} setMethod={setMethod}/>

            {method === 'card' && (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <CheckoutInput
                  label="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                />

                <CheckoutInput
                  label="Card number"
                  value={card}
                  onChange={e => setCard(fmtCard(e.target.value))}
                  placeholder="1234 1234 1234 1234"
                  maxLength={19}
                  suffix={brand ? <CardBrand brand={brand}/> : <div style={{ display:'flex', gap:4 }}><CardBrand brand="visa"/><div style={{ marginLeft:2 }}><CardBrand brand="mastercard"/></div></div>}
                />

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <CheckoutInput
                    label="Expiry"
                    value={exp}
                    onChange={e => setExp(fmtExp(e.target.value))}
                    placeholder="MM / YY"
                    maxLength={7}
                  />
                  <CheckoutInput
                    label="CVC"
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    maxLength={4}
                    suffix={
                      <svg width="22" height="14" viewBox="0 0 24 14" fill="none" stroke={T.ink5} strokeWidth="1.5"><rect x="1" y="1" width="22" height="12" rx="2"/><path d="M1 5h22"/></svg>
                    }
                  />
                </div>

                <CheckoutInput
                  label="Name on card"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="As shown on the card"
                />

                <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:12 }}>
                  <label>
                    <div style={{ fontSize:11, fontWeight:600, color:T.ink3, marginBottom:6, letterSpacing:'.02em' }}>Country</div>
                    <div style={{ position:'relative' }}>
                      <select value={country} onChange={e => setCountry(e.target.value)} style={{
                        width:'100%', padding:'12px 32px 12px 14px', background:'#fff',
                        border:`1px solid ${T.border}`, borderRadius:8, fontSize:14, color:T.ink,
                        appearance:'none', cursor:'pointer', outline:'none',
                        boxShadow:'0 1px 2px rgba(0,0,0,.04)',
                      }}>
                        {['United States','United Kingdom','Spain','France','Germany','Japan','Korea, Republic of','Mexico','Brazil','India','Australia','Canada'].map(c => <option key={c}>{c}</option>)}
                      </select>
                      <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:T.ink4 }}>{Icon.chev({ width:11, height:11 })}</div>
                    </div>
                  </label>
                  <CheckoutInput
                    label="ZIP / Postal"
                    value={zip}
                    onChange={e => setZip(e.target.value)}
                    placeholder="28013"
                  />
                </div>

                {/* Save card */}
                <label style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 16px', background:T.bg2, borderRadius:9, cursor:'pointer', border:`1px solid ${T.border}` }}>
                  <input type="checkbox" defaultChecked style={{ width:16, height:16, accentColor:T.brand, cursor:'pointer' }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>Securely save card</div>
                    <div style={{ fontSize:11.5, color:T.ink4, marginTop:2 }}>Pay faster next time. Powered by Stripe Link.</div>
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#00D924', background:'#E0F8E5', padding:'3px 8px', borderRadius:5, letterSpacing:'.04em' }}>LINK</div>
                </label>
              </div>
            )}

            {method === 'wallet' && (
              <div style={{ padding:'40px 24px', background:'#fff', border:`1px solid ${T.border}`, borderRadius:12, textAlign:'center' }}>
                <div style={{ fontSize:13, color:T.ink3, marginBottom:18 }}>Pay using your saved wallet</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10, maxWidth:280, margin:'0 auto' }}>
                  <WalletButton kind="apple" onClick={handlePay}/>
                  <WalletButton kind="google" onClick={handlePay}/>
                </div>
              </div>
            )}

            {method === 'bank' && (
              <div style={{ padding:'24px 22px', background:'#fff', border:`1px solid ${T.border}`, borderRadius:12 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>SEPA · Bank transfer</div>
                <div style={{ fontSize:12, color:T.ink3, lineHeight:1.5, marginBottom:16 }}>Pay via direct debit. Takes 1–2 business days. Available for EU customers.</div>
                <CheckoutInput label="IBAN" value="" onChange={() => {}} placeholder="ES12 3456 7890 1234 5678 9012"/>
              </div>
            )}

            {/* Pay button */}
            <button onClick={handlePay} disabled={processing} style={{
              width:'100%', marginTop:22, padding:'15px 16px',
              background: processing ? T.ink4 : T.ink, color:'#fff',
              borderRadius:10, fontSize:14.5, fontWeight:700,
              cursor: processing ? 'wait' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              boxShadow: processing ? 'none' : '0 4px 12px rgba(0,0,0,.18)',
            }}>
              {processing ? (
                <>
                  <div style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                  Processing payment…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Pay {item.currency}{total.toFixed(2)}
                </>
              )}
            </button>
            <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>

            {/* Trust strip */}
            <div style={{ marginTop:18, padding:'14px 16px', background:T.bg2, borderRadius:9, fontSize:11.5, color:T.ink3, lineHeight:1.55 }}>
              By confirming you allow Fluentra to charge your card for this payment {item.recurring ? `and future ${item.recurring}ly payments per the terms.` : 'per the terms.'} You can cancel any time from <span style={{ color:T.brand, fontWeight:600 }}>Settings → Subscription</span>.
            </div>

            {/* Powered by */}
            <div style={{ marginTop:22, display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:11, color:T.ink4 }}>
              Powered by
              <span style={{ fontFamily:T.body, fontWeight:800, fontSize:13, color:'#635BFF', letterSpacing:'-.02em' }}>stripe</span>
              <span style={{ color:T.ink5 }}>·</span>
              <span>Terms</span>
              <span style={{ color:T.ink5 }}>·</span>
              <span>Privacy</span>
            </div>
          </div>

          {/* ─── RIGHT: Order summary ─── */}
          <div>
            <div style={{ position:'sticky', top:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:14 }}>Order summary</div>

              <div style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:14, padding:24, boxShadow:'0 1px 0 rgba(0,0,0,.02)' }}>
                {/* Item */}
                <div style={{ display:'flex', gap:14, paddingBottom:18, borderBottom:`1px solid ${T.hairline}`, marginBottom:18 }}>
                  <div style={{ width:54, height:54, borderRadius:12, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 6px 16px ${T.brand}55` }}>
                    {Icon.brandmark({ width:28, height:28 })}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:3 }}>{item.name}</div>
                    <div style={{ fontSize:12, color:T.ink3, lineHeight:1.45 }}>{item.sub}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink }}>{item.currency}{item.amount.toFixed(2)}</div>
                    {item.recurring && <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>per {item.recurring}</div>}
                  </div>
                </div>

                {/* Coupon */}
                <div style={{ marginBottom:18 }}>
                  {!showCoupon ? (
                    <button onClick={() => setShowCoupon(true)} style={{ fontSize:12.5, fontWeight:600, color:T.brand, cursor:'pointer', padding:'4px 0' }}>
                      + Add promotion code
                    </button>
                  ) : (
                    <div style={{ display:'flex', gap:8 }}>
                      <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Code"
                        style={{ flex:1, padding:'10px 12px', fontSize:13, border:`1px solid ${T.border}`, borderRadius:7, fontFamily:T.mono, letterSpacing:'.05em', outline:'none' }}/>
                      <button onClick={() => coupon && setCouponApplied(true)} style={{
                        padding:'10px 14px', background: coupon ? T.ink : T.bg2, color: coupon ? '#fff' : T.ink4,
                        borderRadius:7, fontSize:12.5, fontWeight:700, cursor: coupon ? 'pointer' : 'default'
                      }}>Apply</button>
                    </div>
                  )}
                  {couponApplied && (
                    <div style={{ marginTop:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', background:'#E8F8EF', borderRadius:7 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:'#0F7B3A' }}>✓ {coupon} applied</span>
                        <span style={{ fontSize:11, color:'#0F7B3A', opacity:.8 }}>20% off first {item.recurring || 'payment'}</span>
                      </div>
                      <button onClick={() => { setCouponApplied(false); setCoupon(''); setShowCoupon(false); }} style={{ fontSize:11, color:'#0F7B3A', cursor:'pointer' }}>Remove</button>
                    </div>
                  )}
                </div>

                {/* Lines */}
                <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:13 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', color:T.ink2 }}>
                    <span>Subtotal</span>
                    <span style={{ fontFamily:T.mono }}>{item.currency}{subtotal.toFixed(2)}</span>
                  </div>
                  {couponApplied && (
                    <div style={{ display:'flex', justifyContent:'space-between', color:'#0F7B3A' }}>
                      <span>Discount (20%)</span>
                      <span style={{ fontFamily:T.mono }}>−{item.currency}{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', color:T.ink3 }}>
                    <span>VAT (21%)</span>
                    <span style={{ fontFamily:T.mono }}>{item.currency}{tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div style={{ marginTop:18, paddingTop:18, borderTop:`1px solid ${T.hairline}`, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Total due today</div>
                    {item.recurring && <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>Then {item.currency}{(item.amount * 1.21).toFixed(2)}/{item.recurring}</div>}
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink }}>{item.currency}{total.toFixed(2)}</div>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:11, color:T.ink3 }}>
                <div style={{ padding:'10px 12px', background:T.bg2, borderRadius:8, display:'flex', alignItems:'center', gap:8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.brand} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <div>
                    <div style={{ fontWeight:700, color:T.ink, fontSize:11.5 }}>Secured by Stripe</div>
                    <div style={{ fontSize:10.5, marginTop:1 }}>PCI DSS Level 1</div>
                  </div>
                </div>
                <div style={{ padding:'10px 12px', background:T.bg2, borderRadius:8, display:'flex', alignItems:'center', gap:8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.brand} strokeWidth="2"><path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c2.5 0 5 1 6.5 3"/><polyline points="21 5 21 11 15 11"/></svg>
                  <div>
                    <div style={{ fontWeight:700, color:T.ink, fontSize:11.5 }}>30-day refund</div>
                    <div style={{ fontSize:10.5, marginTop:1 }}>No questions asked</div>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div style={{ marginTop:18, padding:'16px 18px', background:'#fff', border:`1px solid ${T.border}`, borderRadius:12 }}>
                <div style={{ display:'flex', gap:2, marginBottom:8 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color:'#FFB800', fontSize:13 }}>★</span>)}
                </div>
                <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:14, color:T.ink2, lineHeight:1.5, marginBottom:10 }}>"Cancelled Duolingo. Pro pays for itself by week two."</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Avatar initials="MR" size={26} bg="#A06940"/>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>Marco R.</div>
                    <div style={{ fontSize:10.5, color:T.ink4 }}>Pro · 11 months</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile checkout ────────────────────────────────────────────
function MCheckoutPage() {
  const item = getCheckoutItem();
  const nav = window.__nav || (() => {});
  const [card, setCard] = useState('');
  const [exp, setExp]   = useState('');
  const [cvc, setCvc]   = useState('');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const brand = detectBrand(card);
  const subtotal = item.amount;
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, 1400);
  };

  if (done) {
    return (
      <>
        <MobileBody>
          <div style={{ padding:'40px 22px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1 }}>
            <div style={{ width:88, height:88, borderRadius:'50%', background:'#E8F8EF', color:'#1A8F4E', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:24 }}>
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:'#1A8F4E', letterSpacing:'.16em', textTransform:'uppercase', marginBottom:10 }}>Payment received</div>
            <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1.1, color:T.ink, marginBottom:14 }}>{item.success}</div>
            <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6, marginBottom:28 }}>Charged <b style={{ color:T.ink }}>{item.currency}{total.toFixed(2)}</b> to •••• {card.slice(-4) || '4242'}.</div>
            <Btn label="Continue" accent={T.brand} size="lg" fullWidth onClick={() => nav(item.returnTo)}/>
          </div>
        </MobileBody>
      </>
    );
  }

  return (
    <>
      <MobileBody>
        <div style={{ padding:'14px 16px 8px', display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${T.hairline}` }}>
          <button onClick={() => nav('back')} style={{ width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg2, color:T.ink2, fontSize:18 }}>‹</button>
          <div style={{ flex:1, textAlign:'center', fontSize:13, fontWeight:700, color:T.ink }}>Checkout</div>
          <div style={{ width:32, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.ink3} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
        </div>

        <div style={{ padding:'18px 18px 100px' }}>
          {/* Item card */}
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'16px 16px', marginBottom:18, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {Icon.brandmark({ width:24, height:24 })}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:2 }}>{item.name}</div>
              <div style={{ fontSize:11, color:T.ink4 }}>{item.sub}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>{item.currency}{item.amount.toFixed(2)}</div>
            </div>
          </div>

          {/* Wallet quick */}
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
            <WalletButton kind="apple" onClick={handlePay}/>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, margin:'8px 0 14px' }}>
            <div style={{ flex:1, height:1, background:T.hairline }}/>
            <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Or card</div>
            <div style={{ flex:1, height:1, background:T.hairline }}/>
          </div>

          {/* Card form */}
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <CheckoutInput label="Card number" value={card} onChange={e => setCard(fmtCard(e.target.value))} placeholder="1234 1234 1234 1234" maxLength={19} suffix={brand ? <CardBrand brand={brand}/> : null}/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <CheckoutInput label="Expiry" value={exp} onChange={e => setExp(fmtExp(e.target.value))} placeholder="MM / YY" maxLength={7}/>
              <CheckoutInput label="CVC" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="•••" maxLength={4}/>
            </div>
          </div>

          {/* Total breakdown */}
          <div style={{ marginTop:20, padding:'14px 14px', background:T.bg2, borderRadius:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:T.ink3, marginBottom:5 }}><span>Subtotal</span><span style={{ fontFamily:T.mono }}>{item.currency}{subtotal.toFixed(2)}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:T.ink3, marginBottom:8 }}><span>VAT (21%)</span><span style={{ fontFamily:T.mono }}>{item.currency}{tax.toFixed(2)}</span></div>
            <div style={{ paddingTop:8, borderTop:`1px solid ${T.hairline}`, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>Total</span>
              <span style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>{item.currency}{total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handlePay} disabled={processing} style={{
            width:'100%', marginTop:18, padding:'14px', background: processing ? T.ink4 : T.ink, color:'#fff',
            borderRadius:11, fontSize:14, fontWeight:700, cursor: processing ? 'wait' : 'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}>
            {processing ? (
              <>
                <div style={{ width:13, height:13, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                Processing…
              </>
            ) : <>🔒 Pay {item.currency}{total.toFixed(2)}</>}
          </button>

          <div style={{ marginTop:14, textAlign:'center', fontSize:10.5, color:T.ink4 }}>
            Powered by <span style={{ color:'#635BFF', fontWeight:800 }}>stripe</span> · Cancel any time
          </div>
        </div>
      </MobileBody>
    </>
  );
}

// ── Checkout helper — subscriptions go to Stripe; one-time items use the in-app page ──
window.payFor = function(presetOrItem) {
  var SUBS = { pro_monthly:1, pro_yearly:1, max_monthly:1, max_yearly:1 };
  if (typeof presetOrItem === 'string' && SUBS[presetOrItem] && window.FL && window.FL.startCheckout) {
    window.FL.startCheckout(presetOrItem);
    return;
  }
  window.__checkoutItem = presetOrItem;
  if (window.__nav) window.__nav('checkout');
};

Object.assign(window, { CheckoutPage, MCheckoutPage, CHECKOUT_PRESETS, getCheckoutItem });
