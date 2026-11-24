// Fetches image results. Runs in the extension's background, so it can
// call DuckDuckGo / Openverse without CORS problems.

async function searchDDG(query, count) {
  const q = encodeURIComponent(query);
  const page = await fetch(`https://duckduckgo.com/?q=${q}&iax=images&ia=images`);
  const html = await page.text();
  const m = html.match(/vqd=["']?([\d-]+)["']?/);
  if (!m) throw new Error("No DDG token");
  const res = await fetch(
    `https://duckduckgo.com/i.js?l=us-en&o=json&q=${q}&vqd=${m[1]}&f=,,,,,&p=1`
  );
  if (!res.ok) throw new Error("DDG " + res.status);
  const data = await res.json();
  return (data.results || [])
    .map(r => r.thumbnail || r.image)
    .filter(Boolean)
    .slice(0, count);
}

async function searchOpenverse(query, count) {
  const q = encodeURIComponent(query);
  const res = await fetch(
    `https://api.openverse.org/v1/images/?q=${q}&page_size=${count}`
  );
  if (!res.ok) throw new Error("Openverse " + res.status);
  const data = await res.json();
  return (data.results || [])
    .map(r => r.thumbnail || r.url)
    .filter(Boolean)
    .slice(0, count);
}

async function doSearch(query, count, source) {
  if (source === "ddg") {
    try {
      const urls = await searchDDG(query, count);
      if (urls.length) return urls;
    } catch (e) {
      console.warn("DDG failed, falling back to Openverse:", e);
    }
  }
  try {
    return await searchOpenverse(query, count);
  } catch (e) {
    console.error(e);
    return [];
  }
}

browser.runtime.onMessage.addListener(msg => {
  if (msg && msg.type === "search") {
    return doSearch(msg.query, msg.count, msg.source);
  }
});
