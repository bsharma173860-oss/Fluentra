// ────────────────────────────────────────────────────────────────────────────
// Fluentra connectedness audit  —  run with:  node audit.mjs
//
// This is the "system" that replaces hunting bugs one-by-one. It encodes the
// invariants the app must always satisfy and reports EVERY structural break in
// one shot (broken nav, dead buttons, missing backend methods, orphan code,
// disconnected pages). It can NOT prove a button does the *right* thing — only
// that it is *wired to something*. Click-testing still finds logic bugs.
//
// Exit code 0 = no HIGH-severity breaks; 1 = at least one HIGH break.
// ────────────────────────────────────────────────────────────────────────────
import fs from 'fs';
import path from 'path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const backend = fs.readFileSync(path.join(ROOT, 'redesign', 'backend.js'), 'utf8');

const loaded = [...html.matchAll(/src="(redesign\/[^"]+\.jsx)"/g)].map(m => m[1]);
const files = loaded.filter(f => fs.existsSync(path.join(ROOT, f)))
  .map(f => ({ name: path.basename(f), rel: f, src: fs.readFileSync(path.join(ROOT, f), 'utf8') }));

// Static info / status / demo screens that are SUPPOSED to be backend-less.
const STATIC_OK = new Set([
  'legal','privacy','terms','help','grammar','about','faq','reset_password','forgot_pw',
  'notfound','offline','error','splash','marketing','new_guarantee','new_trial_warns',
  'new_payment_success','new_cancel','new_404','new_500','new_offline','exam_unlock',
]);
// Files that are intentionally static mockups/marketing — not user app pages.
const STATIC_FILES = new Set(['page_prelaunch.jsx','page_states.jsx','page_marketing.jsx']);

function routeMap(tableName) {
  const m = html.match(new RegExp(tableName + '\\s*=\\s*\\{(.*?)\\n\\s*\\};', 's'));
  const out = {};
  if (m) for (const r of m[1].matchAll(/\n\s*([a-z_0-9]+):\s*\(\)\s*=>\s*<([A-Za-z0-9]+)/g)) out[r[1]] = r[2];
  return out;
}
const web = routeMap('WEB_PAGES'), mob = routeMap('MOBILE_PAGES');
const routes = new Set([...Object.keys(web), ...Object.keys(mob)]);
const routedComps = new Set([...Object.values(web), ...Object.values(mob)]);

