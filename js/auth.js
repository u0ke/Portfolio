/* ===========================================
   Hamza Bari (Ice) — auth.js
   Session-based admin authentication
   =========================================== */

(function () {
  'use strict';

  const SESSION_KEY = 'ice_admin_session';
  const CREDS_KEY = 'ice_admin_creds';
  const SESSION_HOURS = 8;

  // Default credentials (overridable in admin settings)
  // username: ice_admin / password: Ice2026!
  const DEFAULT_CREDS = { username: 'ice_admin', password: 'Ice2026!' };

  function getCreds() {
    try {
      const raw = localStorage.getItem(CREDS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    try { localStorage.setItem(CREDS_KEY, JSON.stringify(DEFAULT_CREDS)); } catch (e) {}
    return DEFAULT_CREDS;
  }

  function setCreds(u, p) {
    try { localStorage.setItem(CREDS_KEY, JSON.stringify({ username: u, password: p })); } catch (e) {}
  }

  function isAuthenticated() {
    try {
      const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (!s) return false;
      return Date.now() - s.ts < SESSION_HOURS * 60 * 60 * 1000;
    } catch (e) { return false; }
  }

  function login(username, password) {
    const creds = getCreds();
    if (username === creds.username && password === creds.password) {
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now(), user: username })); } catch (e) {}
      return true;
    }
    return false;
  }

  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  function requireAuth(redirectTo) {
    if (!isAuthenticated()) {
      window.location.href = redirectTo || 'login.html';
      return false;
    }
    return true;
  }

  // Expose
  window.IceAuth = {
    isAuthenticated,
    login,
    logout,
    requireAuth,
    getCreds,
    setCreds,
    SESSION_KEY,
    CREDS_KEY
  };
})();
