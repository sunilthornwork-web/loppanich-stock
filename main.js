// ================================
// MAIN ENTRY
// ================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("App started");
  renderHeader();
  renderApp();
});

// ================================
// RENDER CORE
// ================================

function renderHeader() {
  const state = getState();
  const header = document.getElementById("appHeader");

  if (!header) return;

  if (state.mode === "viewer") {
    header.innerHTML = `
      <div>
        <strong>รายการสินค้า</strong>
      </div>
      <button onclick="openAdminLogin()">☰</button>
    `;
  }

  if (state.mode === "admin") {
    header.innerHTML = `
      <div>
        <strong>Admin Panel</strong>
      </div>
      <button onclick="logoutAdmin()">ออก</button>
    `;
  }
}

function renderApp() {
  const state = getState();
  const app = document.getElementById("app");

  if (!app) return;

  if (state.mode === "viewer") {
    app.innerHTML = `
      <div style="color:#888;text-align:center;margin-top:40px">
        🔍 Viewer Mode (รอเชื่อม backend)
      </div>
    `;
  }

  if (state.mode === "admin") {
    app.innerHTML = `
      <div style="color:#ff3b30;text-align:center;margin-top:40px">
        🛠 Admin Mode
      </div>
    `;
  }
}

// ================================
// ADMIN FLOW (ยังไม่เรียก API)
// ================================

function openAdminLogin() {
  const sheet = document.getElementById("adminLoginSheet");

  sheet.innerHTML = `
    <h3>Admin Login</h3>
    <input placeholder="Username">
    <input type="password" placeholder="Password">
    <button onclick="fakeLogin()">Login</button>
  `;

  sheet.classList.add("show");
}

function fakeLogin() {
  const state = getState();

  state.mode = "admin";
  state.admin.loggedIn = true;
  state.admin.user = "admin";

  closeAllSheets();
  renderHeader();
  renderApp();
}

function logoutAdmin() {
  resetAdminState();
  resetViewerState();
  renderHeader();
  renderApp();
}

// ================================
// UTIL
// ================================

function closeAllSheets() {
  document
    .querySelectorAll(".sheet.show")
    .forEach(el => el.classList.remove("show"));
}

