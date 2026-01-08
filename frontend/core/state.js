// ================================
// GLOBAL APP STATE (SAFE VERSION)
// ================================

window.AppState = {
  // ===== APP MODE =====
  mode: "viewer", // "viewer" | "admin"

  // ===== VIEWER =====
  search: "",
  products: [],
  selectedProduct: null,
  qty: 1,
  cart: [],
  lastOrder: null,
  isSubmitting: false,

  // ===== ADMIN =====
  admin: {
    loggedIn: false,
    user: null,
    token: null,
    expiredAt: null,

    orders: [],
    selectedOrder: null,
    logs: []
  },

  // ===== UI CONTROL =====
  ui: {
    overlayCount: 0,
    backdropLocked: false
  }
};

// ================================
// STATE HELPERS (อ่านง่าย ปลอดภัย)
// ================================

window.getState = () => window.AppState;

window.resetAdminState = () => {
  AppState.admin = {
    loggedIn: false,
    user: null,
    token: null,
    expiredAt: null,
    orders: [],
    selectedOrder: null,
    logs: []
  };
};

window.resetViewerState = () => {
  AppState.mode = "viewer";
  AppState.search = "";
  AppState.selectedProduct = null;
  AppState.qty = 1;
};
