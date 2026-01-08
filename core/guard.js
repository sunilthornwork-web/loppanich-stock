// core/guard.js

import { state } from "./state.js";
import { isSessionValid, logoutAdmin } from "./session.js";

/* ================= ADMIN GUARD ================= */

export function requireAdmin() {
  if (!state.admin.loggedIn) {
    throw new Error("Admin not logged in");
  }

  if (!isSessionValid()) {
    forceLogout("Session expired");
  }
}

/* ================= SAFE GUARD ================= */

export function safeAdmin(fn) {
  return async (...args) => {
    try {
      requireAdmin();
      return await fn(...args);
    } catch (err) {
      handleGuardError(err);
    }
  };
}

/* ================= FORCE LOGOUT ================= */

function forceLogout(message) {
  alert(message || "Session expired");
  logoutAdmin();
  location.reload(); // 🔁 clean reset
}

/* ================= ERROR HANDLER ================= */

function handleGuardError(err) {
  console.error("Guard blocked:", err.message);

  if (
    err.message?.includes("Session") ||
    err.message?.includes("token")
  ) {
    forceLogout("Session หมดอายุ กรุณา login ใหม่");
    return;
  }

  alert(err.message || "Unauthorized");
}
