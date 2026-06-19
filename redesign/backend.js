// ── Fluentra Backend Integration ────────────────────────────────
// Wires Supabase auth + REST APIs into the static prototype.
// Loaded as a plain <script> (no Babel) right after supabase.min.js.
// All public surface lives under window.FL.

(function () {
  'use strict';

  var SUPABASE_URL      = 'https://kbjqmhviuryakfzhhoaz.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtianFtaHZpdXJ5YWtmemhob2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTQzNjgsImV4cCI6MjA4OTc3MDM2OH0.Be6sLoc1XRDosJ3XejpD48FarJpb06ZtQCFSuzaz5zY';
  var API_URL           = '/api';

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
              return window.__results;
            });
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

    // ── Auth state listener ─────────────────────────────────────
    client.auth.onAuthStateChange(function (event, session) {
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
          FL.fetchTodayContent()
        ]).then(function () {
          window.dispatchEvent(new CustomEvent('fl-updated'));
        });
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
        Promise.all([FL.fetchProfile(), FL.fetchLanguages(), FL.fetchTodayContent()]).then(function () {
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

    // Also expose signOut globally for sign-out buttons
    window.__signOut = function () { return window.FL.signOut(); };

    window.__FL_BUILD = 'b21-writing-feedback-green-answers';
    console.log('[FL] Backend ready ✓ build', window.__FL_BUILD);
  }

  // Try immediately; Supabase SDK is a synchronous <script> before us
  init();
  document.addEventListener('DOMContentLoaded', function () {
    if (!window.FL || !window.FL._ready) init();
  });
  window._initFL = init;
})();
