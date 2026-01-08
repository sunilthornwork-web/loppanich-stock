// =======================================
// FRONTEND SESSION MANAGER (PRODUCTION)
// =======================================

const SESSION_KEY = "admin_session";

/* =======================================
   SAVE SESSION (หลัง Login สำเร็จ)
======================================= */
function saveSession({ token, username, expiredAt }) {
  if (!token || !expiredAt) return;

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      token,
      username,
      expiredAt
    })
  );
}

/* =======================================
   LOAD SESSION (ตอนเปิดเว็บ / reload)
======================================= */
function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);

    if (
      !session.token ||
      !session.expiredAt ||
      isSessionExpired(session.expiredAt)
    ) {
      clearSession();
      return null;
    }

    return session;
  } catch (err) {
    console.warn("Invalid session data");
    clearSession();
    return null;
  }
}

/* =======================================
   CLEAR SESSION (logout / expired)
======================================= */
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* =======================================
   CHECK SESSION EXPIRE
======================================= */
function isSessionExpired(expiredAt) {
  if (!expiredAt) return true;
  return Date.now() > new Date(expiredAt).getTime();
}

/* =======================================
   APPLY SESSION TO STATE
======================================= */
function applySessionToState(session) {
  if (!session) return false;

  const state = getState();

  state.mode = "admin";
  state.admin.loggedIn = true;
  state.admin.user = session.username;
  state.admin.token = session.token;
  state.admin.expiredAt = session.expiredAt;

  return true;
}

/* =======================================
   GUARD: REQUIRE ADMIN SESSION
======================================= */
function requireAdminSession() {
  const state = getState();

  if (
    !state.admin.loggedIn ||
    !state.admin.token ||
    isSessionExpired(state.admin.expiredAt)
  ) {
    clearSession();
    resetAdminState();
    resetViewerState();

    alert("Session หมดอายุ กรุณา login ใหม่");
    renderHeader();
    renderApp();

    throw new Error("Admin session required");
  }

  return true;
}

/* =======================================
   LOGOUT (ใช้จาก UI ได้ทันที)
======================================= */
function logoutAdminSession() {
  clearSession();
  resetAdminState();
  resetViewerState();

  renderHeader();
  renderApp();
}

