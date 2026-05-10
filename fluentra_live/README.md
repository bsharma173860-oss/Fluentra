# Fluentra — Live Prototype

This folder is a self-contained static site of the Fluentra prototype. The entry file is `index.html`.

## Deploy in 30 seconds

### Option A — Netlify Drop (no account needed)
1. Go to https://app.netlify.com/drop
2. Drag this entire folder onto the page
3. You get a live URL instantly

### Option B — Vercel
1. Go to https://vercel.com/new
2. Drag this folder onto the page
3. When asked, leave all settings as default — it auto-detects `index.html`
4. Click Deploy

### Option C — GitHub Pages
1. Push this folder to a new GitHub repo
2. Settings → Pages → Source: `main` branch, `/` (root)
3. Visit `https://<username>.github.io/<repo-name>/`

## Open it locally first
Just double-click `index.html` — it opens in your browser. Some screens need to be served (not file://) to load JSX correctly. Easiest local server:

```bash
cd fluentra_live
python3 -m http.server 8000
```

Then open http://localhost:8000.
