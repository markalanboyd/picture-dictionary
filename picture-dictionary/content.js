// Watches for text selection and shows a picture-only popup.
(() => {
  const DEFAULTS = { count: 6, maxWords: 2, source: "ddg" };
  let host = null;

  async function getSettings() {
    const s = await browser.storage.local.get(DEFAULTS);
    return { ...DEFAULTS, ...s };
  }

  function closePopup() {
    if (host) { host.remove(); host = null; }
  }

  function showPopup(query, rect, settings) {
    closePopup();
    host = document.createElement("div");
    host.style.cssText = "all:initial; position:absolute; z-index:2147483647;";
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>
        .box { background:#fff; border:1px solid #888; border-radius:8px;
               padding:8px; box-shadow:0 4px 16px rgba(0,0,0,.3);
               max-width:460px; font-family:sans-serif; color:#555; }
        .grid { display:grid; grid-template-columns:repeat(auto-fill,104px); gap:6px; }
        img { width:104px; height:104px; object-fit:cover; border-radius:4px; background:#eee; }
      </style>
      <div class="box"><div class="grid"></div></div>`;
    const grid = root.querySelector(".grid");
    grid.textContent = "…";

    // Position just below the selection, kept on screen.
    const width = Math.min(460, settings.count * 110 + 20);
    let left = rect.left + window.scrollX;
    left = Math.max(window.scrollX + 8,
      Math.min(left, window.scrollX + document.documentElement.clientWidth - width - 8));
    host.style.left = left + "px";
    host.style.top = (rect.bottom + window.scrollY + 8) + "px";
    document.documentElement.appendChild(host);

    browser.runtime
      .sendMessage({ type: "search", query, count: settings.count, source: settings.source })
      .then(urls => {
        if (!host) return; // closed while loading
        grid.textContent = "";
        if (!urls || !urls.length) { grid.textContent = "No pictures found"; return; }
        urls.forEach(u => {
          const img = document.createElement("img");
          img.src = u;
          img.referrerPolicy = "no-referrer";
          img.onerror = () => img.remove();
          grid.appendChild(img);
        });
      });
  }

  document.addEventListener("mousedown", e => {
    if (host && !e.composedPath().includes(host)) closePopup();
  }, true);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closePopup();
  }, true);

  document.addEventListener("mouseup", e => {
    if (host && e.composedPath().includes(host)) return;
    setTimeout(async () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const text = sel.toString().trim();
      if (!text || text.length > 40) return;
      const settings = await getSettings();
      if (text.split(/\s+/).length > settings.maxWords) return;
      showPopup(text, sel.getRangeAt(0).getBoundingClientRect(), settings);
    }, 10);
  });
})();
