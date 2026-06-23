/**
 * TryOnAI Widget — embed virtual try-on on any site.
 * Usage: <script src="/widget/tryon.js" data-api-key="sk_live_..."></script>
 */
(function () {
  "use strict";

  var script = document.currentScript || (function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();

  var API_KEY = script.getAttribute("data-api-key") || "";
  var API_URL = script.src.replace(/\/widget\/tryon\.js.*$/, "") + "/api/generate-tryon";

  if (!API_KEY) {
    console.warn("[TryOnAI] No data-api-key provided. Widget will not work.");
    return;
  }

  // Inject CSS
  var style = document.createElement("style");
  style.textContent = [
    ".tryon-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;background:#facc15;color:#0f172a;border:none;border-radius:14px;font-size:14px;font-weight:700;cursor:pointer;transition:background .2s;}",
    ".tryon-btn:hover{background:#eab308;}",
    ".tryon-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;}",
    ".tryon-modal{background:#fff;border-radius:20px;width:100%;max-width:680px;max-height:95vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 25px 60px rgba(0,0,0,.3);}",
    ".tryon-header{background:#0f172a;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;}",
    ".tryon-header h2{color:#fff;font-size:18px;font-weight:800;margin:0;}",
    ".tryon-close{background:rgba(255,255,255,.1);border:none;color:#fff;width:32px;height:32px;border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;}",
    ".tryon-body{padding:24px;overflow-y:auto;background:#f8fafc;display:flex;flex-direction:column;gap:16px;}",
    ".tryon-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}",
    ".tryon-upload{border:2px dashed #cbd5e1;border-radius:14px;background:#fff;min-height:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;}",
    ".tryon-upload img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;}",
    ".tryon-upload-label{font-size:12px;color:#64748b;text-align:center;padding:12px;z-index:1;}",
    ".tryon-generate{width:100%;padding:14px;background:#facc15;color:#0f172a;border:none;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;transition:background .2s;}",
    ".tryon-generate:hover{background:#eab308;}",
    ".tryon-generate:disabled{opacity:.4;cursor:not-allowed;}",
    ".tryon-result{border-radius:14px;overflow:hidden;background:#f1f5f9;min-height:200px;display:flex;align-items:center;justify-content:center;}",
    ".tryon-result img{max-width:100%;max-height:500px;object-fit:contain;}",
    ".tryon-error{background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:12px 16px;color:#dc2626;font-size:13px;}",
    ".tryon-loader{display:flex;flex-direction:column;align-items:center;gap:12px;padding:32px;}",
    ".tryon-spinner{width:40px;height:40px;border:4px solid #e2e8f0;border-top-color:#facc15;border-radius:50%;animation:tryon-spin .8s linear infinite;}",
    "@keyframes tryon-spin{to{transform:rotate(360deg)}}",
  ].join("");
  document.head.appendChild(style);

  function createModal(clothUrl) {
    var overlay = document.createElement("div");
    overlay.className = "tryon-overlay";

    var modal = document.createElement("div");
    modal.className = "tryon-modal";

    modal.innerHTML = [
      '<div class="tryon-header">',
        '<h2>Virtual Try-On <span style="background:#facc15;color:#0f172a;font-size:11px;padding:2px 8px;border-radius:999px;margin-left:8px;">AI</span></h2>',
        '<button class="tryon-close" id="tryon-close-btn">&times;</button>',
      '</div>',
      '<div class="tryon-body">',
        '<div class="tryon-row">',
          '<div>',
            '<p style="font-size:12px;font-weight:700;color:#475569;margin-bottom:8px;">1. Your Photo</p>',
            '<div class="tryon-upload" id="tryon-person-box">',
              '<input type="file" accept="image/*" id="tryon-person-input" style="display:none">',
              '<div class="tryon-upload-label">Click or drop<br>your photo here</div>',
            '</div>',
          '</div>',
          '<div>',
            '<p style="font-size:12px;font-weight:700;color:#475569;margin-bottom:8px;">2. Clothing Item</p>',
            '<div class="tryon-upload" id="tryon-cloth-box">',
              '<input type="file" accept="image/*" id="tryon-cloth-input" style="display:none">',
              '<div class="tryon-upload-label">Product image<br>(auto-loaded)</div>',
            '</div>',
          '</div>',
        '</div>',
        '<button class="tryon-generate" id="tryon-gen-btn" disabled>Generate Try-On</button>',
        '<div id="tryon-result-area"></div>',
      '</div>',
    ].join("");

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    var personFile = null;
    var clothFile = null;

    function setPreview(box, src) {
      var existing = box.querySelector("img");
      if (existing) existing.remove();
      var img = document.createElement("img");
      img.src = src;
      box.insertBefore(img, box.firstChild);
    }

    function updateBtn() {
      document.getElementById("tryon-gen-btn").disabled = !(personFile && clothFile);
    }

    function handleFile(slot, file) {
      if (!file || !file.type.startsWith("image/")) return;
      if (slot === "person") {
        personFile = file;
        setPreview(document.getElementById("tryon-person-box"), URL.createObjectURL(file));
      } else {
        clothFile = file;
        setPreview(document.getElementById("tryon-cloth-box"), URL.createObjectURL(file));
      }
      updateBtn();
    }

    // Person upload
    var personBox = document.getElementById("tryon-person-box");
    var personInput = document.getElementById("tryon-person-input");
    personBox.addEventListener("click", function () { personInput.click(); });
    personInput.addEventListener("change", function () { handleFile("person", this.files[0]); this.value = ""; });

    // Cloth upload
    var clothBox = document.getElementById("tryon-cloth-box");
    var clothInput = document.getElementById("tryon-cloth-input");
    clothBox.addEventListener("click", function () { clothInput.click(); });
    clothInput.addEventListener("change", function () { handleFile("cloth", this.files[0]); this.value = ""; });

    // Pre-load cloth from product image
    if (clothUrl) {
      fetch(clothUrl, { mode: "cors" })
        .then(function (r) { return r.blob(); })
        .then(function (blob) {
          clothFile = new File([blob], "product.jpg", { type: blob.type || "image/jpeg" });
          setPreview(clothBox, clothUrl);
          updateBtn();
        })
        .catch(function () {
          setPreview(clothBox, clothUrl);
        });
    }

    // Generate
    document.getElementById("tryon-gen-btn").addEventListener("click", function () {
      var btn = this;
      var resultArea = document.getElementById("tryon-result-area");

      btn.disabled = true;
      btn.textContent = "Generating...";
      resultArea.innerHTML = '<div class="tryon-loader"><div class="tryon-spinner"></div><p style="font-size:13px;color:#64748b;">AI is processing your images (30–60s)</p></div>';

      var fd = new FormData();
      fd.append("person_image", personFile);
      fd.append("cloth_image", clothFile);

      fetch(API_URL, {
        method: "POST",
        headers: { "x-api-key": API_KEY },
        body: fd,
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
          if (!res.ok) {
            resultArea.innerHTML = '<div class="tryon-error">' + (res.data.error || "Something went wrong") + '</div>';
          } else {
            resultArea.innerHTML = '<div class="tryon-result"><img src="' + res.data.image + '" alt="Try-on result" /></div>';
          }
          btn.disabled = false;
          btn.textContent = "Generate Try-On";
        })
        .catch(function (err) {
          resultArea.innerHTML = '<div class="tryon-error">Network error: ' + err.message + '</div>';
          btn.disabled = false;
          btn.textContent = "Generate Try-On";
        });
    });

    // Close
    document.getElementById("tryon-close-btn").addEventListener("click", function () {
      document.body.removeChild(overlay);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) document.body.removeChild(overlay);
    });
  }

  // Auto-inject buttons next to product images
  function injectButtons() {
    var imgs = document.querySelectorAll("[data-tryon-image], .product-image img, .woocommerce-product-gallery img");
    imgs.forEach(function (el) {
      if (el.dataset.tryonInjected) return;
      el.dataset.tryonInjected = "true";

      var clothUrl = el.closest("[data-tryon-image]")
        ? el.closest("[data-tryon-image]").getAttribute("data-tryon-image")
        : el.src;

      var btn = document.createElement("button");
      btn.className = "tryon-btn";
      btn.innerHTML = '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> Virtual Try-On';
      btn.addEventListener("click", function () { createModal(clothUrl); });

      var container = document.createElement("div");
      container.style.marginTop = "8px";
      container.appendChild(btn);

      var parent = el.closest("[data-tryon-image]") || el.parentElement;
      parent.parentElement.insertBefore(container, parent.nextSibling);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectButtons);
  } else {
    injectButtons();
  }

  // Expose global for manual use
  window.TryOnAI = { open: function (clothUrl) { createModal(clothUrl); } };
})();
