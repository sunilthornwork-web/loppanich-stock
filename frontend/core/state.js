/* =========================================================
   GLOBAL STATE (SINGLE SOURCE OF TRUTH)
   Phase 4 – Frontend Architecture
   ---------------------------------------------------------
   ⚠️ RULES
   - ห้าม mutate state แบบสุ่ม
   - ใช้ state กลางตัวนี้เท่านั้น
   - import ใช้ร่วมกันทุก module
========================================================= */

const state = {
  /* ================= VIEW MODE ================= */
  mode: "viewer",              // "viewer" | "admin"
  search: "",                  // search keyword (lowercase)

  /* ================= PRODUCT ================= */
  products: [],                // product list (from API)
  selectedProduct: null,       // product object
  qty: 1,                      // qty selector

  /* ================= CART ================= */
  cart: [],                    // [{ productId, name, price, qty }]
  lastOrder: null,             // { orderId, items, total, createdAt }

  /* ================= UI STATE ================= */
  isSubmitting: false,         // global submit lock

  ui: {
    overlayCount: 0            // overlay manager counter
  },

  /* ================= ADMIN ================= */
  admin: {
    loggedIn: false,           // auth state
    user: null,                // username
    token: null,               // session token
    expiredAt: null,           // Date / string

    orders: [],                // admin orders
    selectedOrder: null,       // active order
    logs: []                   // stock logs
  }
};

/* =========================================================
   DEV SAFETY (OPTIONAL)
   ---------------------------------------------------------
   ป้องกันการ overwrite state ทั้งก้อนโดยไม่ตั้งใจ
   (ยังอนุญาตให้แก้ไข property ข้างในได้)
========================================================= */

// Object.seal(state); // 🔒 เปิดได้ถ้าต้องการ strict มากขึ้น

export default state;

