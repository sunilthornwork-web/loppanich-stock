/* =====================================================
   Overlay Manager (Production Version)
   - Single source for all sheets / menus / backdrop
   ===================================================== */

/* ================= GLOBAL REFERENCE ================= */

// backdrop ต้องมีอยู่ใน DOM
const overlayBackdrop = document.getElementById("globalBackdrop");

// internal state (ไม่ปะปนกับ app state)
const OverlayManager = (() => {
  let stack = [];              // เก็บ overlay ที่เปิดอยู่ (LIFO)
  let locked = false;          // ล็อก backdrop (confirm / submit)
  
  /* ================= PRIVATE ================= */

  function showBackdrop() {
    if (!overlayBackdrop) return;
    overlayBackdrop.style.display = "block";
  }

  function hideBackdrop() {
    if (!overlayBackdrop) return;
    overlayBackdrop.style.display = "none";
  }

  function updateBackdrop() {
    if (stack.length > 0) {
      showBackdrop();
    } else {
      hideBackdrop();
      locked = false;
    }
  }

  function isOpen(el) {
    return el && el.classList.contains("show");
  }

  /* ================= PUBLIC API ================= */

  return {
    /* ---------- OPEN ---------- */
    open(el) {
      if (!el) return;

      // กัน open ซ้ำ
      if (isOpen(el)) return;

      el.classList.add("show");
      stack.push(el);

      updateBackdrop();
    },

    /* ---------- CLOSE ---------- */
    close(el) {
      if (!el || !isOpen(el)) return;

      el.classList.remove("show");

      // ลบออกจาก stack
      stack = stack.filter(x => x !== el);

      updateBackdrop();
    },

    /* ---------- CLOSE TOP ---------- */
    closeTop() {
      if (locked) return;
      if (stack.length === 0) return;

      const top = stack[stack.length - 1];
      this.close(top);
    },

    /* ---------- CLOSE ALL ---------- */
    closeAll({ force = false } = {}) {
      if (locked && !force) return;

      stack.forEach(el => {
        if (el && el.classList.contains("show")) {
          el.classList.remove("show");
        }
      });

      stack = [];
      locked = false;
      hideBackdrop();
    },

    /* ---------- LOCK BACKDROP ---------- */
    lock() {
      locked = true;
    },

    unlock() {
      locked = false;
    },

    isLocked() {
      return locked;
    },

    /* ---------- DEBUG / STATE ---------- */
    getStack() {
      return [...stack];
    }
  };
})();

/* ================= BACKDROP CLICK ================= */

if (overlayBackdrop) {
  overlayBackdrop.addEventListener("click", () => {
    OverlayManager.closeTop();
  });
}

/* ================= EXPORT (GLOBAL) ================= */

// ใช้แบบ global ได้ทันที
window.OverlayManager = OverlayManager;

