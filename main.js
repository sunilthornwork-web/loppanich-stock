/* ======================================================
   main.js
   Entry Point – Frontend App (Login + Guard Ready)
====================================================== */

/* ================= IMPORTS ================= */
import { state } from "./core/state.js";
import {
  restoreSession,
  loginAdmin,
  logoutAdmin,
  isSessionValid
} from "./core/session.js";
import { api, setApiUrl } from "./api/client.js";

/* ================= CONFIG ================= */

// 🔗 ตั้ง API URL แค่จุดเดียว
setApiUrl("https://script.google.com/macros/s/AKfycbxU-C4aaBNkX_Ggz9txAdGLusXQZu07T24MPs_5QknESvMZrDckCQ9-n_RMQwVn1e_9/exec");

/* ================= BOOTSTRAP ================= */

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  try {
    // 1️⃣ Restore admin session (ถ้ามี)
    const restored = restoreSession();

    // 2️⃣ โหลดสินค้า (viewer ใช้ได้ทันที)
    state.products = await api.getProducts().then(r => r.data);

    // 3️⃣ ถ้า admin session ยัง valid → เข้า admin mode
    if (restored && isSessionValid()) {
      state.mode = "admin";
      state.admin.loggedIn = true;
    } else {
      state.mode = "viewer";
    }

    // 4️⃣ Render UI
    renderHeader();
    renderProducts();

  } catch (err) {
    console.error("Init error:", err);
    alert("ไม่สามารถโหลดระบบได้");
  }
}

/* ================= VIEWER ACTIONS ================= */

window.refreshProducts = async function refreshProducts() {
  state.products = await api.getProducts().then(r => r.data);
  renderProducts();
};

/* ================= ADMIN AUTH ================= */

window.handleAdminLogin = async function handleAdminLogin() {
  const userEl = document.getElementById("adminUser");
  const passEl = document.getElementById("adminPass");

  const username = userEl?.value.trim();
  const password = passEl?.value;

  if (!username || !password) {
    alert("กรุณากรอก Username และ Password");
    return;
  }

  try {
    await loginAdmin(username, password);

    state.admin.loggedIn = true;
    state.mode = "admin";

    closeAllOverlays();
    renderHeader();
    renderProducts();

  } catch (err) {
    alert(err.message || "Login failed");
  }
};

window.exitAdmin = function exitAdmin() {
  logoutAdmin();

  state.mode = "viewer";
  state.admin.loggedIn = false;
  state.admin.orders = [];
  state.admin.logs = [];

  closeAllOverlays();
  renderHeader();
  renderProducts();
};

/* ================= ADMIN DATA ================= */

window.loadOrders = async function loadOrders() {
  try {
    guardAdmin();

    const res = await api.getOrders();
    state.admin.orders = res.data;

    renderAdminOrders();

  } catch (err) {
    handleAuthError(err);
  }
};

window.approveOrder = async function approveOrderUI(orderId) {
  try {
    guardAdmin();
    await api.approveOrder(orderId);

    alert("Approved");
    await refreshProducts();
    await loadOrders();

  } catch (err) {
    handleAuthError(err);
  }
};

window.rejectOrder = async function rejectOrderUI(orderId) {
  try {
    guardAdmin();
    await api.rejectOrder(orderId);

    alert("Rejected");
    await refreshProducts();
    await loadOrders();

  } catch (err) {
    handleAuthError(err);
  }
};

/* ================= GUARDS ================= */

function guardAdmin() {
  if (!isSessionValid()) {
    throw new Error("Session expired");
  }
}

function handleAuthError(err) {
  console.error(err);

  if (
    err.message?.includes("Session") ||
    err.message?.includes("token")
  ) {
    alert("Session หมดอายุ กรุณา login ใหม่");
    exitAdmin();
    return;
  }

  alert(err.message || "เกิดข้อผิดพลาด");
}

/* ================= UI HELPERS ================= */

// ❗ ฟังก์ชันพวกนี้คุณมีอยู่แล้ว
// main.js เรียกใช้ ไม่ยุ่งกับ implementation

function renderHeader() {
  if (typeof window.renderHeader === "function") {
    window.renderHeader();
  }
}

function renderProducts() {
  if (typeof window.renderProducts === "function") {
    window.renderProducts();
  }
}

function renderAdminOrders() {
  if (typeof window.renderAdminOrders === "function") {
    window.renderAdminOrders();
  }
}

function closeAllOverlays() {
  document
    .querySelectorAll(".sheet.show, .side-menu.show")
    .forEach(el => el.classList.remove("show"));
}