// Index of every component definition + every reference (JSX <Comp OR call Comp().
const defined = new Map();     // comp -> file
const rendered = new Set();     // comp referenced (rendered or called)
for (const f of files) {
  for (const m of f.src.matchAll(/\n(?:function|const)\s+([A-Z][A-Za-z0-9]+)\s*[=(]/g)) if (!defined.has(m[1])) defined.set(m[1], f.name);
  for (const m of f.src.matchAll(/<([A-Z][A-Za-z0-9]+)[\s/>]/g)) rendered.add(m[1]);   // JSX
  for (const m of f.src.matchAll(/\b([A-Z][A-Za-z0-9]+)\s*\(/g)) rendered.add(m[1]);   // function call (helpers)
}
for (const m of html.matchAll(/<([A-Z][A-Za-z0-9]+)[\s/>]/g)) rendered.add(m[1]);

const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;
const HIGH = [], MED = [], INFO = [];

// ── INVARIANT 1: every nav('x') / data-nav="x" / nav="x" points to a real route ──
for (const f of files) {
  for (const m of f.src.matchAll(/(?:__nav|nav)\(\s*'([a-z_0-9]+)'\s*\)/g))
    if (!routes.has(m[1]) && m[1] !== 'back') HIGH.push(`BROKEN NAV  ${f.name}:${lineOf(f.src,m.index)}  nav('${m[1]}') → no such route`);
  for (const m of f.src.matchAll(/data-nav="([a-z_0-9]+)"/g))
    if (!routes.has(m[1])) HIGH.push(`BROKEN NAV  ${f.name}:${lineOf(f.src,m.index)}  data-nav="${m[1]}" → no such route`);
  for (const m of f.src.matchAll(/\bnav="([a-z_0-9]+)"/g))
    if (!routes.has(m[1]) && m[1] !== 'back') HIGH.push(`BROKEN NAV  ${f.name}:${lineOf(f.src,m.index)}  nav="${m[1]}" → no such route`);
}

// ── INVARIANT 2: every route points to a component that is actually defined ──
for (const [tbl, map] of [['WEB', web], ['MOBILE', mob]])
  for (const [route, comp] of Object.entries(map))
    if (!defined.has(comp) && !new RegExp('(?:function|const)\\s+' + comp + '\\b').test(html))
      HIGH.push(`MISSING PAGE  ${tbl} route '${route}' → <${comp}/> is not defined anywhere`);

// ── INVARIANT 3: every FL.* / window.FL.* method called exists in backend.js ──
const flMethods = new Set();
for (const m of backend.matchAll(/\b([a-zA-Z_][A-Za-z0-9_]*)\s*:\s*function/g)) flMethods.add(m[1]);
for (const m of backend.matchAll(/\b([a-zA-Z_][A-Za-z0-9_]*)\s*:\s*(?:async\s*)?\(/g)) flMethods.add(m[1]);
// also: window.FL.X = …  /  FL.X = …  /  FL.auth.X = …  assignment-style definitions
for (const m of backend.matchAll(/(?:window\.)?FL\.(?:auth\.)?([a-zA-Z_][A-Za-z0-9_]*)\s*=/g)) flMethods.add(m[1]);
const FL_IGNORE = new Set(['auth','api','social','then','catch','data','error']);
for (const f of files) {
  for (const m of f.src.matchAll(/(?:window\.)?FL\.(?:auth\.)?([a-zA-Z_][A-Za-z0-9_]*)\s*\(/g)) {
    const meth = m[1];
    if (!FL_IGNORE.has(meth) && !flMethods.has(meth))
      HIGH.push(`MISSING BACKEND  ${f.name}:${lineOf(f.src,m.index)}  FL.${meth}() called but not defined in backend.js`);
  }
}

// ── INVARIANT 4: every <button>/clickable has an action (no dead buttons) ──
// Whitelisted action signals; data-nav is valid (global delegated handler).
// Tag boundaries are brace-aware so onClick={() => …} (which contains '>') is
// not truncated — that bug caused huge false-positive counts.
const ACTION = /onClick|onMouseDown|onPointerDown|onSubmit|data-nav|\bnav=|\bhref=|type="submit"|disabled/;
function openTag(src, from) {            // returns the full <button …> opening tag, brace-aware
  let depth = 0;
  for (let i = from; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === '>' && depth === 0) return src.slice(from, i + 1);
  }
  return src.slice(from, from + 400);
}
for (const f of files) {
  if (STATIC_FILES.has(f.name)) continue;
  for (const m of f.src.matchAll(/<button\b/g)) {
    const tag = openTag(f.src, m.index);
    if (!ACTION.test(tag)) MED.push(`DEAD BUTTON?  ${f.name}:${lineOf(f.src,m.index)}  <button> with no onClick/data-nav (verify by eye)`);
  }
}

// ── INVARIANT 5: no orphan components (defined but never routed or rendered) ──
for (const [comp, file] of defined) {
  if (routedComps.has(comp) || rendered.has(comp)) continue;
  if (comp === comp.toUpperCase()) continue;          // CONSTANTS (LANGUAGES, EXAMS…)
  if (/^(Icon|MT|T|USER|MODULES|LEGAL)$/.test(comp)) continue;
  MED.push(`ORPHAN  ${file}  <${comp}> defined but never routed or rendered (dead code?)`);
}

// ── INVARIANT 6: routed pages should connect to backend or navigate ──
const compBody = new Map();
for (const f of files) {
  const defs = [...f.src.matchAll(/\n(?:function|const)\s+([A-Za-z0-9_]+)\s*[=(]/g)];
  defs.forEach((d, i) => {
    const end = i + 1 < defs.length ? defs[i + 1].index : f.src.length;
    if (!compBody.has(d[1])) compBody.set(d[1], f.src.slice(d.index, end));
  });
}
const CONNECT = /FL\.|window\.__user|window\.__results|window\.__userLanguages|useGenContent|fetch\(|\/api\/|__nav|nav\(|data-nav|onClick|_activityFeed|userLanguages\(/;
for (const [tbl, map] of [['WEB', web], ['MOBILE', mob]])
  for (const [route, comp] of Object.entries(map)) {
    if (STATIC_OK.has(route)) continue;
    const body = compBody.get(comp);
    if (body && !CONNECT.test(body)) INFO.push(`DISCONNECTED?  ${tbl} ${route} → <${comp}> has no backend/nav signal (may render a connected child)`);
  }

// ── INVARIANT 7: marketing claims must match reality (over-promise guard) ──
// Catches the "80+ languages vs 10+ languages" class automatically.
const addLang = files.find(f => f.name === 'page_add_language.jsx');
const realFull = addLang ? (addLang.src.match(/tier:'full'/g) || []).length : 0;
const langClaims = new Set();
for (const f of files) {
  if (STATIC_FILES.has(f.name)) continue;
  for (const m of f.src.matchAll(/(\d+)\s*\+?\s*languages/gi)) { const n = parseInt(m[1],10); if (n >= 5) langClaims.add(n); }  // <5 = UI layout refs, not claims
}
if (realFull > 0) {
  for (const n of langClaims)
    if (n > realFull * 2)
      MED.push(`OVER-PROMISE  app claims "${n}+ languages" but only ${realFull} have a full curriculum/exam — verify wording`);
  if (langClaims.size > 1)
    MED.push(`INCONSISTENT CLAIM  language count stated as different numbers (${[...langClaims].sort((a,b)=>a-b).join(', ')}) — pick one honest number`);
}

// ── INVARIANT 8: BEHAVIORAL — a button's action must match its label's intent ──
// Catches the "wired, but to the WRONG thing" class (e.g. a 'Sign out' button
// that only navigates and never actually signs out). Static approximation of a
// click-test: it reads the visible label and the onClick handler and checks the
// handler mentions the action the label promises.
function onClickOf(tag) {
  const i = tag.indexOf('onClick={');
  if (i < 0) return '';
  let depth = 0; const start = i + 'onClick='.length;
  for (let j = start; j < tag.length; j++) {
    if (tag[j] === '{') depth++;
    else if (tag[j] === '}') { depth--; if (depth === 0) return tag.slice(start, j + 1); }
  }
  return tag.slice(start);
}
const INTENTS = [
  { label: /\b(sign\s*out|log\s*out|logout)\b/i, need: /sign\s*out|signout|__signOut|logout/i, sev: 'HIGH', what: "sign out (must call signOut, not just navigate)" },
  { label: /\b(delete|remove)\s+(account|profile|my data)\b/i, need: /delete|remove|destroy|FL\.|api/i, sev: 'MED', what: "delete account" },
];
function checkIntent(file, line, label, handler) {
  if (!label) return;
  for (const it of INTENTS) {
    if (it.label.test(label) && !it.need.test(handler)) {
      const msg = `INTENT MISMATCH  ${file}:${line}  button "${label.trim().slice(0,30)}" — handler doesn't ${it.what}`;
      (it.sev === 'HIGH' ? HIGH : MED).push(msg);
    }
  }
}
for (const f of files) {
  if (STATIC_FILES.has(f.name)) continue;
  // (A) components that take a label="…" prop + onClick (PopRow, SocialBtn, Btn, rows)
  for (const m of f.src.matchAll(/<[A-Z]\w+[^>]*\blabel="([^"]+)"/g)) {
    const tag = openTag(f.src, m.index);
    checkIntent(f.name, lineOf(f.src, m.index), m[1], onClickOf(tag));
  }
  // (B) <button>…text…</button>
  for (const m of f.src.matchAll(/<button\b/g)) {
    const tag = openTag(f.src, m.index);
    const tagEnd = m.index + tag.length;
    const close = f.src.indexOf('</button>', tagEnd);
    const inner = close > 0 ? f.src.slice(tagEnd, close) : '';
    const label = inner.replace(/<[^>]+>/g, ' ').replace(/\{[^}]*\}/g, ' ').replace(/\s+/g, ' ').trim();
    checkIntent(f.name, lineOf(f.src, m.index), label, onClickOf(tag) + ' ' + tag);
  }
}

// ── INVARIANT 9: window exports must reference DEFINED names ──────────────
// Object.assign(window, { Foo }) where Foo is undefined throws a ReferenceError
// at bundle-eval time, which halts the whole bundle -> const MOBILE_PAGES/etc.
// never initialize -> blank app. This is the bug class that caused the blank
// screen (MOTPPageV5/MVocabPage/OTPPage). HIGH + build-blocking.
const allSrc = files.map(f => f.src).join('\n');
const declared = new Set();
for (const m of allSrc.matchAll(/\b(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/g)) declared.add(m[1]);
for (const m of allSrc.matchAll(/\bconst\s*\{([^}]+)\}/g))
  m[1].split(',').forEach(s => { const n = s.split(':').pop().trim().split('=')[0].trim(); if (n) declared.add(n); });
const JS_GLOBALS = new Set(['Object','window','React','ReactDOM','Math','JSON','Array','String','Number','Boolean','Date','Promise','Map','Set','console','document','navigator']);
for (const f of files) {
  for (const blk of f.src.matchAll(/Object\.assign\(window,\s*\{([\s\S]*?)\}\s*\)/g)) {
    const names = blk[1].split(',').map(x => x.trim()).filter(Boolean)
      .map(x => x.includes(':') ? x.split(':')[1].trim() : x)
      .filter(x => /^[A-Za-z_$][\w$]*$/.test(x));
    for (const n of names)
      if (!declared.has(n) && !JS_GLOBALS.has(n))
        HIGH.push(`DANGLING EXPORT  ${f.name}:${lineOf(f.src, blk.index)}  window export '${n}' is not defined → crashes the whole bundle (blank app)`);
  }
}

// ── REPORT ──
const stamp = (backend.match(/__FL_BUILD\s*=\s*['"]([^'"]+)/) || [])[1] || '?';
console.log(`\n  Fluentra connectedness audit  ·  build ${stamp}  ·  ${files.length} files, ${routes.size} routes, ${defined.size} components\n`);
const section = (title, arr) => {
  console.log(`  ${title}: ${arr.length}`);
  arr.slice(0, 40).forEach(x => console.log(`     ${x}`));
  if (arr.length > 40) console.log(`     …and ${arr.length - 40} more`);
  console.log('');
};
section('🔴 HIGH  (definitely broken — fix these)', HIGH);
section('🟡 REVIEW (likely false-positives — glance to confirm)', MED);
section('⚪ INFO  (disconnected-looking, usually wrappers)', INFO);
console.log(HIGH.length === 0
  ? '  ✅ No HIGH-severity structural breaks. (Click-test still needed for logic bugs.)\n'
  : `  ❌ ${HIGH.length} HIGH-severity break(s) — see above.\n`);
process.exit(HIGH.length === 0 ? 0 : 1);
