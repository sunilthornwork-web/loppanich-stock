/* =====================================================
   core/state.js
   Global Application State (Single Source of Truth)
===================================================== */

/**
 * ❗ RULES
 * - UI อ่าน state อย่างเดียว
 * - API / actions เป็นคนแก้ state
 * - ห้ามแก้ state ตรง ๆ นอกไฟล์นี้
 */

/* =========================
   INITIAL STATE
========================= */

const state = {
  /* ================= VIEW MODE ================= */
  mode: "viewer", // "viewer" | "admin"

  /* ================= PRODUCT ================= */
  products: [],
  search: "",
  selectedProduct: null,

  /* ================= CART ================= */
  cart: [],
  qty: 1,
  lastOrder: null,
  isSubmitting: false,

  /* ================= ADMIN ================= */
  admin: {
    loggedIn: false,
    token: null,
    username: null,
    expiredAt: null,

    orders: [],
    selectedOrder: null,
    stockLogs: []
  },

  /* ================= UI ================= */
  ui: {
    overlayCount: 0,
    backdropLocked: false
  }
};

/* =========================
   READ ONLY ACCESS
========================= */

export function getState() {
  return state;
}

/* =========================
   STATE MUTATORS (SAFE)
========================= */

/**
 * เปลี่ยน mode (viewer / admin)
 */
export function setMode(mode) {
  if (mode !== "viewer" && mode !== "admin") {
    console.warn("Invalid mode:", mode);
    return;
  }
  state.mode = mode;
}

/**
 * ================= PRODUCTS
 */
export function setProducts(products) {
  state.products = Array.isArray(products) ? products : [];
}

export function setSearch(keyword) {
  state.search = String(keyword || "").toLowerCase();
}

export function selectProduct(product) {
  state.selectedProduct = product || null;
  state.qty = 1;
}

/**
 * ================= CART
 */
export function addToCart(item) {
  if (!item || !item.productId) return;

  const existing = state.cart.find(
    i => i.productId === item.productId
  );

  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    state.cart.push({
      productId: item.productId,
      name: item.name,
      price: item.price,
      qty: item.qty || 1
    });
  }
}

export function removeFromCart(index) {
  if (index < 0 || index >= state.cart.length) return;
  state.cart.splice(index, 1);
}

export function clearCart() {
  state.cart.length = 0;
}

/**
 * ================= ADMIN SESSION
 */
export function setAdminSession({ token, username, expiredAt }) {
  state.admin.loggedIn = true;
  state.admin.token = token;
  state.admin.username = username;
  state.admin.expiredAt = expiredAt;
}

export function clearAdminSession() {
  state.admin.loggedIn = false;
  state.admin.token = null;
  state.admin.username = null;
  state.admin.expiredAt = null;
  state.admin.orders = [];
  state.admin.selectedOrder = null;
  state.admin.stockLogs = [];
}

/**
 * ================= ADMIN DATA
 */
export function setOrders(orders) {
  state.admin.orders = Array.isArray(orders) ? orders : [];
}

export function selectOrder(order) {
  state.admin.selectedOrder = order || null;
}

export function setStockLogs(logs) {
  state.admin.stockLogs = Array.isArray(logs) ? logs : [];
}

/**
 * ================= UI HELPERS
 */
export function lockBackdrop() {
  state.ui.backdropLocked = true;
}

export function unlockBackdrop() {
  state.ui.backdropLocked = false;
}

export function incOverlay() {
  state.ui.overlayCount++;
}

export function decOverlay() {
  state.ui.overlayCount = Math.max(0, state.ui.overlayCount - 1);
}

/* =========================
   DEBUG (DEV ONLY)
========================= */

// เปิดดู state ใน console ได้
window.__STATE__ = state;

