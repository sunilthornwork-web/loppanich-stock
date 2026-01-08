/* =====================================================
   core/session.js
   Admin Session / Authentication
===================================================== */

import {
  getState,
  setMode,
  setAdminSession,
  clearAdminSession
} from "./state.js";

/* =========================
   CONFIG
========================= */

const STORAGE_KEY = "admin_session";

/* =========================
   STORAGE HELPERS
========================= */

function saveSessionToStorage(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn("Failed to save session", err);
  }
}

function loadSessionFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function clearSessionFromStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

/* =========================
   SESSION VALIDATION
========================= */

export function isSessionExpired(expiredAt) {
  if (!expiredAt) return true;
  return Date.now() > new Date(expiredAt).getTime();
}

/* =========================
   LOGIN
========================= */

/**
 * Login admin via backend
 * @returns { success, token, username, expiredAt }
 */
export async function loginAdmin({
  apiUrl,
  username,
  password
}) {
  if (!apiUrl) throw new Error("Missing apiUrl");
  if (!username || !password) {
    throw new Error("Missing credentials");
  }

  const form = new URLSearchParams();
  form.append("action", "adminLogin");
  form.append("username", username);
  form.append("password", password);

  const res = await fetch(apiUrl, {
    method: "POST",
    body: form
  });

  const json = await res.json();

  if (!json || json.success !== true || !json.token) {
    throw new Error(json?.message || "Login failed");
  }

  const session = {
    token: json.token,
    username: json.username,
    expiredAt: json.expiredAt
  };

  // ✅ update global state
  setAdminSession(session);
  setMode("admin");

  // ✅ persist
  saveSessionToStorage(session);

  return session;
}

/* =========================
   LOGOUT
========================= */

export function logoutAdmin() {
  clearAdminSession();
  clearSessionFromStorage();
  setMode("viewer");
}

/* =========================
   RESTORE SESSION
========================= */

/**
 * Restore session from localStorage
 * (ไม่เรียก backend ตรงนี้)
 */
export function restoreSession() {
  const saved = loadSessionFromStorage();
  if (!saved) return false;

  if (
    !saved.token ||
    !saved.expiredAt ||
    isSessionExpired(saved.expiredAt)
  ) {
    clearSessionFromStorage();
    return false;
  }

  setAdminSession(saved);
  setMode("admin");

  return true;
}

/* =========================
   ACCESS TOKEN (SAFE)
========================= */

export function getAuthToken() {
  const state = getState();
  return state.admin?.token || null;
}

