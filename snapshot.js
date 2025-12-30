// snapshot.js
// Stable dashboard data source: ./data.json (works on GitHub Pages)

export async function loadSnapshot() {
  const url = "./data.json?v=" + Date.now(); // bust cache
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Snapshot not found: " + res.status);
  return await res.json();
}

export function safeNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

export function showBanner(msg) {
  let b = document.getElementById("topBanner");
  if (!b) {
    b = document.createElement("div");
    b.id = "topBanner";
    b.style.cssText =
      "position:sticky;top:0;z-index:9999;margin:10px auto;max-width:900px;" +
      "background:#fff3cd;border:1px solid #ffeeba;color:#856404;" +
      "padding:10px 12px;border-radius:12px;font-weight:600;";
    document.body.prepend(b);
  }
  b.textContent = msg;
}