// ── Fluentra Backend Integration ────────────────────────────────
// Wires Supabase auth + REST APIs into the static prototype.
// Loaded as a plain <script> (no Babel) right after supabase.min.js.
// All public surface lives under window.FL.

(function () {
  'use strict';

  var SUPABASE_URL      = 'https://kbjqmhviuryakfzhhoaz.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtianFtaHZpdXJ5YWtmemhob2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTQzNjgsImV4cCI6MjA4OTc3MDM2OH0.Be6sLoc1XRDosJ3XejpD48FarJpb06ZtQCFSuzaz5zY';
  var API_URL           = 'https://fluentra-kappa.vercel.app/api';

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
      },

      // ── API helpers ──────────────────────────────────────────
      api: {
        get: apiGet,
        post: apiPost,
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
      fetchTodayContent: function () {
        return apiGet('/content/today').then(function (data) {
          if (data && data.content) {
            window.__todayContent = data.content;
          }
          return data;
        }).catch(function () { return null; });
      },

      // ── Library ──────────────────────────────────────────────
      fetchLibrary: function (code, type, page) {
        var params = new URLSearchParams({ page: page || 1, limit: 20 });
        if (code) params.set('code', code);
        if (type) params.set('type', type);
        return apiGet('/library?' + params.toString()).catch(function () { return { items: [] }; });
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
        var u = window.FL.user;
        if (!u) return Promise.resolve({ allowed: false, reason: 'not_authenticated' });
        return apiPost('/rate/check', {
          userId: u.id,
          feature: feature,
          plan: u.plan,
        }).catch(function () { return { allowed: true }; }); // fail open
      },
      incrementRate: function (feature) {
        var u = window.FL.user;
        if (!u) return Promise.resolve();
        return apiPost('/rate/increment', {
          userId: u.id,
          feature: feature,
        }).catch(function () {});
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

    // ── Auth state listener ─────────────────────────────────────
    client.auth.onAuthStateChange(function (event, session) {
      if (session) {
        FL.fetchProfile().then(function (user) {
          if (user) {
            // Patch greeting name in dashboard immediately
            document.querySelectorAll('[data-fl-name]').forEach(function (el) {
              el.textContent = user.firstName || user.name;
            });
          }
        });
        FL.fetchLanguages();
        if (event === 'SIGNED_IN') {
          window.__nav && window.__nav('dashboard');
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
        FL.fetchProfile();
        FL.fetchLanguages();
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

    // Also expose signOut globally for sign-out buttons
    window.__signOut = function () { return window.FL.signOut(); };

    console.log('[FL] Backend ready ✓');
  }

  // Try immediately; Supabase SDK is a synchronous <script> before us
  init();
  document.addEventListener('DOMContentLoaded', function () {
    if (!window.FL || !window.FL._ready) init();
  });
  window._initFL = init;
})();
