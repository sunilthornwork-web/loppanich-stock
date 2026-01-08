const state = {
  mode: "viewer",
  search: "",
  products: [],
  selectedProduct: null,
  qty: 1,
  cart: [],
  lastOrder: null,
  isSubmitting: false,

  admin: {
    loggedIn: false,
    user: null,
    orders: [],
    selectedOrder: null,
    logs: []
  },

  ui: {
    overlayCount: 0
  }
};

export default state;
