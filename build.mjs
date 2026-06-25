// Fluentra production build.
import { execSync } from 'child_process';
// Reads index.html, transpiles every `text/babel` script (the 69 .jsx
// sources + the inline App/routing block) ahead of time with esbuild,
// concatenates them in load order into one minified bundle, and emits a
// dist/ that drops Babel-standalone and the 70 separate requests.
// Runtime semantics are unchanged: same shared global scope, same order.
import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const p = (...a) => path.join(ROOT, ...a);

const log = (...a) => console.log('[build]', ...a);

function rmrf(dir) { fs.rmSync(dir, { recursive: true, force: true }); }
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

async function main() {
  const html = fs.readFileSync(p('index.html'), 'utf8');

  // 1. Ordered list of external text/babel sources.
  const srcRe = /<script\s+type="text\/babel"\s+src="([^"]+)"><\/script>/g;
  const srcs = [];
  let m;
  while ((m = srcRe.exec(html))) srcs.push(m[1]);
  if (!srcs.length) throw new Error('No text/babel src scripts found — index.html changed?');
  log(`found ${srcs.length} jsx sources`);

  // 2. The single inline text/babel block (App + routing + createRoot).
  const inlineRe = /<script\s+type="text\/babel">([\s\S]*?)<\/script>/;
  const inlineMatch = html.match(inlineRe);
  if (!inlineMatch) throw new Error('Inline text/babel block not found — index.html changed?');
  const inlineCode = inlineMatch[1];

  // 3. Transpile each source (JSX -> React.createElement), then the inline block.
  const parts = [];
  for (const rel of srcs) {
    const code = fs.readFileSync(p(rel), 'utf8');
    const out = await esbuild.transform(code, { loader: 'jsx', jsx: 'transform', sourcefile: rel });
    parts.push(`/* ${rel} */\n${out.code}`);
  }
  const inlineOut = await esbuild.transform(inlineCode, { loader: 'jsx', jsx: 'transform', sourcefile: 'index.html#inline' });
  parts.push(`/* index.html#inline */\n${inlineOut.code}`);

  // 4. Concatenate (shared scope, in order) and minify once.
  const joined = parts.join('\n');
  const min = await esbuild.transform(joined, { minify: true });
  const bundle = min.code;
  if (!/createRoot/.test(bundle)) throw new Error('Sanity check failed: bundle missing createRoot — inline block truncated?');
  log(`bundle ${(bundle.length / 1024).toFixed(0)} KB minified`);

  // 5. Build the production index.html.
  let outHtml = html
    .replace(/<script\s+src="https:\/\/unpkg\.com\/@babel\/standalone[^>]*><\/script>\s*/g, '')
    .replace(srcRe, '')
    .replace(inlineRe, '<script src="assets/app.bundle.js"></script>');
  // Tidy the blank lines the removals leave behind.
  outHtml = outHtml.replace(/\n{3,}/g, '\n\n');

  // 6. Emit dist/.
  rmrf(DIST);
  fs.mkdirSync(DIST, { recursive: true });
  copyDir(p('assets'), path.join(DIST, 'assets'));
  fs.mkdirSync(path.join(DIST, 'redesign'), { recursive: true });
  fs.copyFileSync(p('redesign', 'backend.js'), path.join(DIST, 'redesign', 'backend.js'));
  fs.writeFileSync(path.join(DIST, 'assets', 'app.bundle.js'), bundle);
  fs.writeFileSync(path.join(DIST, 'index.html'), outHtml);
  // Standalone health page — copied as-is so it works even if the app bundle breaks.
  if (fs.existsSync(p('diag.html'))) fs.copyFileSync(p('diag.html'), path.join(DIST, 'diag.html'));
  if (fs.existsSync(p('usage.html'))) fs.copyFileSync(p('usage.html'), path.join(DIST, 'usage.html'));
  // PWA: manifest + service worker at the site root so the app is installable.
  if (fs.existsSync(p('manifest.json'))) fs.copyFileSync(p('manifest.json'), path.join(DIST, 'manifest.json'));
  if (fs.existsSync(p('sw.js'))) fs.copyFileSync(p('sw.js'), path.join(DIST, 'sw.js'));
  log('wrote dist/ ✓');
}

main().catch((e) => { console.error('[build] FAILED:', e.message); process.exit(1); }).then(() => {
  // Connectedness audit on every build. HIGH-severity structural breaks
  // (broken nav, missing page/backend method) FAIL the build so nothing
  // broken can deploy. MED/INFO are warnings and never block.
  execSync('node audit.mjs', { cwd: ROOT, stdio: 'inherit' });
});
