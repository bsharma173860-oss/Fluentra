// ── Fluentra Backend Integration ────────────────────────────────
// Wires Supabase auth + REST APIs into the static prototype.
// Loaded as a plain <script> (no Babel) right after supabase.min.js.
// All public surface lives under window.FL.

(function () {
  'use strict';

  var SUPABASE_URL      = 'https://kbjqmhviuryakfzhhoaz.supabase.co';
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

  // ── Helpers ────────────────────────────────────────────────────

  function getToken() {
    try {
      var raw = localStorage.getItem('sb-kbjqmhviuryakfzhhoaz-auth-token');
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
        storageKey: 'sb-kbjqmhviuryakfzhhoaz-auth-token',
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
            options: { data: { full_name: name } },
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
          return client.auth.resend({ type: 'signup', email: email });
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
                user.email.split('@')[0];

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
        return fetch('/api/grade-writing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: task, text: text, lang: langCode || 'en' }),
        }).then(function (r) { return r.json(); });
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

    window.__FL_BUILD = 'b93-nav-and-pricing-fix';
    console.log('[FL] Backend ready ✓ build', window.__FL_BUILD);
  }

  // Try immediately; Supabase SDK is a synchronous <script> before us
  init();
  document.addEventListener('DOMContentLoaded', function () {
    if (!window.FL || !window.FL._ready) init();
  });
  window._initFL = init;
})();
