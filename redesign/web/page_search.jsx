// ── Page: Search — jump to languages, practice modules, and pages ──
const { useState: useStateSr } = React;

function _searchDestinations() {
  const langs = (typeof userLanguages === 'function') ? userLanguages() : [];
  const langItems = langs.map(function (l) {
    return { label: l.english + ' · open language hub', kind:'Language', ic:'book', nav:'lang_detail', langCode:l.code };
  });
  const dest = [
    { label:'Dashboard', kind:'Page', ic:'search', nav:'dashboard' },
    { label:'Reading practice', kind:'Practice', ic:'book', nav:'reading' },
    { label:'Listening practice', kind:'Practice', ic:'head', nav:'listening' },
    { label:'Writing practice', kind:'Practice', ic:'pen', nav:'writing' },
    { label:'Speaking practice', kind:'Practice', ic:'mic', nav:'speaking' },
    { label:'AI Tutor', kind:'Page', ic:'message', nav:'tutor' },
    { label:'Vocabulary', kind:'Page', ic:'book', nav:'vocab' },
    { label:'Grammar topics', kind:'Page', ic:'pen', nav:'grammar' },
    { label:'Course', kind:'Page', ic:'book', nav:'course' },
    { label:'Progress', kind:'Page', ic:'trophy', nav:'progress' },
    { label:'Achievements', kind:'Page', ic:'trophy', nav:'achievements' },
    { label:'Plans & pricing', kind:'Page', ic:'spark', nav:'pricing' },
    { label:'Settings', kind:'Page', ic:'pen', nav:'settings' },
    { label:'Add a language', kind:'Action', ic:'spark', nav:'add_language' },
  ];
  return langItems.concat(dest);
}
function _searchGo(d) {
  if (d.langCode) window.__langCode = d.langCode;
  window.__nav && window.__nav(d.nav);
}

function SearchPage() {
  const [query, setQuery] = useStateSr('');
  const all = _searchDestinations();
  const q = query.trim().toLowerCase();
  const results = q ? all.filter(function (d) { return d.label.toLowerCase().indexOf(q) !== -1 || d.kind.toLowerCase().indexOf(q) !== -1; }) : all;
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ maxWidth:680, margin:'0 auto', padding:'36px 32px 56px' }}>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, marginBottom:6 }}>Search</div>
          <div style={{ fontSize:13.5, color:T.ink3, marginBottom:20 }}>Jump to a language, a practice module, or any page.</div>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:T.card, border:'1.5px solid '+T.brand, borderRadius:12, marginBottom:18 }}>
            <div style={{ color:T.brand }}>{Icon.search()}</div>
            <input autoFocus value={query} onChange={function(e){ setQuery(e.target.value); }} placeholder="Type to search…" style={{ flex:1, border:'none', background:'transparent', fontSize:14, color:T.ink, outline:'none', fontFamily:T.sans }}/>
          </div>
          {results.length === 0 ? (
            <div style={{ fontSize:13.5, color:T.ink4, padding:'20px 4px' }}>No matches for “{query}”.</div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column' }}>
              {results.map(function (d, i) { return (
                <button key={i} onClick={function(){ _searchGo(d); }} style={{ display:'flex', alignItems:'center', gap:14, padding:'13px 8px', borderBottom:'1px solid '+T.hairline, background:'transparent', textAlign:'left', cursor:'pointer', width:'100%' }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[d.ic] ? Icon[d.ic]({ width:14, height:14 }) : Icon.search({ width:14, height:14 })}</div>
                  <div style={{ flex:1, minWidth:0, fontSize:13.5, fontWeight:600, color:T.ink }}>{d.label}</div>
                  <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase' }}>{d.kind}</div>
                </button>
              ); })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MSearchPage() {
  const [query, setQuery] = useStateSr('');
  const all = _searchDestinations();
  const q = query.trim().toLowerCase();
  const results = q ? all.filter(function (d) { return d.label.toLowerCase().indexOf(q) !== -1; }) : all;
  return (
    <MobileBody>
      <div style={{ padding:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', background:T.card, border:'1.5px solid '+T.brand, borderRadius:11, marginBottom:14 }}>
          <div style={{ color:T.brand }}>{Icon.search()}</div>
          <input autoFocus value={query} onChange={function(e){ setQuery(e.target.value); }} placeholder="Search…" style={{ flex:1, border:'none', background:'transparent', fontSize:14, color:T.ink, outline:'none', fontFamily:T.sans }}/>
        </div>
        {results.map(function (d, i) { return (
          <button key={i} onClick={function(){ _searchGo(d); }} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 4px', borderBottom:'1px solid '+T.hairline, background:'transparent', textAlign:'left', cursor:'pointer', width:'100%' }}>
            <div style={{ width:32, height:32, borderRadius:8, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[d.ic] ? Icon[d.ic]({ width:13, height:13 }) : Icon.search({ width:13, height:13 })}</div>
            <div style={{ flex:1, minWidth:0, fontSize:13, fontWeight:600, color:T.ink }}>{d.label}</div>
          </button>
        ); })}
      </div>
    </MobileBody>
  );
}

Object.assign(window, { SearchPage, MSearchPage });
