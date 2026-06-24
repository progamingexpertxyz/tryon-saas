import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const origin = new URL(req.url).origin;

  const js = `(function () {
  "use strict";

  var API_URL = "${origin}/api/generate-tryon";

  function injectStyles() {
    if (document.getElementById("tryon-widget-styles")) return;
    var style = document.createElement("style");
    style.id = "tryon-widget-styles";
    style.textContent = [
      ".tryon-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:#facc15;color:#000;font-weight:700;font-size:14px;border:none;border-radius:10px;cursor:pointer;transition:background .2s;}",
      ".tryon-btn:hover{background:#fde047;}",
      ".tryon-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99999;align-items:center;justify-content:center;}",
      ".tryon-overlay.open{display:flex;}",
      ".tryon-modal{background:#111;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:28px;width:min(480px,95vw);color:#fff;font-family:system-ui,sans-serif;}",
      ".tryon-modal h2{margin:0 0 4px;font-size:18px;font-weight:800;}",
      ".tryon-modal p{margin:0 0 20px;font-size:13px;color:rgba(255,255,255,.4);}",
      ".tryon-drop{border:2px dashed rgba(255,255,255,.15);border-radius:12px;padding:32px 16px;text-align:center;cursor:pointer;transition:border-color .2s;margin-bottom:16px;}",
      ".tryon-drop:hover,.tryon-drop.dragover{border-color:#facc15;}",
      ".tryon-drop span{font-size:13px;color:rgba(255,255,255,.4);}",
      ".tryon-preview{width:100%;max-height:220px;object-fit:contain;border-radius:10px;display:none;margin-bottom:16px;}",
      ".tryon-actions{display:flex;gap:10px;justify-content:flex-end;}",
      ".tryon-submit{padding:10px 22px;background:#facc15;color:#000;font-weight:700;font-size:13px;border:none;border-radius:10px;cursor:pointer;}",
      ".tryon-submit:disabled{opacity:.5;cursor:not-allowed;}",
      ".tryon-cancel{padding:10px 16px;background:rgba(255,255,255,.07);color:#fff;font-size:13px;border:none;border-radius:10px;cursor:pointer;}",
      ".tryon-result{width:100%;border-radius:12px;margin-top:16px;display:none;}",
      ".tryon-error{color:#f87171;font-size:13px;margin-top:12px;display:none;}",
      ".tryon-spinner{display:inline-block;width:18px;height:18px;border:2px solid rgba(0,0,0,.3);border-top-color:#000;border-radius:50%;animation:tryon-spin .7s linear infinite;vertical-align:middle;margin-right:6px;}",
      "@keyframes tryon-spin{to{transform:rotate(360deg);}}"
    ].join("");
    document.head.appendChild(style);
  }

  function buildModal(apiKey, productImageUrl, buttonText) {
    var overlay = document.createElement("div");
    overlay.className = "tryon-overlay";

    overlay.innerHTML = [
      '<div class="tryon-modal">',
        '<h2>Virtual Try-On</h2>',
        '<p>Upload your photo to see how this item looks on you.</p>',
        '<div class="tryon-drop" id="tryon-drop">',
          '<span>Click or drag &amp; drop your photo here</span>',
          '<input type="file" accept="image/jpeg,image/png,image/webp" style="display:none" id="tryon-file-input">',
        '</div>',
        '<img class="tryon-preview" id="tryon-preview" alt="Your photo preview">',
        '<div class="tryon-actions">',
          '<button class="tryon-cancel" id="tryon-cancel">Cancel</button>',
          '<button class="tryon-submit" id="tryon-submit" disabled>Try It On</button>',
        '</div>',
        '<img class="tryon-result" id="tryon-result" alt="Try-on result">',
        '<div class="tryon-error" id="tryon-error"></div>',
      '</div>'
    ].join("");

    document.body.appendChild(overlay);

    var drop = overlay.querySelector("#tryon-drop");
    var fileInput = overlay.querySelector("#tryon-file-input");
    var preview = overlay.querySelector("#tryon-preview");
    var submitBtn = overlay.querySelector("#tryon-submit");
    var cancelBtn = overlay.querySelector("#tryon-cancel");
    var resultImg = overlay.querySelector("#tryon-result");
    var errorDiv = overlay.querySelector("#tryon-error");
    var selectedFile = null;

    function selectFile(file) {
      if (!file || !file.type.startsWith("image/")) return;
      selectedFile = file;
      var reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        submitBtn.disabled = false;
      };
      reader.readAsDataURL(file);
      resultImg.style.display = "none";
      errorDiv.style.display = "none";
    }

    drop.addEventListener("click", function () { fileInput.click(); });
    fileInput.addEventListener("change", function () { selectFile(fileInput.files[0]); });
    drop.addEventListener("dragover", function (e) { e.preventDefault(); drop.classList.add("dragover"); });
    drop.addEventListener("dragleave", function () { drop.classList.remove("dragover"); });
    drop.addEventListener("drop", function (e) {
      e.preventDefault();
      drop.classList.remove("dragover");
      selectFile(e.dataTransfer.files[0]);
    });

    cancelBtn.addEventListener("click", function () {
      overlay.classList.remove("open");
    });

    submitBtn.addEventListener("click", function () {
      if (!selectedFile) return;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="tryon-spinner"></span>Processing...';
      errorDiv.style.display = "none";
      resultImg.style.display = "none";

      fetch(productImageUrl)
        .then(function (r) { return r.blob(); })
        .then(function (clothBlob) {
          var form = new FormData();
          form.append("person_image", selectedFile, selectedFile.name);
          form.append("cloth_image", clothBlob, "product.jpg");
          return fetch(API_URL, {
            method: "POST",
            headers: { "x-api-key": apiKey },
            body: form,
          });
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.error) throw new Error(data.error);
          resultImg.src = data.image;
          resultImg.style.display = "block";
        })
        .catch(function (err) {
          errorDiv.textContent = err.message || "Something went wrong. Please try again.";
          errorDiv.style.display = "block";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Try It On";
        });
    });

    return {
      open: function () { overlay.classList.add("open"); },
    };
  }

  function init() {
    injectStyles();
    var containers = document.querySelectorAll("[data-tryon-key]");
    containers.forEach(function (el) {
      var apiKey = el.getAttribute("data-tryon-key");
      var productImage = el.getAttribute("data-tryon-product");
      var btnText = el.getAttribute("data-tryon-text") || "Try This On";
      if (!apiKey || !productImage) return;

      var modal = buildModal(apiKey, productImage, btnText);

      var btn = document.createElement("button");
      btn.className = "tryon-btn";
      btn.innerHTML = [
        '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">',
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>',
        '</svg>',
        btnText
      ].join("");
      btn.addEventListener("click", function () { modal.open(); });
      el.appendChild(btn);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();`;

  return new NextResponse(js, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
