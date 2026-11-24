const DEFAULTS = { count: 6, maxWords: 2, source: "ddg" };
const $ = id => document.getElementById(id);

browser.storage.local.get(DEFAULTS).then(s => {
  $("count").value = s.count;
  $("maxWords").value = s.maxWords;
  $("source").value = s.source;
});

$("save").addEventListener("click", async () => {
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, parseInt(v, 10) || lo));
  await browser.storage.local.set({
    count: clamp($("count").value, 1, 12),
    maxWords: clamp($("maxWords").value, 1, 5),
    source: $("source").value
  });
  $("saved").textContent = "Saved";
  setTimeout(() => ($("saved").textContent = ""), 1500);
});
