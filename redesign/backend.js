// ── Fluentra Backend Integration ────────────────────────────────
// Wires Supabase auth + REST APIs into the static prototype.
// Loaded as a plain <script> (no Babel) right after supabase.min.js.
// All public surface lives under window.FL.

(function () {
  'use strict';

  var SUPABASE_URL      = 'https://kbjqmhviuryakfzhhoaz.supabase.co';
  var SUPABASE_AUTH_KEY = 'sb-' + SUPABASE_URL.replace(/^https?:\/\//, '').split('.')[0] + '-auth-token';  // derived from URL — single source
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtianFtaHZpdXJ5YWtmemhob2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTQzNjgsImV4cCI6MjA4OTc3MDM2OH0.Be6sLoc1XRDosJ3XejpD48FarJpb06ZtQCFSuzaz5zY';
  var API_URL           = '/api';

  // ── Hardening: global error reporter (surfaced by the FLBanner) + readiness flag ──
  window.__flReady = false;
  window.__flReportError = function (scope, message) {
    try {
      window.__flLastError = { scope: scope, message: String(message || ''), at: Date.now() };
      window.dispatchEvent(new CustomEvent('fl-error', { detail: { scope: scope, message: String(message || '') } }));
    } catch (e) {}
  };

  // ── Error toast: surface fl-error so save/account/billing failures are never silent ──
  (function () {
    if (typeof document === 'undefined' || window.__flToastReady) return;
    window.__flToastReady = true;
    var LABEL = { save: 'Progress', bootstrap: 'Account', billing: 'Billing', account: 'Account' };
    var box = null;
    function ensureBox() {
      if (box && box.isConnected) return box;
      box = document.createElement('div');
      box.id = 'fl-error-toasts';
      box.style.cssText = 'position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:2147483647;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;';
      (document.body || document.documentElement).appendChild(box);
      return box;
    }
    var active = {};   // key -> toast record (dedup)
    var MAX = 3;       // cap concurrent toasts
    window.addEventListener('fl-error', function (e) {
      var d = (e && e.detail) || {};
      var scope = d.scope || 'app';
      var msg = d.message || 'Something went wrong.';
      try { console.error('[FL error]', scope, msg); } catch (x) {}
      var key = scope + '|' + msg;
      var b = ensureBox();
      // Dedup: same message already on screen -> bump its count and reset its timer.
      if (active[key]) { active[key].count++; active[key].render(); active[key].arm(); return; }
      // Cap: at the limit, dismiss the oldest before adding a new one.
      var keys = Object.keys(active);
      if (keys.length >= MAX) { active[keys[0]].kill(); }
      var el = document.createElement('div');
      el.style.cssText = 'pointer-events:auto;cursor:pointer;max-width:340px;background:#2A1518;color:#FFE9EC;border:1px solid #7A2230;border-radius:12px;padding:9px 13px;box-shadow:0 8px 24px rgba(0,0,0,.28);font-size:13px;line-height:1.4;opacity:0;transform:translateY(8px);transition:opacity .2s,transform .2s;';
      var tag = document.createElement('div');
      tag.style.cssText = 'font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.6;margin-bottom:1px;';
      var bodyEl = document.createElement('div');
      el.appendChild(tag); el.appendChild(bodyEl);
      b.appendChild(el);
      var rec = {
        count: 1, timer: null,
        render: function () { tag.textContent = '\u26A0 ' + (LABEL[scope] || scope) + (rec.count > 1 ? ('  \u00D7' + rec.count) : ''); bodyEl.textContent = String(msg).slice(0, 200); },
        arm: function () { if (rec.timer) clearTimeout(rec.timer); rec.timer = setTimeout(rec.kill, 6500); },
        kill: function () { if (!active[key]) return; delete active[key]; if (rec.timer) clearTimeout(rec.timer); el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 220); }
      };
      active[key] = rec; rec.render();
      requestAnimationFrame(function () { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
      el.addEventListener('click', rec.kill);
      rec.arm();
    });
    window.__flTestError = function (m) { window.__flReportError('save', m || 'Test error — the toast is working.'); };
  })();

  // ── Helpers ────────────────────────────────────────────────────

  function getToken() {
    try {
      var raw = localStorage.getItem(SUPABASE_AUTH_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return (parsed && parsed.access_token) ? parsed.access_token : null;
    } catch (e) { return null; }
  }

  function apiGet(path) {
    var token = getToken();
    return fetch(API_URL + path, {
      headers: token ? { Authorization: 'Bearer ' + token } : {},
    }).then(function (r) { return r.json(); });
  }

  function apiPost(path, body) {
    var token = getToken();
    return fetch(API_URL + path, {
      method: 'POST',
      headers: Object.assign(
        { 'Content-Type': 'application/json' },
        token ? { Authorization: 'Bearer ' + token } : {}
      ),
      body: JSON.stringify(body),
    }).then(function (r) { return r.json(); });
  }

  // ── Init ───────────────────────────────────────────────────────

  function init() {
    if (window.FL && window.FL._ready) return;

    var lib = window.supabase;
    if (!lib || !lib.createClient) {
      console.warn('[FL] Supabase SDK not found — retrying on DOMContentLoaded');
      return;
    }

    var client = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: SUPABASE_AUTH_KEY,
      },
    });

    // ── Public API ─────────────────────────────────────────────
    window.FL = {
      _ready: true,
      client: client,
      user: null,
      API_URL: API_URL,

      // ── Auth ─────────────────────────────────────────────────
      auth: {
        signIn: function (email, pw) {
          return client.auth.signInWithPassword({ email: email, password: pw });
        },
        signUp: function (email, pw, name) {
          return client.auth.signUp({
            email: email,
            password: pw,
            options: {
              data: { full_name: name },
              // Send the confirmation link back to wherever the app is actually
              // hosted (not Supabase's default Site URL, which may be localhost).
              emailRedirectTo: (typeof window !== 'undefined' ? window.location.origin : undefined),
            },
          });
        },
        signOut: function () {
          return client.auth.signOut();
        },
        signInWithGoogle: function () {
          return client.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin },
          });
        },
        signInWithApple: function () {
          return client.auth.signInWithOAuth({
            provider: 'apple',
            options: { redirectTo: window.location.origin },
          });
        },
        getSession: function () {
          return client.auth.getSession();
        },
        getUser: function () {
          return client.auth.getUser();
        },
        resetPassword: function (email) {
          return client.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        },
        updatePassword: function (newPassword) {
          return client.auth.updateUser({ password: newPassword });
        },
        resendVerification: function (email) {
          return client.auth.resend({
            type: 'signup',
            email: email,
            options: { emailRedirectTo: (typeof window !== 'undefined' ? window.location.origin : undefined) },
          });
        },
        // Verify the 6-digit code from the confirmation email (no link click needed).
        // Tries the signup type first, then the unified email type for newer projects.
        verifyOtp: function (email, token) {
          return client.auth.verifyOtp({ email: email, token: token, type: 'signup' }).then(function (res) {
            if (res && res.error) {
              return client.auth.verifyOtp({ email: email, token: token, type: 'email' });
            }
            return res;
          });
        },
      },

      // ── API helpers ──────────────────────────────────────────
      api: {
        get: apiGet,
        post: apiPost,
      },

      // ── Social (Phase 4) — profiles, friends, leaderboard, DMs, activity, phrasebook ──
      social: {
        _uid: function () { return client.auth.getUser().then(function (r) { return (r.data && r.data.user) ? r.data.user.id : null; }); },
        myProfile: function () { return this._uid().then(function (id) { if (!id) return null; return client.from('profiles').select('*').eq('id', id).maybeSingle().then(function (p) { return p.data; }); }); },
        getProfile: function (id) { return client.from('profiles').select('*').eq('id', id).maybeSingle().then(function (r) { return r.data; }); },
        setUsername: function (name) { return this._uid().then(function (id) { if (!id) return null; return client.from('profiles').update({ username: name }).eq('id', id); }); },
        setProfilePublic: function (isPublic) { return this._uid().then(function (id) { if (!id) return null; return client.from('profiles').update({ is_public: !!isPublic }).eq('id', id); }); },
        searchUsers: function (q) { if (!q || q.length < 2) return Promise.resolve([]); var like = '%' + q.replace(/[%,]/g, '') + '%'; return client.from('profiles').select('id,full_name,username,avatar_url,xp,streak').or('username.ilike.' + like + ',full_name.ilike.' + like).limit(20).then(function (r) { return r.data || []; }); },

        leaderboard: function (by, limit) { var col = (by === 'streak' ? 'streak' : 'xp'); return client.from('profiles').select('id,full_name,username,avatar_url,xp,streak,best_score').eq('is_public', true).order(col, { ascending: false }).limit(limit || 50).then(function (r) { return r.data || []; }); },
        syncStats: function () { return this._uid().then(function (id) { if (!id) return null; var R = window.__results || []; var best = R.length ? Math.max.apply(null, R.map(function (x) { return Number(x.score) || 0; })) : 0; var streak = (typeof window.computeStreak === 'function') ? (window.computeStreak(R) || 0) : 0; var xp = (window.__user && window.__user.xp) || R.length * 10; return client.from('profiles').update({ best_score: Math.round(best), streak: streak, xp: xp }).eq('id', id); }).catch(function () {}); },

        listFriends: function () { return this._uid().then(function (id) { if (!id) return { friends: [], incoming: [], outgoing: [] }; return client.from('friendships').select('*').or('requester.eq.' + id + ',addressee.eq.' + id).then(function (res) { var rows = res.data || []; var ids = {}; rows.forEach(function (f) { ids[f.requester] = 1; ids[f.addressee] = 1; }); delete ids[id]; var idList = Object.keys(ids); var profP = idList.length ? client.from('profiles').select('id,full_name,username,avatar_url,xp,streak').in('id', idList).then(function (p) { return p.data || []; }) : Promise.resolve([]); return profP.then(function (profs) { var pm = {}; profs.forEach(function (p) { pm[p.id] = p; }); var friends = [], incoming = [], outgoing = []; rows.forEach(function (f) { var other = f.requester === id ? f.addressee : f.requester; var rec = { friendshipId: f.id, status: f.status, profile: pm[other] || { id: other } }; if (f.status === 'accepted') friends.push(rec); else if (f.addressee === id) incoming.push(rec); else outgoing.push(rec); }); return { friends: friends, incoming: incoming, outgoing: outgoing }; }); }); }); },
        sendFriendRequest: function (addresseeId) { return this._uid().then(function (id) { if (!id) return null; return client.from('friendships').insert({ requester: id, addressee: addresseeId, status: 'pending' }); }); },
        respondFriendRequest: function (friendshipId, accept) { if (accept) return client.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId); return client.from('friendships').delete().eq('id', friendshipId); },
        removeFriend: function (friendshipId) { return client.from('friendships').delete().eq('id', friendshipId); },

        logActivity: function (kind, lang, detail) { return this._uid().then(function (id) { if (!id) return null; return client.from('activity').insert({ user_id: id, kind: kind, lang: lang || null, detail: detail || {} }); }).catch(function () {}); },
        feed: function (limit) { return client.from('activity').select('*').order('created_at', { ascending: false }).limit(limit || 50).then(function (res) { var rows = res.data || []; var ids = Array.from(new Set(rows.map(function (a) { return a.user_id; }))); var profP = ids.length ? client.from('profiles').select('id,full_name,username,avatar_url').in('id', ids).then(function (p) { return p.data || []; }) : Promise.resolve([]); return profP.then(function (profs) { var pm = {}; profs.forEach(function (p) { pm[p.id] = p; }); return rows.map(function (a) { a.profile = pm[a.user_id] || { id: a.user_id }; return a; }); }); }); },

        thread: function (otherId, limit) { return this._uid().then(function (id) { if (!id) return []; return client.from('messages').select('*').or('and(sender.eq.' + id + ',recipient.eq.' + otherId + '),and(sender.eq.' + otherId + ',recipient.eq.' + id + ')').order('created_at', { ascending: true }).limit(limit || 200).then(function (res) { return res.data || []; }); }); },
        sendMessage: function (recipientId, body) { return this._uid().then(function (id) { if (!id) return null; return client.from('messages').insert({ sender: id, recipient: recipientId, body: body }).select().then(function (res) { return res.data && res.data[0]; }); }); },
        subscribeMessages: function (onMsg) { var ch = client.channel('dm-' + Date.now()).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, function (payload) { if (payload && payload.new) onMsg(payload.new); }).subscribe(); return function () { try { client.removeChannel(ch); } catch (e) {} }; },
        conversations: function () { return this._uid().then(function (id) { if (!id) return []; return client.from('messages').select('*').or('sender.eq.' + id + ',recipient.eq.' + id).order('created_at', { ascending: false }).limit(300).then(function (res) { var rows = res.data || []; var seen = {}, convos = []; rows.forEach(function (m) { var other = m.sender === id ? m.recipient : m.sender; if (seen[other]) return; seen[other] = 1; convos.push({ otherId: other, last: m }); }); var ids = convos.map(function (c) { return c.otherId; }); var profP = ids.length ? client.from('profiles').select('id,full_name,username,avatar_url').in('id', ids).then(function (p) { return p.data || []; }) : Promise.resolve([]); return profP.then(function (profs) { var pm = {}; profs.forEach(function (p) { pm[p.id] = p; }); convos.forEach(function (c) { c.profile = pm[c.otherId] || { id: c.otherId }; }); return convos; }); }); }); },

        uploadMedia: function (file, kind) { return this._uid().then(function (id) { if (!id || !file) return null; var ext = (file.name && file.name.indexOf('.') >= 0) ? file.name.split('.').pop() : 'jpg'; var path = id + '/' + (kind || 'media') + '-' + Date.now() + '.' + ext; return client.storage.from('public-media').upload(path, file, { upsert: true, contentType: file.type || undefined }).then(function (res) { if (res && res.error) { console.warn('[FL] upload:', res.error.message); return null; } var pub = client.storage.from('public-media').getPublicUrl(path); return (pub && pub.data && pub.data.publicUrl) || null; }); }); },
        setAvatar: function (url) { return this._uid().then(function (id) { if (!id) return null; return client.from('profiles').update({ avatar_url: url }).eq('id', id); }); },

        createPost: function (body, imageUrl, visibility) { return this._uid().then(function (id) { if (!id) return null; return client.from('posts').insert({ author:id, body:body, image_url:imageUrl||null, visibility:(visibility==='friends'?'friends':'public') }).select().then(function (r) { return r.data && r.data[0]; }); }); },
        deletePost: function (id) { return client.from('posts').delete().eq('id', id); },
        listPosts: function (limit) {
          var self = this;
          return self._uid().then(function (uid) {
            return client.from('posts').select('*').order('created_at', { ascending:false }).limit(limit||50).then(function (res) {
              var posts = res.data || []; if (!posts.length) return [];
              var ids = posts.map(function (p) { return p.id; });
              var authorIds = Array.from(new Set(posts.map(function (p) { return p.author; })));
              return Promise.all([
                client.from('profiles').select('id,full_name,username,avatar_url').in('id', authorIds).then(function (r) { return r.data || []; }),
                client.from('post_likes').select('post_id,user_id').in('post_id', ids).then(function (r) { return r.data || []; }),
                client.from('post_comments').select('post_id').in('post_id', ids).then(function (r) { return r.data || []; })
              ]).then(function (arr) {
                var pm = {}; arr[0].forEach(function (p) { pm[p.id] = p; });
                var likeCount = {}, myLike = {}; arr[1].forEach(function (l) { likeCount[l.post_id] = (likeCount[l.post_id]||0)+1; if (l.user_id === uid) myLike[l.post_id] = true; });
                var cCount = {}; arr[2].forEach(function (c) { cCount[c.post_id] = (cCount[c.post_id]||0)+1; });
                return posts.map(function (p) { p.author_profile = pm[p.author] || { id:p.author }; p.like_count = likeCount[p.id]||0; p.liked = !!myLike[p.id]; p.comment_count = cCount[p.id]||0; p.mine = p.author === uid; return p; });
              });
            });
          });
        },
        likePost: function (postId) { return this._uid().then(function (id) { if (!id) return null; return client.from('post_likes').insert({ post_id:postId, user_id:id }); }); },
        unlikePost: function (postId) { return this._uid().then(function (id) { if (!id) return null; return client.from('post_likes').delete().eq('post_id', postId).eq('user_id', id); }); },
        listComments: function (postId) { return client.from('post_comments').select('*').eq('post_id', postId).order('created_at', { ascending:true }).then(function (res) { var rows = res.data || []; var ids = Array.from(new Set(rows.map(function (c) { return c.user_id; }))); var profP = ids.length ? client.from('profiles').select('id,full_name,username,avatar_url').in('id', ids).then(function (r) { return r.data || []; }) : Promise.resolve([]); return profP.then(function (profs) { var pm = {}; profs.forEach(function (p) { pm[p.id] = p; }); return rows.map(function (c) { c.profile = pm[c.user_id] || { id:c.user_id }; return c; }); }); }); },
        addComment: function (postId, body) { return this._uid().then(function (id) { if (!id) return null; return client.from('post_comments').insert({ post_id:postId, user_id:id, body:body }).select().then(function (r) { return r.data && r.data[0]; }); }); },
        deleteComment: function (id) { return client.from('post_comments').delete().eq('id', id); },

        listPhrases: function (lang) { var q = client.from('phrases').select('*').order('created_at', { ascending: false }); if (lang) q = q.eq('lang', lang); return q.then(function (r) { return r.data || []; }); },
        addPhrase: function (lang, front, back) { return this._uid().then(function (id) { if (!id) return null; return client.from('phrases').insert({ user_id: id, lang: lang, front: front, back: back || null }).select().then(function (res) { return res.data && res.data[0]; }); }); },
        deletePhrase: function (id) { return client.from('phrases').delete().eq('id', id); },
      },

      // ── User profile ─────────────────────────────────────────
      fetchProfile: function () {
        return client.auth.getUser().then(function (res) {
          var user = res.data && res.data.user;
          if (!user) return null;

          // Try profiles table; gracefully fall back if it doesn't exist
          return client
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()
            .then(function (prof) {
              var p = (prof && prof.data) || {};
              var name =
                p.full_name ||
                (user.user_metadata && user.user_metadata.full_name) ||
                ((user.email || 'there').split('@')[0]);
              name = String(name || 'there');

              var data = {
                id: user.id,
                email: user.email,
                name: name,
                firstName: name.split(' ')[0],
                streak: p.streak || 0,
                xp: p.xp || 0,
                plan: p.plan || 'free',
                subscriptionStatus: p.subscription_status || null,
                currentPeriodEnd: p.current_period_end || null,
                renewsOn: p.current_period_end ? new Date(p.current_period_end).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' }) : '',
                nativeLang: p.native_language || '',
                targetExam: p.target_exam || 'IELTS',
                targetScore: p.target_score || 7.0,
                avatar: p.avatar_url || null,
              };

              window.FL.user = data;
              window.__user = data;
              return data;
            });
        });
      },

      // ── User languages ───────────────────────────────────────
      fetchLanguages: function () {
        return client.auth.getUser().then(function (res) {
          var user = res.data && res.data.user;
          if (!user) return null;

          return client
            .from('user_languages')
            .select('*')
            .eq('user_id', user.id)
            .then(function (result) {
              var rows = (result && result.data) || [];
              if (!rows.length) return null;

              var langs = rows.map(function (r) {
                return {
                  code: r.language_code,
                  native: r.native_name || r.language_code.toUpperCase(),
                  english: r.english_name || r.language_code,
                  streak: r.streak || 0,
                  level: r.level || 'A2',
                  exam: r.exam_type || 'IELTS',
                  flag: r.language_code,
                };
              });

              window.__userLanguages = langs;
              // Patch window.userLanguages so every component picks up real data
              FL._patchUserLanguages();
              return langs;
            });
        });
      },

      // ── Patch the _kit.jsx userLanguages() with real data ────
      _patchUserLanguages: function () {
        var langs = window.__userLanguages;
        if (!langs || !langs.length) return;
        // Override the global function exported by _kit.jsx
        window.userLanguages = function () { return langs; };
        window.langByCode = function (code) {
          return langs.find(function (l) { return l.code === code; }) || langs[0];
        };
      },

      // ── Today's content ──────────────────────────────────────
      // ── Add a language (persist to user_languages, then refresh) ──
      addLanguage: function (lang) {
        // Tier gate: Free = 1 language. Adding a NEW language past the cap is
        // rejected here (server-truth), not just hidden in the UI.
        var have = window.__userLanguages || [];
        var already = have.some(function (l) { return l && l.code === lang.code; });
        var cap = (window.__maxLang && window.__maxLang()) || 1;
        if (!already && have.length >= cap) {
          return Promise.reject(new Error('LANG_LIMIT'));
        }
        return client.auth.getUser().then(function (res) {
          var user = res.data && res.data.user;
          if (!user) return Promise.reject(new Error('Not signed in'));
          var row = {
            user_id: user.id,
            language_code: lang.code,
            native_name: lang.native || lang.code.toUpperCase(),
            english_name: lang.english || lang.code,
            level: lang.level || 'A1',
            exam_type: lang.exam || 'IELTS',
            streak: 0,
          };
          return client.from('user_languages').upsert(row, { onConflict: 'user_id,language_code' }).then(function (r) {
            if (r.error) throw r.error;
            window.__langCode = lang.code;
            return FL.fetchLanguages().then(function () {
              window.dispatchEvent(new CustomEvent('fl-updated'));
              return true;
            });
          });
        });
      },

      // ── Update profile (name, exam target, native language, etc.) ──
      updateProfile: function (patch) {
        return client.auth.getUser().then(function (res) {
          var user = res.data && res.data.user;
          if (!user) return Promise.reject(new Error('Not signed in'));
          var row = Object.assign({ id: user.id }, patch);
          return client.from('profiles').upsert(row, { onConflict: 'id' }).then(function (r) {
            if (r.error) throw r.error;
            return FL.fetchProfile().then(function () { window.dispatchEvent(new CustomEvent('fl-updated')); return true; });
          });
        });
      },

      // ── User results (from user_content, RLS-scoped to the user) ──
      fetchResults: function (limit) {
        return client.auth.getUser().then(function (res) {
          var user = res.data && res.data.user;
          if (!user) return [];
          return client.from('user_content')
            .select('lang,score,status,detail,content_id,updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(limit || 200)
            .then(function (r) {
              if (r.error) { console.warn('[FL] fetchResults:', r.error.message); return []; }
              window.__results = r.data || [];
              try { if (FL.social && FL.social.syncStats) FL.social.syncStats(); } catch (e) {}
              return window.__results;
            });
        });
      },

      // ── Learner model (Phase 1) — derived purely from the user's REAL saved
      // results in window.__results. No fabricated data: skills with no completed
      // sessions return null stats. Used to adapt content difficulty per skill.
      learnerProfile: function (lang) {
        var L = lang || window.__langCode || 'en';
        var R = (window.__results || []).filter(function (r) { return r && r.lang === L && typeof r.score === 'number'; });
        var SKILLS = ['reading', 'listening', 'writing', 'speaking'];
        function statFor(mod) {
          var rows = R.filter(function (r) { return r.detail && r.detail.module === mod; })
            .sort(function (a, b) { return new Date(b.updated_at || 0) - new Date(a.updated_at || 0); }); // newest first
          if (!rows.length) return { count: 0, avg: null, recent: null, trend: 0, suggestedDifficulty: 'medium', weakCriterion: null };
          var scores = rows.map(function (r) { return Number(r.score) || 0; });
          var mean = function (a) { return a.length ? Math.round(a.reduce(function (x, y) { return x + y; }, 0) / a.length) : null; };
          var recent = mean(scores.slice(0, Math.min(5, scores.length)));
          var older = scores.length > 5 ? mean(scores.slice(5)) : recent;
          var diff = 'medium';
          if (rows.length >= 2) { diff = recent >= 80 ? 'hard' : (recent < 55 ? 'easy' : 'medium'); }
          // Granular weakness: lowest-average grading criterion across recent graded rows.
          var CRIT_LABEL = { task_response: 'task response', coherence_cohesion: 'coherence & cohesion', lexical_resource: 'vocabulary range', grammatical_range_accuracy: 'grammar', fluency_coherence: 'fluency' };
          var critRows = rows.filter(function (r) { return r.detail && r.detail.criteria && typeof r.detail.criteria === 'object'; }).slice(0, 5);
          var weakCriterion = null;
          if (critRows.length) {
            var sums = {}, cnts = {};
            critRows.forEach(function (r) { var c = r.detail.criteria; for (var k in c) { if (typeof c[k] === 'number') { sums[k] = (sums[k] || 0) + c[k]; cnts[k] = (cnts[k] || 0) + 1; } } });
            var lowK = null, lowV = Infinity;
            for (var kk in sums) { var av = sums[kk] / cnts[kk]; if (av < lowV) { lowV = av; lowK = kk; } }
            if (lowK) weakCriterion = { key: lowK, band: Math.round(lowV * 10) / 10, label: CRIT_LABEL[lowK] || lowK.replace(/_/g, ' ') };
          }
          return { count: rows.length, avg: mean(scores), recent: recent, trend: recent - older, suggestedDifficulty: diff, weakCriterion: weakCriterion };
        }
        var skills = {};
        SKILLS.forEach(function (s) { skills[s] = statFor(s); });
        var overall = R.length ? Math.round(R.reduce(function (a, r) { return a + (Number(r.score) || 0); }, 0) / R.length) : null;
        var ranked = SKILLS.filter(function (s) { return skills[s].count >= 2; })
          .sort(function (a, b) { return skills[a].avg - skills[b].avg; });
        // Single most-actionable focus: the lowest grading criterion across writing + speaking.
        var focus = null;
        ['writing', 'speaking'].forEach(function (sk) {
          var wc = skills[sk] && skills[sk].weakCriterion;
          if (wc && (!focus || wc.band < focus.band)) focus = { skill: sk, key: wc.key, band: wc.band, label: wc.label };
        });
        return {
          lang: L,
          sessions: R.length,
          overall: overall,
          skills: skills,
          weakest: ranked.length ? ranked[0] : null,
          strongest: ranked.length ? ranked[ranked.length - 1] : null,
          focus: focus,
        };
      },

      // ── Spaced repetition (SM-2) ─────────────────────────────
      srsSchedule: function (st, quality) {
        var ease = (st && st.ease) || 2.5, interval = (st && st.interval_days) || 0, reps = (st && st.reps) || 0;
        if (quality < 3) { reps = 0; interval = 1; }
        else {
          reps += 1;
          interval = reps === 1 ? 1 : reps === 2 ? 6 : Math.max(1, Math.round(interval * ease));
          ease = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
        }
        return { ease: ease, interval_days: interval, reps: reps, due: new Date(Date.now() + interval * 86400000).toISOString() };
      },
      srsStates: function (lang) {
        return client.auth.getUser().then(function (res) {
          var user = res.data && res.data.user;
          if (!user) return {};
          return client.from('vocab_srs').select('card,ease,interval_days,reps,due').eq('user_id', user.id).eq('lang', lang).then(function (r) {
            if (r.error) { console.warn('[FL] srsStates:', r.error.message); return {}; }
            var map = {}; (r.data || []).forEach(function (row) { map[row.card] = row; }); return map;
          });
        });
      },
      srsSave: function (lang, term, st) {
        return client.auth.getUser().then(function (res) {
          var user = res.data && res.data.user;
          if (!user) return null;
          var row = { user_id: user.id, card: lang + '::' + term, lang: lang, ease: st.ease, interval_days: st.interval_days, reps: st.reps, due: st.due, last_reviewed: new Date().toISOString() };
          return client.from('vocab_srs').upsert(row, { onConflict: 'user_id,card' }).then(function (r) { if (r.error) console.warn('[FL] srsSave:', r.error.message); return r.data; });
        });
      },

      fetchTodayContent: function () {
        var lang = window.__langCode || 'en';
        return apiGet('/content-list?lang=' + encodeURIComponent(lang) + '&limit=6').then(function (data) {
          if (data && data.items) { window.__todayContent = data.items; }
          return data;
        }).catch(function () { return null; });
      },

      // ── Library ──────────────────────────────────────────────
      fetchLibrary: function (code, type, page) {
        var lang = code || window.__langCode || 'en';
        var path = '/content-list?lang=' + encodeURIComponent(lang) + '&limit=20';
        if (type) path += '&type=' + encodeURIComponent(type);
        return apiGet(path).catch(function () { return { items: [] }; });
      },

      // ── AI Writing Grader ─────────────────────────────────────
      gradeWriting: function (task, text, langCode) {
        // Tier gate: AI writing feedback is Pro/Max only.
        if (window.__can && !window.__can('writingFeedback')) {
          return Promise.resolve({ locked: true });
        }
        return fetch('/api/grade-writing', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, window.__authHeaders ? window.__authHeaders() : {}),
          body: JSON.stringify({ task: task, text: text, lang: langCode || 'en' }),
        }).then(function (r) { return r.json(); });
      },

      // Read the signed-in user's current usage (for "X left" UI). RLS lets a
      // user read only their own counter row.
      usage: function () {
        var plan = (window.__user && window.__user.plan) || 'free';
        var B = { free: { p: 'day', c: 10 }, pro: { p: 'month', c: 800 }, max: { p: 'month', c: 4000 } };
        var b = B[plan] || B.free;
        var iso = new Date().toISOString();
        var period = b.p === 'day' ? 'day:' + iso.slice(0, 10) : 'month:' + iso.slice(0, 7);
        var fallback = { plan: plan, used: 0, limit: b.c, remaining: b.c, period: b.p };
        var uidNow = (window.__user && window.__user.id) || null;
        var getUid = uidNow ? Promise.resolve(uidNow)
          : client.auth.getUser().then(function (r) { return (r.data && r.data.user) ? r.data.user.id : null; }).catch(function () { return null; });
        return getUid.then(function (uid) {
          if (!uid) return fallback;
          // Filter by user_id explicitly — never depend on RLS alone to scope the row.
          return client.from('usage_counters').select('credits').eq('user_id', uid).eq('period', period).maybeSingle()
            .then(function (r) {
              var used = (r && r.data && r.data.credits) || 0;
              return { plan: plan, used: used, limit: b.c, remaining: Math.max(0, b.c - used), period: b.p };
            });
        }).catch(function () { return fallback; });
      },
      // Permanently delete the signed-in account (server verifies identity from the token).
      deleteAccount: function () {
        var headers = Object.assign({ 'Content-Type': 'application/json' }, window.__authHeaders ? window.__authHeaders() : {});
        if (!headers.Authorization) return Promise.resolve({ ok: false, error: 'not signed in' });
        return fetch('/api/delete-account', { method: 'POST', headers: headers })
          .then(function (r) { return r.text().then(function (t) { var j; try { j = JSON.parse(t); } catch (e) { j = {}; } return { ok: r.ok, status: r.status, data: j }; }); })
          .catch(function (e) { return { ok: false, error: String((e && e.message) || e) }; });
      },

      // ── Rate limit ───────────────────────────────────────────
      checkRate: function (feature) {
        return Promise.resolve({ allowed: true });
      },
      incrementRate: function (feature) {
        return Promise.resolve();
      },

      // ── Sign out (called from Settings "Sign out" button) ────
      signOut: function () {
        return client.auth.signOut().then(function () {
          window.FL.user = null;
          window.__user = null;
          window.__userLanguages = null;
          window.__nav && window.__nav('auth_login');
        });
      },
    };

    // ── First-run: a signed-in user with zero languages is guided to add their first one ──
    function firstRunRouteIfNeeded() {
      var hasLangs = window.__userLanguages && window.__userLanguages.length;
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (window.__nav) {
          clearInterval(iv);
          if (!hasLangs) { window.__nav('welcome'); return; }
          if (window.__navResumed) return;
          window.__navResumed = true;
          try {
            var last = localStorage.getItem('fl-last-route');
            var lastLang = localStorage.getItem('fl-last-lang');
            if (lastLang) window.__langCode = lastLang;
            if (last && last !== 'dashboard') window.__nav(last);
          } catch (e) {}
        } else if (tries > 40) { clearInterval(iv); }
      }, 100);
    }

    // ── Auth state listener ─────────────────────────────────────
    function navWhenReady(id) {
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (window.__nav) { clearInterval(iv); window.__nav(id); }
        else if (tries > 50) { clearInterval(iv); }
      }, 100);
    }

    client.auth.onAuthStateChange(function (event, session) {
      if (event === 'PASSWORD_RECOVERY') {
        navWhenReady('reset_password');
        document.body.setAttribute('data-fl-ready', '1');
        return;
      }
      if (session) {
        Promise.all([
          FL.fetchProfile().then(function (user) {
            if (user) {
              document.querySelectorAll('[data-fl-name]').forEach(function (el) {
                el.textContent = user.firstName || user.name;
              });
            }
          }),
          FL.fetchLanguages(),
          FL.fetchTodayContent(),
          FL.fetchResults(300)
        ]).then(function () {
          window.__flReady = true;
          window.dispatchEvent(new CustomEvent('fl-updated'));
          firstRunRouteIfNeeded();
        }).catch(function (e) {
          window.__flReady = true;
          window.__flReportError('bootstrap', (e && e.message) || 'Failed to load your account data.');
          window.dispatchEvent(new CustomEvent('fl-updated'));
        });
        if (event === 'SIGNED_IN') {
          // Supabase re-fires SIGNED_IN on token refresh and tab refocus too, not just
          // on actual login. Only jump to the dashboard when the user is sitting on an
          // entry/auth screen — otherwise leave them on whatever page they're using.
          var ENTRY = ['welcome','splash','prelaunch','marketing','auth_login','auth_signup','auth_onboarding','otp','forgot_pw','reset_password','onboarding', undefined, null, ''];
          if (ENTRY.indexOf(window.__page) >= 0) { window.__nav && window.__nav('dashboard'); }
          window.__navResumed = true;
        }
      } else {
        window.FL.user = null;
        window.__user = null;
        if (event === 'SIGNED_OUT') {
          window.__nav && window.__nav('auth_login');
        }
      }
    });

    // ── Check session on cold load ──────────────────────────────
    client.auth.getSession().then(function (res) {
      var session = res.data && res.data.session;
      if (session) {
        Promise.all([FL.fetchProfile(), FL.fetchLanguages(), FL.fetchTodayContent(), FL.fetchResults(300)]).then(function () {
          window.__flReady = true;
          window.dispatchEvent(new CustomEvent('fl-updated'));
          firstRunRouteIfNeeded();
        }).catch(function (e) {
          window.__flReady = true;
          window.__flReportError('bootstrap', (e && e.message) || 'Failed to load your account data.');
          window.dispatchEvent(new CustomEvent('fl-updated'));
        });
      } else {
        // No session — redirect to login once App is mounted
        var waited = 0;
        var check = setInterval(function () {
          waited += 100;
          if (window.__nav) {
            clearInterval(check);
            window.__nav('auth_login');
          } else if (waited > 5000) {
            clearInterval(check);
          }
        }, 100);
      }
      // Dismiss HTML splash
      document.body.setAttribute('data-fl-ready', '1');
    });

    // ── Billing (Stripe) ─────────────────────────────────────
    function flBilling(action, extra) {
      return client.auth.getSession().then(function (s) {
        var token = s && s.data && s.data.session && s.data.session.access_token;
        if (!token) { window.__nav && window.__nav('auth_login'); return; }
        return fetch('/api/billing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify(Object.assign({ action: action }, extra || {})),
        }).then(function (r) { return r.json(); }).then(function (data) {
          if (data && data.url) window.location.href = data.url;
          else window.__flReportError('billing', (data && data.error) || 'Could not start checkout. Please try again.');
        });
      }).catch(function (e) { window.__flReportError('billing', (e && e.message) || 'Billing error.'); });
    }
    window.FL.startCheckout = function (planKey) { return flBilling('checkout', { planKey: planKey }); };
    window.FL.openBillingPortal = function () { return flBilling('portal', {}); };

    function handleBillingReturn() {
      try {
        var q = new URLSearchParams(window.location.search);
        var b = q.get('billing');
        if (!b) return;
        history.replaceState({}, '', window.location.pathname);
        if (b === 'success') {
          navWhenReady('new_payment_success');
          setTimeout(function () { FL.fetchProfile && FL.fetchProfile().then(function () { window.dispatchEvent(new CustomEvent('fl-updated')); }); }, 1500);
        } else if (b === 'cancel') {
          navWhenReady('pricing');
        }
      } catch (e) {}
    }
    handleBillingReturn();

    // Also expose signOut globally for sign-out buttons
    window.__signOut = function () { return window.FL.signOut(); };

    // ── Tier entitlements: single source of truth for ALL gating ──
    // Cost-based caps (Pro ~$8 AI ceiling, Max = 5x) are enforced via usage
    // metering (added separately); these booleans gate features by plan.
    var ENT = {
      free: { maxLanguages: 1,   mockTests: false, speaking: false, writingFeedback: false, examsIncluded: false, tutorPerDay: 10 },
      pro:  { maxLanguages: 999, mockTests: true,  speaking: true,  writingFeedback: true,  examsIncluded: false, tutorPerDay: 999 },
      max:  { maxLanguages: 999, mockTests: true,  speaking: true,  writingFeedback: true,  examsIncluded: true,  tutorPerDay: 999 },
    };
    window.__plan    = function () { return (window.__user && window.__user.plan) || 'free'; };
    window.__ent     = function () { return ENT[window.__plan()] || ENT.free; };
    window.__can     = function (f) { return !!window.__ent()[f]; };
    window.__maxLang = function () { return window.__ent().maxLanguages; };
    window.__upgrade = function (reason) { window.__upgradeReason = reason || ''; if (window.__nav) window.__nav('pricing'); };
    // The learner's single weakest grading dimension (e.g. 'grammar'), or null.
    window.__focusArea = function (lang) {
      try {
        var p = window.FL && window.FL.learnerProfile ? window.FL.learnerProfile(lang) : null;
        return (p && p.focus && p.focus.label) || null;
      } catch (e) { return null; }
    };
    // Per-skill content difficulty derived from the learner's real recent scores.
    // Defaults to 'medium' until there's enough data, so new users are unaffected.
    window.__adaptiveDifficulty = function (lang, skill) {
      try {
        var p = window.FL && window.FL.learnerProfile ? window.FL.learnerProfile(lang) : null;
        var s = p && p.skills && p.skills[skill];
        if (!s || s.count < 2) return null; // not enough real data -> caller keeps its default
        return s.suggestedDifficulty || null;
      } catch (e) { return 'medium'; }
    };
    // ONE place to switch the active learning language. Sets __langCode AND refreshes
    // the per-language "today" content so a multi-language user never sees another
    // language's content lingering after a switch. All langCode-set call sites use this.
    window.__setLang = function (code) {
      if (!code) return;
      var changed = window.__langCode !== code;
      window.__langCode = code;
      if (!changed) return;
      window.__todayContent = null; // drop the old language's content immediately
      if (window.FL && window.FL.fetchTodayContent) {
        window.FL.fetchTodayContent().then(function () { window.dispatchEvent(new CustomEvent('fl-updated')); }).catch(function () { window.dispatchEvent(new CustomEvent('fl-updated')); });
      } else {
        window.dispatchEvent(new CustomEvent('fl-updated'));
      }
    };
    // Start a specific checkout (one-time item or plan). Sets the checkout item
    // so the checkout page shows the RIGHT thing (e.g. $5 exam, not the monthly plan).
    window.payFor = function (item) { window.__checkoutItem = item || 'exam_official'; if (window.__nav) window.__nav('checkout'); };
    // ONE place that persists results to /api/save-result, so a failed save can
    // never be silently swallowed again: it checks the HTTP status, logs, and
    // surfaces failures through the fl-error channel. Returns {ok, ...} (never throws).
    window.__saveResult = function (body) {
      var headers = Object.assign({ 'Content-Type': 'application/json' }, window.__authHeaders ? window.__authHeaders() : {});
      if (!headers.Authorization) { try { console.warn('[FL] save-result skipped — not signed in'); } catch (e) {} return Promise.resolve({ ok: false, reason: 'no-auth' }); }
      return fetch('/api/save-result', { method: 'POST', headers: headers, body: JSON.stringify(body || {}) })
        .then(function (r) {
          if (r.ok) return r.json().then(function (j) { return { ok: true, data: j }; }).catch(function () { return { ok: true }; });
          return r.text().then(function (t) {
            try { console.error('[FL] save-result failed', r.status, (t || '').slice(0, 200)); } catch (e) {}
            if (window.__flReportError) window.__flReportError('save', 'Your result could not be saved (' + r.status + ').');
            return { ok: false, status: r.status, detail: (t || '').slice(0, 200) };
          });
        })
        .catch(function (e) {
          try { console.error('[FL] save-result network error', e); } catch (x) {}
          if (window.__flReportError) window.__flReportError('save', 'Your result could not be saved — check your connection.');
          return { ok: false, error: String((e && e.message) || e) };
        });
    };
    // Full delete-account action: call the API, then sign out and return to landing.
    window.__deleteAccount = function () {
      var p = (window.FL && window.FL.deleteAccount) ? window.FL.deleteAccount() : Promise.resolve({ ok: false, error: 'unavailable' });
      return p.then(function (res) {
        if (res && res.ok) {
          try { if (window.FL && window.FL.signOut) window.FL.signOut(); } catch (e) {}
          try { localStorage.removeItem(SUPABASE_AUTH_KEY); } catch (e) {}
          window.__user = null;
          if (window.__nav) window.__nav('landing');
          return { ok: true };
        }
        if (window.__flReportError) window.__flReportError('account', (res && res.data && res.data.error) || res.error || 'Could not delete your account. Please try again.');
        return res || { ok: false };
      });
    };
    // Auth header for direct fetch() calls to /api (so usage metering can identify the user)
    window.__authHeaders = function () {
      var t = getToken();
      return t ? { Authorization: 'Bearer ' + t } : {};
    };
    window.__authToken = getToken;          // central token getter for all call sites
    window.__AUTH_KEY  = SUPABASE_AUTH_KEY;  // exposed for any direct readers

    window.__FL_BUILD = 'b193-learner-p4-focuscard';
    console.log('[FL] Backend ready ✓ build', window.__FL_BUILD);
  }

  // Try immediately; Supabase SDK is a synchronous <script> before us
  init();
  document.addEventListener('DOMContentLoaded', function () {
    if (!window.FL || !window.FL._ready) init();
  });
  window._initFL = init;
})();
