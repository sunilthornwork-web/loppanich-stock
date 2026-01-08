/* =====================================================
   api/client.js
   Central API Client (Auth-aware)
===================================================== */

import { getAuthToken, logoutAdmin } from "../core/session.js";

/* =========================
   CONFIG
========================= */

let API_URL = "";

/**
 * Set API base URL (call once on init)
 */
export function setApiUrl(url) {
  if (!url) throw new Error("API URL is required");
  API_URL = url;
}

/* =========================
   CORE REQUEST
========================= */

async function request({
  method = "GET",
  action,
  params = {},
  auth = false
}) {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  if (!action) {
    throw new Error("Missing action");
  }

  let res;
  let json;

  // ================= POST =================
  if (method === "POST") {
    const form = new URLSearchParams();
    form.append("action", action);

    // attach params
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        form.append(k, v);
      }
    });

    // attach token
    if (auth) {
      const token = getAuthToken();
      if (!token) {
        handleAuthError("Missing token");
        throw new Error("Not authenticated");
      }
      form.append("token", token);
    }

    res = await fetch(API_URL, {
      method: "POST",
      body: form
    });
  }

  // ================= GET =================
  else {
    const query = new URLSearchParams();
    query.append("action", action);

    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        query.append(k, v);
      }
    });

    if (auth) {
      const token = getAuthToken();
      if (!token) {
        handleAuthError("Missing token");
        throw new Error("Not authenticated");
      }
      query.append("token", token);
    }

    res = await fetch(`${API_URL}?${query.toString()}`);
  }

  json = await res.json();

  // ================= ERROR HANDLING =================
  if (!json || json.success !== true) {
    const message =
      json?.error ||
      json?.message ||
      "API request failed";

    // 🔐 auth error → force logout
    if (
      message === "Session expired" ||
      message === "Invalid token" ||
      message === "Missing token"
    ) {
      handleAuthError(message);
    }

    throw new Error(message);
  }

  return json;
}

/* =========================
   AUTH ERROR HANDLER
========================= */

function handleAuthError(reason) {
  console.warn("Auth error:", reason);
  logoutAdmin(); // 🔥 source of truth
}

/* =========================
   PUBLIC API
========================= */

export const api = {
  /* ===== PUBLIC ===== */
  getProducts() {
    return request({
      method: "GET",
      action: "products"
    });
  },

  createOrder({ items, total }) {
    return request({
      method: "POST",
      action: "createOrder",
      params: {
        items: JSON.stringify(items),
        total
      }
    });
  },

  /* ===== ADMIN ===== */

  loginAdmin({ username, password }) {
    // ❗ login ไม่ผ่าน request() เพราะยังไม่มี token
    throw new Error("Use session.loginAdmin instead");
  },

  getOrders() {
    return request({
      method: "POST",
      action: "orders",
      auth: true
    });
  },

  approveOrder(orderId) {
    return request({
      method: "POST",
      action: "approveOrder",
      auth: true,
      params: { orderId }
    });
  },

  rejectOrder(orderId) {
    return request({
      method: "POST",
      action: "rejectOrder",
      auth: true,
      params: { orderId }
    });
  },

  stockIn({ productId, qty, reason }) {
    return request({
      method: "POST",
      action: "stockIn",
      auth: true,
      params: {
        productId,
        qty,
        reason
      }
    });
  },

  stockAdjust({ productId, newQty, reason }) {
    return request({
      method: "POST",
      action: "stockAdjust",
      auth: true,
      params: {
        productId,
        newQty,
        reason
      }
    });
  },

  getStockLogs() {
    return request({
      method: "GET",
      action: "stockLogs",
      auth: true
    });
  },

  addProduct(data) {
    return request({
      method: "POST",
      action: "addProduct",
      auth: true,
      params: data
    });
  },

  updateProduct(data) {
    return request({
      method: "POST",
      action: "updateProduct",
      auth: true,
      params: data
    });
  }
};
