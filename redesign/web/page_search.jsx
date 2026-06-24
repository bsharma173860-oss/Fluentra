// ── Page: Search — jump to languages, practice modules, and pages ──
const { useState: useStateSr } = React;

function _searchDestinations() {
  const langs = (typeof userLanguages === 'function') ? userLanguages() : [];
  const langItems = langs.map(function (l) {
    return { label: l.english, sub:'Open language hub', kind:'Language', ic:'book', nav:'lang', langCode:l.code };
  });
  const syl = (typeof lessonSyllabus === 'function') ? lessonSyllabus() : [];
  const topics = [];
  syl.forEach(function (u) { (u.lessons || []).forEach(function (title) {
    topics.push({ label: title, sub: (u.level ? u.level + ' · ' : '') + (u.unit || 'Lesson'), kind:'Lesson', ic:'book', lessonTopic:{ title:title, unit:u.unit, level:u.level } });
  }); });
  const dest = [
    { label:'Reading practice', sub:'Generate a passage', kind:'Practice', ic:'book', nav:'reading' },
    { label:'Listening practice', sub:'Generate audio', kind:'Practice', ic:'head', nav:'listening' },
    { label:'Writing practice', sub:'Write & get graded', kind:'Practice', ic:'pen', nav:'writing' },
    { label:'Speaking practice', sub:'Record & get scored', kind:'Practice', ic:'mic', nav:'speaking' },
    { label:'Vocabulary', sub:'Flashcards & SRS', kind:'Page', ic:'book', nav:'vocab' },
    { label:'Grammar topics', sub:'Generate a lesson', kind:'Page', ic:'pen', nav:'grammar' },
    { label:'AI Tutor', sub:'Ask anything', kind:'Page', ic:'message', nav:'tutor' },
    { label:'Course', sub:'Structured lessons', kind:'Page', ic:'book', nav:'course' },
    { label:'Progress', sub:'Your stats', kind:'Page', ic:'trophy', nav:'progress' },
    { label:'Achievements', sub:'Badges & streaks', kind:'Page', ic:'trophy', nav:'achievements' },
    { label:'Plans & pricing', sub:'Upgrade', kind:'Page', ic:'spark', nav:'pricing' },
    { label:'Settings', sub:'', kind:'Page', ic:'pen', nav:'settings' },
    { label:'Add a language', sub:'', kind:'Action', ic:'spark', nav:'add_language' },
  ];
  return langItems.concat(topics).concat(dest);
}
function _searchGo(d) {
  if (d.langCode) window.__langCode = d.langCode;
  if (d.lessonTopic) window.__lessonTopic = d.lessonTopic;
  window.__nav && window.__nav(d.nav || (d.lessonTopic ? 'lesson_detail' : 'dashboard'));
}
// Live content (lessons/articles/vocab the user has generated) for the current language.
function _searchContent(setItems) {
  var lang = (typeof window !== 'undefined' && window.__langCode) || 'en';
  fetch('/api/content-list?lang=' + encodeURIComponent(lang) + '&full=1&limit=60')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var KIND = { reading:'Reading', writing:'Writing', vocab:'Vocab', listening:'Listening' };
      var IC = { reading:'book', writing:'pen', vocab:'book', listening:'head' };
      setItems((d.items || []).map(function (it) { var ty = it.type || 'reading'; return { label:(it.title || (it.payload && it.payload.title) || 'Untitled'), sub:(KIND[ty]||'Lesson') + ' \u00b7 ' + (it.difficulty || ty), kind:(KIND[ty]||'Lesson'), ic:(IC[ty]||'book'), nav:ty }; }));
    }).catch(function () {});
}

function SearchPage() {
  const [query, setQuery] = useStateSr('');
  const [content, setContent] = useStateSr([]);
  React.useEffect(function () { _searchContent(setContent); }, []);
  const all = _searchDestinations().concat(content);
  const q = query.trim().toLowerCase();
  const matches = all.filter(function (d) { return d.label.toLowerCase().indexOf(q) !== -1 || (d.sub && d.sub.toLowerCase().indexOf(q) !== -1) || d.kind.toLowerCase().indexOf(q) !== -1; });
  // Empty query: show a useful starter set (modules + a few topics), not the whole list.
  const results = q ? matches : _searchDestinations().filter(function (d) { return d.kind === 'Practice' || d.kind === 'Language'; }).concat(_searchDestinations().filter(function (d) { return d.kind === 'Lesson'; }).slice(0, 6));
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
                  <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13.5, fontWeight:600, color:T.ink }}>{d.label}</div>{d.sub ? <div style={{ fontSize:11, color:T.ink4, marginTop:1 }}>{d.sub}</div> : null}</div>
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
